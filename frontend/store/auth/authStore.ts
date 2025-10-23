import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: false,
  error: null,
  fieldErrors: {},
  message: null,
  needsVerification: false,

  // register
  register: async (data) => {
    set({ loading: true, error: null, fieldErrors: {} });
    try {
      const response = await axiosInstance.post("/register", {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });

      set({
        loading: false,
        user: response.data.user,
        token: response.data.token,
        needsVerification: response.data.needs_verification ?? false,
      });

      console.log(response.data.message);
    } catch (err: any) {
    const { message, fieldErrors } = handleAxiosError(err);
    set({ loading: false, error: message, fieldErrors: { ...fieldErrors } });
  }
  },

  // login
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
      return response.data;
    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors: { ...fieldErrors } });
    }
  },

  // verify OTP
  verifyOtp: async (otp: string) => {
    set({ loading: true, error: null, fieldErrors: {} });
    try {
      const token = get().token; 
      if (!token) throw new Error("No verification token found");

      const response = await axiosInstance.post(
        "/verify-otp",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      set({
        loading: false,
        token: response.data.token, 
        needsVerification: false,
        error: null,
      });
      return response.data;
    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors: { ...fieldErrors } });
    }
  },

  resendOtp: async () => {
    set({loading: true, error: null, fieldErrors: {}});
    try {
      const token = get().token;
      if (!token) throw new Error("No verification token found");
      const response = await axiosInstance.post("/resend-otp", {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }); 
      console.log("Response:", response.data);
      set({ 
        loading: false,
        error: null,
        message: response.data.message
      });

    } catch (err: any) {
      const { message, fieldErrors } = handleAxiosError(err);
      set({ loading: false, error: message, fieldErrors });
    }

  },

  //logout
  logout: async () => {
    set({ user: null, token: null, error: null, needsVerification: false });
  },
}));
