import { create } from "zustand";
import axios from "axios";
import { DeviceStore } from "@/types/device"; 
import { handleAxiosError } from "@/api/handleAxiosError";
import axiosInstance from "@/api/axiosInstance";

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  loading: false,
  error: null,

getPairingToken: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.post("/devices/pairing-token");
    console.log("Pairing token response:", response.data);
    return response.data.pairing_token;
  } catch (error: any) {
    const { message } = handleAxiosError(error);
    set({ error: message });
    console.error("Failed to get pairing token:", message, error.response?.data);
  } finally {
    set({ loading: false });
  }
}
  ,

// store/device/deviceStore.ts
connectDeviceToWifi: async (ssid: string, password?: string) => {
  set({ loading: true, error: null });

  try {
    const pairingToken = await get().getPairingToken();
    if (!pairingToken) throw new Error("No pairing token");

    const IOT_ENDPOINT = "http://10.42.0.1:5000/provision";

    const response = await axios.post(IOT_ENDPOINT, {
      ssid,
      password,
      pairing_token: pairingToken,
    }, { timeout: 10000 });

    // Here we expect the Pi to pass the backend-confirmed device info
    if (response.data.status === "ok") {
      return response.data.device; // <-- return the actual device info
    } else {
      throw new Error(response.data.message || "Provisioning failed");
    }

  } catch (error: any) {
    set({ error: error.message });
    console.error("Connection failed:", error.message);
  } finally {
    set({ loading: false });
  }
}

}));
