import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { TipsResponse, BackendTipsResponse } from "@/types/tips_suggestion";

interface TipState {
  data: TipsResponse | null;
  loading: boolean;
  error: string | null;
  cached: boolean;
  cachedAt: string | null;
  expiresAt: string | null;
  fetchTips: (params: { userId: string | number; deviceId: number; systemType: string }) => Promise<void>;
}

export const useTipStore = create<TipState>((set) => ({
  data: null,
  loading: false,
  error: null,
  cached: false,
  cachedAt: null,
  expiresAt: null,

  fetchTips: async ({ userId, deviceId, systemType }) => {
    try {
      const currentState = useTipStore.getState();
      if (currentState.loading) {
        console.log("Already loading, skipping duplicate request.");
        return;
      }

      set({ loading: true, error: null });

      const res = await axiosInstance.post<BackendTipsResponse>("/tips/rag-insights", {
        device_id: deviceId,
        system_type: systemType
      });

      // Extract insights and caching info from the backend response
      const { insights, cached, cached_at, expires_at } = res.data;

      console.log(`Tips ${cached ? 'loaded from cache' : 'generated fresh'}`, {
        cached,
        cached_at,
        expires_at
      });

      set({ 
        data: insights, 
        loading: false,
        cached: cached || false,
        cachedAt: cached_at || null,
        expiresAt: expires_at || null
      });
    } catch (error: any) {
      console.log("Tips fetch error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Failed to fetch tips.",
        loading: false,
        cached: false,
        cachedAt: null,
        expiresAt: null
      });
    }
  },
}));
