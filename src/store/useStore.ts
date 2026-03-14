import { create } from 'zustand';

export type Preset = 'custom' | 'ember' | 'blizzard' | 'matrix';

export interface PhysicsParams {
  gravity: number;
  wind: number;
  friction: number;
  repulsion: number;
  particleCount: number;
}

export interface StoreState extends PhysicsParams {
  preset: Preset;
  setGravity: (val: number) => void;
  setWind: (val: number) => void;
  setFriction: (val: number) => void;
  setRepulsion: (val: number) => void;
  setParticleCount: (val: number) => void;
  setPreset: (preset: Preset) => void;
}

const presetDefaults: Record<Exclude<Preset, 'custom'>, PhysicsParams> = {
  ember: {
    gravity: -0.2,
    wind: 0.5,
    friction: 0.98,
    repulsion: 50,
    particleCount: 2000,
  },
  blizzard: {
    gravity: 0.5,
    wind: 5.0,
    friction: 0.99,
    repulsion: 100,
    particleCount: 3000,
  },
  matrix: {
    gravity: 1.0,
    wind: 0.0,
    friction: 1.0,
    repulsion: 0,
    particleCount: 2000,
  },
};

export const useStore = create<StoreState>((set) => ({
  preset: 'ember',
  ...presetDefaults.ember,

  setGravity: (val) => set({ gravity: val, preset: 'custom' }),
  setWind: (val) => set({ wind: val, preset: 'custom' }),
  setFriction: (val) => set({ friction: val, preset: 'custom' }),
  setRepulsion: (val) => set({ repulsion: val, preset: 'custom' }),
  setParticleCount: (val) => set({ particleCount: val, preset: 'custom' }),
  setPreset: (preset) => {
    if (preset === 'custom') {
      set({ preset });
    } else {
      set({ preset, ...presetDefaults[preset] });
    }
  },
}));
