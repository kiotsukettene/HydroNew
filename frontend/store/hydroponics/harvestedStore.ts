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
  currentPage: 1,
  lastPage: 1,
  total: 0,
  loading: false,
  error: null,
  searchQuery: "",
  filterMonth: null,
  cache: {},

  fetchHarvested: async (page = 1, search = "", month = null, forceRefresh = false) => {
    const cacheKey = `${page}|${search}|${month || ""}`;
    const { cache } = get();

    // Return cached data if available and not forcing refresh
    if (cache[cacheKey] && !forceRefresh) {
      set(cache[cacheKey]);
      return;
    }

    // Clear items immediately when loading new data
    set({ loading: true, error: null, items: [] });

    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (search) {
        params.append("search", search);
      }
      if (month) {
        params.append("month", month);
      }

      const response = await axiosInstance.get<HarvestedResponse>(
        `/hydroponic-yields?${params.toString()}`
      );

      const data = response.data.data;
      const result = {
        items: data.data,
        statistics: response.data.statistics,
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
        searchQuery: search,
        filterMonth: month,
        loading: false,
        error: null,
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
      set({
        error: message,
        loading: false,
        items: [],
      });
    }
  },

  searchHarvested: async (search: string) => {
    const { filterMonth } = get();
    // Force refresh and clear cache when searching
    set({ cache: {} });
    await get().fetchHarvested(1, search, filterMonth, true);
  },

  filterByMonth: async (month: string | null) => {
    const { searchQuery } = get();
    // Force refresh and clear cache when filtering
    set({ cache: {} });
    await get().fetchHarvested(1, searchQuery, month, true);
  },

  nextPage: async () => {
    const { currentPage, lastPage, fetchHarvested, searchQuery, filterMonth } =
      get();
    if (currentPage < lastPage) {
      await fetchHarvested(currentPage + 1, searchQuery, filterMonth);
    }
  },

  prevPage: async () => {
    const { currentPage, fetchHarvested, searchQuery, filterMonth } = get();
    if (currentPage > 1) {
      await fetchHarvested(currentPage - 1, searchQuery, filterMonth);
    }
  },

  clearCache: () => set({ cache: {} }),
}));