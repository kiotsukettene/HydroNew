import { create } from 'zustand';

const initialState = {
  cleanWater: null,
  dirtyWater: null,
  hydroponicsWater: null,
  loading: false,
  error: null,
  lastUpdated: {
    cleanWater: null,
    dirtyWater: null,
    hydroponicsWater: null,
  },
};

export const useSensorStore = create<SensorDataState>((set) => ({
  ...initialState,

  updateCleanWater: (reading: SensorReading) => {
    set({
      cleanWater: reading,
      lastUpdated: {
        ...initialState.lastUpdated,
        cleanWater: new Date(),
      },
      error: null,
    });
  },

  updateDirtyWater: (reading: SensorReading) => {
    set({
      dirtyWater: reading,
      lastUpdated: {
        ...initialState.lastUpdated,
        dirtyWater: new Date(),
      },
      error: null,
    });
  },

  updateHydroponicsWater: (reading: SensorReading) => {
    set({
      hydroponicsWater: reading,
      lastUpdated: {
        ...initialState.lastUpdated,
        hydroponicsWater: new Date(),
      },
      error: null,
    });
  },

  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error, loading: false });
  },

  reset: () => {
    set(initialState);
  },
}));

