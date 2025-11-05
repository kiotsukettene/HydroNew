import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { TipsResponse } from "@/types/tips_suggestion";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    try {
      const cachedData = await AsyncStorage.getItem("tips_cache");
      if (cachedData) {
        console.log("CACHE: Found data in storage."); 
        const parsed = JSON.parse(cachedData);
        const lastFetched = new Date(parsed.timestamp);
        const now = new Date();
        const hoursPassed = (now.getTime() - lastFetched.getTime()) / 36e5;
        
        console.log(`CACHE: ${hoursPassed.toFixed(2)} hours have passed.`);

        if (hoursPassed < 24 && parsed.data) {
          console.log("CACHE: Using cached data. NO API call.");
          set({ data: parsed.data, loading: false });
          return;
        } else {
          console.log("CACHE: Cache is stale. Fetching new data."); 
        }
      } else {
        console.log("CACHE: No cache found. Fetching new data."); 
      }


      set({ loading: true, error: null });

      const res = await axiosInstance.get("/tips-suggestion");

      set({ data:res.data, loading: false });
      await AsyncStorage.setItem(
        "tips_cache",
        JSON.stringify({
          data:res.data,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (error: any) {
      console.log("Tips fetch error:", error.response?.data || error.message);
      set({
        error: error.response?.data?.message || "Failed to fetch tips.",
        loading: false,
      });
    }
  },
}));
