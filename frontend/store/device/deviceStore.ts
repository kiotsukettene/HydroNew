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
connectDeviceToWifi: async (ssid: string, password?: string, pairing_token?: string) => {
  set({ loading: true, error: null });

  try {
    console.log(`Connecting to WiFi SSID: ${ssid}`);

    const IOT_ENDPOINT = "http://10.42.0.1:5000/provision";

    const response = await axios.post(
      IOT_ENDPOINT,
      { ssid, password, pairing_token },
      { timeout: 2000 }
    );

    console.log("Raw response from device:", response.data);

    if (response.data?.status === "error") {
      return { status: "error", message: response.data.message };
    }

    return { status: "ok", ssid };

  } catch (error: any) {
    console.warn(
      "Provisioning connection dropped (expected):",
      error?.message
    );

    // 🔥 AP shutdown breaks HTTP — this is SUCCESS
    return { status: "ok", ssid };

  } finally {
    set({ loading: false });
  }
}



}));
