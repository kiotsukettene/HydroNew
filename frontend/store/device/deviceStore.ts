import {create} from "zustand";
import axios from "axios";
import { DeviceStore } from "@/types/device"; 
import { handleAxiosError } from "@/api/handleAxiosError";

export const useDeviceStore = create<DeviceStore>((set) => ({
  devices: [],
  loading: false,
  error: null,

  connectDevicetoWifi: async (ssid: string, password?: string) => {
    set({ loading: true, error: null });

    try {

      const IOT_ENDPOINT = "http://10.42.0.1:5000/provision";

      const response = await axios.post(IOT_ENDPOINT, {
        ssid,
        password,
      }, {
        timeout: 8000
      });

      set({ loading: false });
      return response.data;
    } catch (error:any) {
      const { message } = handleAxiosError(error);
      console.error("Connection failed:", message);
      set({ error: message });
    }
  }
}));
