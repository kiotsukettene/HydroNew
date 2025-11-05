// store/helpCenterStore.ts
import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { HelpCenterState } from "@/types/helpcenter";

export const useHelpCenterStore = create<HelpCenterState>((set, get) => ({
  items: [],
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  filters: [],
  searchQuery: "",

 
  cache: {} as Record<string, any>,

  fetchHelpCenter: async (page = 1, search = "") => {
    const cacheKey = `${page}|${search}`;
    const { cache } = get();

  
    if (cache[cacheKey]) {
      set(cache[cacheKey]);
      return;
    }

    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get(
        `/help-center?page=${page}${search ? `&search=${search}` : ""}`
      );

      const data = response.data.data;

      const result = {
        items: data.data,
        currentPage: data.current_page,
        lastPage: data.last_page,
        filters: response.data.filters || [],
        searchQuery: search,
        loading: false,
      };

      set(result);

      set({
        cache: {
          ...cache,
          [cacheKey]: result,
        },
      });

    } catch (error: any) {
      set({
        loading: false,
        error:
          error.response?.data?.message ||
          "Failed to load Help Center data",
      });
    }
  },

  searchHelpCenter: async (search: string) => {
    await get().fetchHelpCenter(1, search);
  },

  nextPage: async () => {
    const { currentPage, lastPage, fetchHelpCenter, searchQuery } = get();
    if (currentPage < lastPage) {
      await fetchHelpCenter(currentPage + 1, searchQuery);
    }
  },

  prevPage: async () => {
    const { currentPage, fetchHelpCenter, searchQuery } = get();
    if (currentPage > 1) {
      await fetchHelpCenter(currentPage - 1, searchQuery);
    }
  },
}));

