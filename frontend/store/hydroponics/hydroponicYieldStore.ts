import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { HydroponicYieldState, HydroponicYield } from "@/types/hydroponic-yield";

const getStoredToken = async (): Promise<string | null> => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  } else {
    return await AsyncStorage.getItem("token");
  }
};

export const useYieldStore = create<HydroponicYieldState>((set, get) => ({
  yields: [],
  loading: false,
  error: null,

  fetchYields: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get("/hydroponic-yields");
      set({ yields: response.data.data || [], loading: false });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  fetchYieldBySetup: async (setupId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/hydroponic-yields/${setupId}`);
      set({ yields: response.data.data || [], loading: false });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

//update yield
  updateActualYield: async (
    yieldId: number,
    payload: { actual_yield: number; notes?: string }
  ) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.put(`/hydroponic-yields/${yieldId}`, payload);

      const updatedYield: HydroponicYield = response.data.data;
      const updatedYields = get().yields.map((y) =>
        y.id === updatedYield.id ? updatedYield : y
      );

      set({ yields: updatedYields, loading: false });
      return response.data;
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  clearYields: () => set({ yields: [], error: null }),
}));
