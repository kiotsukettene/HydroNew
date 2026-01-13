import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HydroponicSetupPayload {
  crop_name: string;
  number_of_crops: number;
  bed_size: "small" | "medium" | "large";
  nutrient_solution: string;
  target_ph_min: number;
  target_ph_max: number;
  target_tds_min: number;
  target_tds_max: number;
  water_amount: string;
  pump_config?: PumpConfig | null;
}

export const useHydroponicSetupStore = create<HydroponicSetupStore>((set, get) => ({
  loading: false,
  error: null,
  hydroponicSetups: [],
  currentSetup: null,
  currentPage: 1,
  lastPage: 1,
  total: 0,
  cache: {} as Record<string, any>,

  createHydroponicSetup: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/hydroponic-setups/store", data);
      // Clear cache after creating new setup to force fresh data fetch
      set({ cache: {} });
      console.log("Hydroponic setup created:", response.data);
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      console.error("Hydroponic setup creation failed:", message);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  updateHydroponicSetup: async (setupId, data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/hydroponic-setups/${setupId}`, data);
      // Clear cache after updating setup to force fresh data fetch
      set({ cache: {} });
      // Update currentSetup if it matches the updated setup
      const { currentSetup } = get();
      if (currentSetup && currentSetup.id === setupId) {
        set({ currentSetup: response.data.data });
      }
      console.log("Hydroponic setup updated:", response.data);
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      console.error("Hydroponic setup update failed:", message);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchHydroponicSetups: async (page = 1, forceRefresh = false) => {
    const cacheKey = `${page}`;
    const { cache } = get();

    // Return cached data if available and not forcing refresh
    if (!forceRefresh && cache[cacheKey]) {
      set(cache[cacheKey]);
      return;
    }

    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/hydroponic-setups?page=${page}`);
      const data = response.data.data;

      const result = {
        hydroponicSetups: data.data,
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        loading: false,
      };

      set(result);

      // Cache the result
      set({
        cache: {
          ...cache,
          [cacheKey]: result,
        },
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  fetchSetupById: async (setupId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/hydroponic-setups/${setupId}`);
      set({ 
        currentSetup: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  nextPage: async () => {
    const { currentPage, lastPage, fetchHydroponicSetups } = get();
    if (currentPage < lastPage) {
      await fetchHydroponicSetups(currentPage + 1);
    }
  },

  prevPage: async () => {
    const { currentPage, fetchHydroponicSetups } = get();
    if (currentPage > 1) {
      await fetchHydroponicSetups(currentPage - 1);
    }
  },

  clearCache: () => set({ cache: {} }),

  resetError: () => set({ error: null }),
}));