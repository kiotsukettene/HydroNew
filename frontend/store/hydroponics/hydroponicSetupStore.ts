import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";


export interface HydroponicSetupPayload {
  crop_name: string;
  number_of_crops: number;
  bed_size: "small" | "medium" | "large";
  nutrient_solution: string;
  target_ph_min: number;
  target_ph_max: number;
  target_tds_min: number;
  target_tds_max: number;
  water_amount: string;
  pump_config?: PumpConfig | null;
}


export const useHydroponicSetupStore = create<HydroponicSetupStore>((set) => ({
  loading: false,
  error: null,
  hydroponicSetups: [], 

  createHydroponicSetup: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.post("/hydroponic-setups", data);
      set((state) => ({
        hydroponicSetups: [...state.hydroponicSetups, response.data.data],
      }));
      console.log("Hydroponic setup created:", response.data);
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      console.error("Hydroponic setup creation failed:", message);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  fetchHydroponicSetups: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/hydroponic-setups?page=${page}`);
      set({ hydroponicSetups: response.data.data.data });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  resetError: () => set({ error: null }),
}));

