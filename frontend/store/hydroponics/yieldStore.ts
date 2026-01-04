import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import { useHydroponicSetupStore } from "./hydroponicSetupStore";

export const useYieldStore = create<YieldStore>((set) => ({
  loading: false,
  error: null,
  yieldData: null,
  yieldSaved: false,

  storeYield: async (setupId: number, payload: YieldPayload) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/hydroponic-yields/${setupId}/store`,
        payload
      );
      
      set({
        yieldData: response.data.data.yield,
        yieldSaved: true,
        loading: false,
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
      throw err;
    }
  },

  markAsHarvested: async (setupId: number) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post(
        `/hydroponic-setups/${setupId}/mark-harvested`
      );
      
      // Clear the hydroponic setups cache after marking as harvested
      useHydroponicSetupStore.getState().clearCache();
      
      set({ loading: false });
      return response.data;
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
      throw err;
    }
  },

  resetYieldState: () =>
    set({
      yieldData: null,
      yieldSaved: false,
      error: null,
      loading: false,
    }),

  resetError: () => set({ error: null }),
}));

