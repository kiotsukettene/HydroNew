import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { TipsResponse } from "@/types/tips_suggestion";

interface TipState {
  data: TipsResponse | null;
  loading: boolean;
  error: string | null;
  fetchTips: (params: { userId: string | number; deviceId: number; systemType: string }) => Promise<void>;
}

export const useTipStore = create<TipState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchTips: async ({ userId, deviceId, systemType }) => {
    try {
      const currentState = useTipStore.getState();
      if (currentState.loading) {
        console.log("Already loading, skipping duplicate request.");
        return;
      }

      set({ loading: true, error: null });

      const res = await axiosInstance.post("/tips/rag-insights", {
        device_id: deviceId,
        system_type: systemType
      });

      // Extract insights from the response
      const insightsData = res.data.insights || res.data;

      set({ data: insightsData, loading: false });
    } catch (error: any) {
      console.log("Tips fetch error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Failed to fetch tips.",
        loading: false,
      });
    }
  },
}));
