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
  filters: [], // ✅ Add filters to state
  searchQuery: "", // ✅ Track search term

  // Fetch help center data (supports pagination + search)
  fetchHelpCenter: async (page = 1, search = "") => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get(
        `/help-center?page=${page}${search ? `&search=${search}` : ""}`
      );

      const data = response.data.data;

      set({
        items: data.data,
        currentPage: data.current_page,
        lastPage: data.last_page,
        filters: response.data.filters || [],
        searchQuery: search,
        loading: false,
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

  // Dedicated search function
  searchHelpCenter: async (search: string) => {
    await get().fetchHelpCenter(1, search); // Always start at page 1 when searching
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
