'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Flame, Snowflake, Binary } from 'lucide-react';

export default function ControlPanel() {
  const {
    gravity,
    wind,
    friction,
    repulsion,
    particleCount,
    preset,
    setGravity,
    setWind,
    setFriction,
    setRepulsion,
    setParticleCount,
    setPreset
  } = useStore();

  return (
    <div className="absolute top-4 right-4 w-80 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl text-slate-200 z-10 flex flex-col gap-6">

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white mb-1">Atmosphera</h2>
        <p className="text-xs text-slate-400">Particle Physics Sandbox</p>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setPreset('ember')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            preset === 'ember'
              ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'
          }`}
        >
          <Flame size={20} className="mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Ember</span>
        </button>

        <button
          onClick={() => setPreset('blizzard')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            preset === 'blizzard'
              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'
          }`}
        >
          <Snowflake size={20} className="mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Blizzard</span>
        </button>

        <button
          onClick={() => setPreset('matrix')}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
            preset === 'matrix'
              ? 'bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]'
              : 'bg-slate-800/40 border-slate-700/50 text-slate-400 hover:bg-slate-800/80 hover:text-slate-300'
          }`}
        >
          <Binary size={20} className="mb-1" />
          <span className="text-[10px] font-medium uppercase tracking-wider">Matrix</span>
        </button>
      </div>

      <div className="h-px w-full bg-slate-700/50 my-2" />

      {/* Controls */}
      <div className="flex flex-col gap-5">

        {/* Particle Count */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Particles</label>
            <span className="text-xs text-slate-500 tabular-nums">{particleCount.toLocaleString()}</span>
          </div>
          <input
            type="range" min="100" max="10000" step="100"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Gravity */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Gravity</label>
            <span className="text-xs text-slate-500 tabular-nums">{gravity.toFixed(2)}</span>
          </div>
          <input
            type="range" min="-2" max="2" step="0.05"
            value={gravity}
            onChange={(e) => setGravity(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Wind */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Wind</label>
            <span className="text-xs text-slate-500 tabular-nums">{wind.toFixed(2)}</span>
          </div>
          <input
            type="range" min="-10" max="10" step="0.5"
            value={wind}
            onChange={(e) => setWind(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Friction */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Friction (Drag)</label>
            <span className="text-xs text-slate-500 tabular-nums">{friction.toFixed(3)}</span>
          </div>
          <input
            type="range" min="0.800" max="1.000" step="0.005"
            value={friction}
            onChange={(e) => setFriction(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Mouse Repulsion */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-medium text-slate-300 uppercase tracking-wide">Repulsion</label>
            <span className="text-xs text-slate-500 tabular-nums">{repulsion}</span>
          </div>
          <input
            type="range" min="0" max="200" step="5"
            value={repulsion}
            onChange={(e) => setRepulsion(Number(e.target.value))}
            className="w-full accent-indigo-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
        </div>

      </div>

    </div>
  );
}
