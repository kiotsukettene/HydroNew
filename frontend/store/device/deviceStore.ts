import { create } from "zustand";
import axios from "axios";
import { DeviceStore } from "@/types/device"; 
import { handleAxiosError } from "@/api/handleAxiosError";
import axiosInstance from "@/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
},

fetchDevice: async (userId: number) => {
  set({ loading: true, error: null });
  
  try {
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