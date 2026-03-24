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
  water_amount: number;
  pump_config?: PumpConfig | null;
}

export const useHydroponicSetupStore = create<HydroponicSetupStore>((set, get) => ({
  loading: false,
  loadingMore: false,
  error: null,
  hydroponicSetups: [],
  currentSetup: null,
  currentPage: 1,
  lastPage: 1,
  total: 0,
  hasMore: false,
  cache: null,
  lastFetchTime: null,

  createHydroponicSetup: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/hydroponic-setups/store", data);
      // Invalidate cache after creating new setup
      set({ cache: null, lastFetchTime: null });
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
      // Invalidate cache after updating setup
      set({ cache: null, lastFetchTime: null });
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

  fetchHydroponicSetups: async (reset = true, useCache = true) => {
    const state = get();
    
    // If reset and cache exists and is fresh (less than 5 minutes old), use cache
    if (reset && useCache && state.cache && state.lastFetchTime) {
      const cacheAge = Date.now() - state.lastFetchTime;
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      if (cacheAge < CACHE_DURATION) {
        set({
          hydroponicSetups: state.cache.hydroponicSetups,
          total: state.cache.total,
          hasMore: state.cache.hasMore,
          loading: false,
          loadingMore: false,
        });
        return;
      }
    }
    
    // Prevent multiple simultaneous requests
    if (state.loading || state.loadingMore) {
      console.log('⚠️ Already loading, skipping request');
      return;
    }

    // Calculate offset based on current items
    const limit = 10;
    const offset = reset ? 0 : state.hydroponicSetups.length;
    
    // Set loading states without clearing existing data
    set({ 
      loading: reset, 
      loadingMore: !reset,
      error: null,
      // Don't clear data immediately - keep existing data visible
    });

    try {
      const response = await axiosInstance.get(`/hydroponic-setups?offset=${offset}&limit=${limit}`);
      
      const newSetups = response.data.data || [];
      const total = response.data.total || 0;
      const hasMore = response.data.has_more || false;
      
      const updatedSetups = reset ? newSetups : [...state.hydroponicSetups, ...newSetups];
      
      set({
        hydroponicSetups: updatedSetups,
        total: total,
        hasMore: hasMore,
        loading: false,
        loadingMore: false,
        error: null,
        // Cache the initial load
        ...(reset && {
          cache: {
            hydroponicSetups: updatedSetups,
            total: total,
            hasMore: hasMore,
          },
          lastFetchTime: Date.now(),
        }),
      });
      
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      console.error('❌ Fetch error:', message, err);
      set({
        error: message,
        loading: false,
        loadingMore: false,
        // Only clear data on error if we're resetting and have no cached data
        ...(reset && !state.cache && { hydroponicSetups: [] }),
      });
    }
  },

  loadMore: async () => {
    const { hasMore, loadingMore, loading } = get();
    if (!hasMore || loadingMore || loading) return;
    
    await get().fetchHydroponicSetups(false);
  },

  refresh: async () => {
    // Always bypass cache on manual refresh
    await get().fetchHydroponicSetups(true, false);
  },

  fetchSetupById: async (setupId: number) => {
    set({ loading: true, error: null, currentSetup: null });
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

  clearCache: () => {
    set({ cache: null, lastFetchTime: null });
  },

  clearAll: () => {
    set({ 
      hydroponicSetups: [], 
      cache: null, 
      lastFetchTime: null,
      currentSetup: null,
      currentPage: 1,
      hasMore: false,
      total: 0
    });
  },

  resetError: () => set({ error: null }),
}));