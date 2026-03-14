'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useStore, Preset } from '@/store/useStore';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
  originalX?: number; // useful for matrix preset
}

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const preset = useStore((state) => state.preset);

  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);

  // Handle Resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, []);

  const initParticle = (p: Partial<Particle>, canvasWidth: number, canvasHeight: number, preset: Preset): Particle => {
    let x = Math.random() * canvasWidth;
    let y = Math.random() * canvasHeight;
    let vx = (Math.random() - 0.5) * 2;
    let vy = (Math.random() - 0.5) * 2;
    let size = Math.random() * 2 + 1;
    let life = Math.random() * 100 + 50;
    let maxLife = life;
    let color = 'rgba(255, 255, 255, 0.8)';
    let originalX = x;

    if (preset === 'ember') {
      y = canvasHeight + Math.random() * 100;
      size = Math.random() * 3 + 1;
      const hue = Math.floor(Math.random() * 40) + 10; // Orange/Red
      const alpha = Math.random() * 0.8 + 0.2;
      color = `rgba(255, ${hue * 2}, 0, ${alpha})`;
      vy = Math.random() * -2 - 1;
    } else if (preset === 'blizzard') {
      x = Math.random() * canvasWidth;
      y = -Math.random() * 100;
      size = Math.random() * 2 + 0.5;
      color = `rgba(200, 230, 255, ${Math.random() * 0.5 + 0.3})`;
      vx = Math.random() * 5 + 2;
      vy = Math.random() * 3 + 1;
    } else if (preset === 'matrix') {
      size = Math.random() * 1.5 + 0.5;
      x = Math.floor(Math.random() * (canvasWidth / 10)) * 10;
      y = -Math.random() * canvasHeight;
      color = `rgba(0, 255, 70, ${Math.random() * 0.8 + 0.2})`;
      vy = Math.random() * 3 + 2;
      vx = 0;
      originalX = x;
    }

    return {
      x, y, vx, vy, size, life, maxLife, color, originalX,
      ...p
    };
  };

  // Clear particles on preset change
  useEffect(() => {
    particlesRef.current = [];
  }, [preset]);

  // Main Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize by disabling alpha on context if we draw bg
    if (!ctx) return;

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 16.66; // Normalized delta time (~1 at 60fps)
      lastTime = time;

      const { width, height } = canvas;

      // Clear with slight trailing effect for some presets
      ctx.fillStyle = preset === 'matrix' ? 'rgba(2, 6, 23, 0.2)' : 'rgba(15, 23, 42, 1)';
      ctx.fillRect(0, 0, width, height);

      // Fetch latest state from store without subscribing to re-renders
      const { gravity, wind, friction, repulsion, particleCount } = useStore.getState();

      // Manage particle count pool
      const particles = particlesRef.current;

      // Add particles if needed
      while (particles.length < particleCount) {
        particles.push(initParticle({}, width, height, preset));
      }

      // Remove particles if too many
      if (particles.length > particleCount) {
        particles.length = particleCount;
      }

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active;

      ctx.save();
      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply forces
        if (preset !== 'matrix') {
          p.vy += gravity * 0.1 * dt;
          p.vx += wind * 0.1 * dt;

          p.vx *= friction;
          p.vy *= friction;
        }

        // Mouse repulsion
        if (isMouseActive && repulsion > 0 && preset !== 'matrix') {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          const repulseRadiusSq = 20000; // ~140px radius

          if (distSq < repulseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (1 - distSq / repulseRadiusSq) * repulsion * 0.1;
            p.vx += (dx / dist) * force * dt;
            p.vy += (dy / dist) * force * dt;
          }
        }

        // Apply velocity
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // Matrix specific constraints
        if (preset === 'matrix' && p.originalX !== undefined) {
           p.x = p.originalX; // force to column
        }

        p.life -= dt;

        // Render
        ctx.fillStyle = p.color;

        // Fading based on life
        let globalAlpha = 1;
        if (preset === 'ember') {
           globalAlpha = Math.max(0, p.life / p.maxLife);
        } else if (preset === 'matrix') {
           globalAlpha = Math.random() > 0.95 ? Math.random() : p.life/p.maxLife; // twinkling
        }
        ctx.globalAlpha = globalAlpha;

        ctx.beginPath();
        if (preset === 'matrix') {
           ctx.rect(p.x, p.y, p.size, p.size * 5); // draw lines
        } else {
           ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        }
        ctx.fill();

        // Respawn if dead or out of bounds
        if (
          p.life <= 0 ||
          (preset === 'ember' && p.y < -50) ||
          (preset === 'blizzard' && (p.x > width + 50 || p.y > height + 50)) ||
          (preset === 'matrix' && p.y > height + 50) ||
          p.x < -100 || p.x > width + 100 || p.y > height + 100
        ) {
          // Reset inline to avoid GC
          let newLife = Math.random() * 100 + 50;

          if (preset === 'ember') {
             p.x = Math.random() * width;
             p.y = height + 10;
             p.vx = (Math.random() - 0.5) * 2;
             p.vy = Math.random() * -2 - 1;
             newLife = Math.random() * 150 + 50;
          } else if (preset === 'blizzard') {
             p.x = Math.random() > 0.5 ? -10 : Math.random() * width;
             p.y = Math.random() > 0.5 ? -10 : Math.random() * height;
             p.vx = Math.random() * 5 + 2;
             p.vy = Math.random() * 3 + 1;
          } else if (preset === 'matrix') {
             p.x = Math.floor(Math.random() * (width / 10)) * 10;
             p.originalX = p.x;
             p.y = -Math.random() * height;
             p.vy = Math.random() * 3 + 2;
             newLife = Math.random() * 200 + 50;
          } else {
             p.x = Math.random() * width;
             p.y = Math.random() * height;
          }

          p.life = newLife;
          p.maxLife = newLife;
        }
      }
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [preset]);

  // Handle Mouse & Touch Move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };
    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, active: true };
      }
    };
    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchstart', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchstart', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-transparent">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
}
