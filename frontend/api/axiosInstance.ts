import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"]; 
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = String(error.response?.data?.message || "").toLowerCase();

    if (status === 401 || message.includes("unauthenticated")) {
      (error as any).__authRedirect = true; // Mark so callers can skip logging
      const { router } = await import("expo-router");
      const { useAuthStore } = await import("@/store/auth/authStore");
      await useAuthStore.getState().logout({ skipApiCall: true });
      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
