import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAccountStore } from "../account/accountStore";
import { Platform } from "react-native";

const isWeb = Platform.OS === "web";

const storage = {
  setItem: async (key: string, value: string) => {
    if (isWeb) {
      window.localStorage.setItem(key, value);
    } else {
      await AsyncStorage.setItem(key, value);
    }
  },
  getItem: async (key: string) => {
    if (isWeb) {
      return window.localStorage.getItem(key);
    } else {
      return await AsyncStorage.getItem(key);
    }
  },
  removeItem: async (key: string) => {
    if (isWeb) {
      window.localStorage.removeItem(key);
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
  userEmail: "",
  setNeedsVerification: (value: boolean) => set({ needsVerification: value }),
  setUserEmail: (email: string) => set({ userEmail: email }),

  resetErrors: () =>
    set({
      fieldErrors: {},
      error: null,
  }),

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

    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors });
    }
  },

login: async (email, password) => {
  set({ loading: true, error: null, fieldErrors: {} });

  try {
    const response = await axiosInstance.post("/login", { email, password });
    const { token, user, needs_verification, message } = response.data;

    if (!token) {
      set({ loading: false, error: message || "Invalid credentials" });
      return null;
    }

    await storage.setItem("token", token);

    set({
      loading: false,
      user: user || null,
      token,
      needsVerification: needs_verification ?? false,
    });
    await useAccountStore.getState().fetchAccount();

    return response.data;
  } catch (err: any) {
    const { message, fieldErrors } = handleAxiosError(err);
    set({ loading: false, error: message, fieldErrors });
    return null;
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
      const fullToken = response.data.token;
      await storage.setItem("token", fullToken);
      
      await useAccountStore.getState().fetchAccount();

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
      return null;
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
