import { create } from 'zustand';

interface PumpStore {
  isPump2Running: boolean;
  setPump2Running: (isRunning: boolean) => void;
}

export const usePumpStore = create<PumpStore>((set) => ({
  isPump2Running: false,
  setPump2Running: (isRunning: boolean) => set({ isPump2Running: isRunning }),
}));
