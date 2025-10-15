import { create } from "zustand";

import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  logoutUser,
} from "@/api/controllers/authController";

type AuthState = {
  user: any | null;
  token: string | null;
  needsVerification: boolean;
  loading: boolean;
  error: string | null;

  register: (data: RegisterData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  logout: () => Promise<void>;
};

type RegisterData = {
  fullname: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  needsVerification: false,
  loading: false,
  error: null,

  // register user
  register: async (data) => {
    try {
      set({ loading: true, error: null });

      // Split fullname into first and last name
      const parts = data.fullname.trim().split(" ");
      const last_name = parts.pop() || "";
      const first_name = parts.join(" ") || "";

      const registerData = {
        first_name,
        last_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      };

      const response = await registerUser(registerData);

      set({
        user: response.user,
        needsVerification: true,
        token: response.token,
        loading: false,
      });

      localStorage.setItem("token", response.token);
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Registration failed",
      });
    }
  },

  // login user
  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const response = await loginUser(email, password);
      set({
        user: response.user || null,
        token: response.token,
        needsVerification: false,
        loading: false,
      });
      localStorage.setItem("token", response.token);
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || "Login failed",
      });
    }
  },

  //verify otp
  verifyOtp: async (otp) => {
    try {
      set({ loading: true, error: null });
      const res = await verifyOtp(otp);
      set({
        token: res.token,
        needsVerification: false,
        loading: false,
      });
      localStorage.setItem("token", res.token);
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Verification failed",
        loading: false,
      });
    }
  },

  // resend otp
  resendOtp: async () => {
    try {
      set({ loading: true, error: null });
      await resendOtp();
      set({ loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || "Failed to resend OTP",
        loading: false,
      });
    }
  },

  // logout user
  logout: async () => {
    try {
      await logoutUser();
    } catch {

    } finally {
      set({ user: null, token: null });
      localStorage.removeItem("token");
    }
  },
}));
