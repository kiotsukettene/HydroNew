import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";


const storage = {
  setItem: async (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  getItem: async (key: string) => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    } else {
      await AsyncStorage.removeItem(key);
    }
  },
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  fieldErrors: {},
  message: null,
  needsVerification: false,

  register: async (data) => {
    set({ loading: true, error: null, fieldErrors: {} });

    try {
      const response = await axiosInstance.post("/register", data);

      set({
        loading: false,
        user: response.data.user,
        token: response.data.token,
        needsVerification: response.data.needs_verification ?? false,
      });

      await storage.setItem("token", response.data.token);
      console.log("Registration successful:", response.data.message);
    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors });
    }
  },


  login: async (email, password) => {
    set({ loading: true, error: null, fieldErrors: {} });

    try {
      const response = await axiosInstance.post("/login", { email, password });

      set({
        loading: false,
        user: response.data.user || null,
        token: response.data.token || null,
        needsVerification: response.data.needs_verification ?? false,
      });

      await storage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors });
    }
  },

  verifyOtp: async (otp: string) => {
    set({ loading: true, error: null, fieldErrors: {} });

    try {
      let token = get().token;
      if (!token) token = await storage.getItem("token");
      if (!token) throw new Error("No verification token found");

      const response = await axiosInstance.post(
        "/verify-otp",
        { otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      set({
        loading: false,
        token: response.data.token,
        needsVerification: false,
        error: null,
      });

      await storage.setItem("token", response.data.token);
      return response.data;
    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors });
    }
  },


  resendOtp: async () => {
    set({ loading: true, error: null, fieldErrors: {} });

    try {
      const token = get().token || (await storage.getItem("token"));
      if (!token) throw new Error("No verification token found");

      const response = await axiosInstance.post(
        "/resend-otp",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("OTP resent:", response.data);
      set({
        loading: false,
        message: response.data.message,
      });
    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors });
    }
  },

  logout: async () => {
    await storage.removeItem("token");
    set({
      user: null,
      token: null,
      error: null,
      message: null,
      fieldErrors: {},
      needsVerification: false,
    });
  },
}));
