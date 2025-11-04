import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { TipsResponse } from "@/types/tips_suggestion";

interface TipState {
  data: TipsResponse | null;
  loading: boolean;
  error: string | null;
  fetchTips: () => Promise<void>;
}

export const useTipStore = create<TipState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchTips: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axiosInstance.get("/tips-suggestion");
      set({ data: res.data, loading: false });
    } catch (error: any) {
      console.log("Tips fetch error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Failed to fetch tips.",
        loading: false,
      });
    }
  },
}));
