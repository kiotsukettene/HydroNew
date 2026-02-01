import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import type {
  HarvestItem,
  HarvestStatistics,
  HarvestedResponse,
  HarvestedStore,
} from "@/types/harvested";

export const useHarvestedStore = create<HarvestedStore>((set, get) => ({
  items: [],
  statistics: null,
  total: 0,
  hasMore: false,
  loading: false,
  loadingMore: false,
  error: null,
  searchQuery: "",
  filterMonth: null,
  cache: null,
  lastFetchTime: null,

  fetchHarvested: async (reset = true, useCache = true) => {
    const state = get();
    
    // If reset and cache exists and is fresh (less than 5 minutes old), use cache
    if (reset && useCache && state.cache && state.lastFetchTime) {
      const cacheAge = Date.now() - state.lastFetchTime;
      const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
      
      if (cacheAge < CACHE_DURATION) {
        set({
          items: state.cache.items,
          statistics: state.cache.statistics,
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
    const offset = reset ? 0 : state.items.length;
    
    set({ 
      loading: reset, 
      loadingMore: !reset,
      error: null,
      ...(reset && { items: [] }) // Clear items only on reset
    });

    try {
      const params = new URLSearchParams();
      params.append("offset", offset.toString());
      params.append("limit", limit.toString());
      
      if (state.searchQuery) {
        params.append("search", state.searchQuery);
      }
      if (state.filterMonth) {
        params.append("month", state.filterMonth);
      }

      const response = await axiosInstance.get<HarvestedResponse>(
        `/hydroponic-yields?${params.toString()}`
      );

      const newItems = response.data.data || [];
      const statistics = response.data.statistics || null;
      const total = response.data.total || 0;
      const hasMore = response.data.has_more || false;
      
      const updatedItems = reset ? newItems : [...state.items, ...newItems];
      
      set({
        items: updatedItems,
        statistics: statistics,
        total: total,
        hasMore: hasMore,
        loading: false,
        loadingMore: false,
        error: null,
        // Cache the initial load
        ...(reset && {
          cache: {
            items: updatedItems,
            statistics: statistics,
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
        ...(reset && { items: [], statistics: null }),
      });
    }
  },

  loadMore: async () => {
    const { hasMore, loadingMore, loading } = get();
    if (!hasMore || loadingMore || loading) return;
    
    await get().fetchHarvested(false);
  },

  refresh: async () => {
    // Always bypass cache on manual refresh
    await get().fetchHarvested(true, false);
  },

  searchHarvested: async (search: string) => {
    set({ searchQuery: search, cache: null, lastFetchTime: null });
    await get().fetchHarvested(true, false);
  },

  filterByMonth: async (month: string | null) => {
    set({ filterMonth: month, cache: null, lastFetchTime: null });
    await get().fetchHarvested(true, false);
  },

  clearCache: () => {
    set({ cache: null, lastFetchTime: null });
  },

  resetError: () => set({ error: null }),
}));
