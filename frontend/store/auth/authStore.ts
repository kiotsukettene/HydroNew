import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAccountStore } from "../account/accountStore";
import { Platform } from "react-native";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/src/firebase";

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
      await storage.setItem("token", response.data.token);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
      set({
        loading: false,
        user: response.data.user || null,
        token: response.data.token || null,
        needsVerification: response.data.needs_verification ?? false,
      });

      await useAccountStore.getState().fetchAccount();

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

  loginWithGoogle: async () => {
  set({ loading: true, error: null, fieldErrors: {} });

  try {
    // Step 1: Google Sign-In via Firebase Web SDK
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Step 2: Get Firebase ID token
    const firebaseToken = await user.getIdToken();

    // Step 3: Send token to your Laravel backend
    const response = await axiosInstance.post("/google-login", {
      token: firebaseToken,
    });

    // Step 4: Save Laravel-issued token
    const backendToken = response.data.access_token;
    await storage.setItem("token", backendToken);

    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${backendToken}`;

    set({
      loading: false,
      user: response.data.user || null,
      token: backendToken,
      error: null,
      fieldErrors: {},
      needsVerification: false,
    });

    // Optionally fetch account info if you have that function
    await useAccountStore.getState().fetchAccount();

    return response.data;
  } catch (err: any) {
    const { message, fieldErrors } = handleAxiosError(err);
    set({ loading: false, error: message, fieldErrors });
    return null;
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
