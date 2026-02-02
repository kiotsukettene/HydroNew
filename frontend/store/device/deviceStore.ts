import { create } from "zustand";
import axios from "axios";
import { DeviceStore } from "@/types/device"; 
import { handleAxiosError } from "@/api/handleAxiosError";
import axiosInstance from "@/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/auth/authStore";

export const useDeviceStore = create<DeviceStore>((set, get) => ({
  devices: [],
  loading: false,
  error: null,

generateQrPayload: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.post("/devices/generate-qr-payload");
    console.log("Generate QR payload response:", response.data);

    const payload = response?.data?.qr_payload;
    if (!payload) {
      throw new Error("Missing qr_payload in response");
    }

    return payload;
  } catch (error: any) {
    const { message } = handleAxiosError(error);
    set({ error: message });
    console.error("Failed to generate QR payload:", message, error?.response?.data);
    throw error;
  } finally {
    set({ loading: false });
  }
},

pairDeviceByQr: async (payload: { serial_number: string; device_name: string; model: string }) => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.post("/devices/pair-by-qr", payload);
    console.log("Pair device by QR response:", response.data);

    // If backend returns the paired device, you could optionally store it here.
    return response.data;
  } catch (error: any) {
    const { message } = handleAxiosError(error);
    set({ error: message });
    console.error("Failed to pair device via QR:", message, error?.response?.data);
    throw error;
  } finally {
    set({ loading: false });
  }
},

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
},

fetchDevice: async (userId: number) => {
  set({ loading: true, error: null });
  
  try {
    // Check if email is verified
    const { useAuthStore } = require("@/store/auth/authStore");
    const needsVerification = useAuthStore.getState().needsVerification;
    if (needsVerification) {
      console.log("Skipping device fetch: Email not verified");
      set({ loading: false });
      return;
    }

    // Check if device already exists in AsyncStorage
    const storageKey = `paired_device:${userId}`;
    const existingDevice = await AsyncStorage.getItem(storageKey);
    
    if (existingDevice) {
      console.log("Device already exists in AsyncStorage, skipping fetch");
      const device = JSON.parse(existingDevice);
      set({ devices: [device], loading: false });
      return;
    }

    // Fetch devices from API
    const response = await axiosInstance.get("/devices");
    console.log("Fetch devices response:", response.data);

    if (response.data?.status === "success" && response.data?.devices?.length > 0) {
      const devices = response.data.devices;
      
      // Get the first device (without pivot data)
      const device = {
        id: devices[0].id,
        device_name: devices[0].device_name,
        serial_number: devices[0].serial_number,
        model: devices[0].model,
        firmware_version: devices[0].firmware_version,
        status: devices[0].status,
      };

      // Save to AsyncStorage
      await AsyncStorage.setItem(storageKey, JSON.stringify(device));
      console.log("Device saved to AsyncStorage");

      set({ devices: [device] });
    } else {
      console.log("No devices returned from API");
      set({ devices: [] });
    }
  } catch (error: any) {
    const { message } = handleAxiosError(error);
    set({ error: message });
    console.error("Failed to fetch devices:", message, error.response?.data);
  } finally {
    set({ loading: false });
  }
},

setDevice: (device: any) => {
  console.log("Setting device in store:", device);
  set({ devices: [device] });
},

unpairDevice: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axiosInstance.post(`/devices/unpair`);
    console.log("Unpair device response:", response.data);

    if (response.status === 200) {
      const message = response.data?.message ?? "Device unpaired successfully.";
      const userId = useAuthStore.getState().user?.id;
      const storageKey = `paired_device:${userId}`;
      await AsyncStorage.removeItem(storageKey);
      set({ devices: [] });
      return { success: true, message };
    }

    const message = response.data?.message ?? "Failed to unpair device.";
    return { success: false, message };
  } catch (error: any) {
    const { message } = handleAxiosError(error);
    set({ error: message });
    console.error("Failed to unpair device:", message, error.response?.data);
    return { success: false, message };
  } finally {
    set({ loading: false });
  }
},

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

    //  AP shutdown breaks HTTP — this is SUCCESS
    return { status: "ok", ssid };

  } finally {
    set({ loading: false });
  }
}



}));