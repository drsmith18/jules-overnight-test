import Canvas from '@/components/Canvas';
import ControlPanel from '@/components/ControlPanel';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">
      <Canvas />
      <ControlPanel />
    </main>
  );
}
