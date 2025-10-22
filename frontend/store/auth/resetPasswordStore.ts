import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';

export const useResetPasswordStore = create<ResetPasswordStore>((set) => ({
  loading: false,
  error: null,
  message: null,
  email: null,
  resetToken: null,

  setEmail: (email) => set({ email }),

  resetPassword: async (email) => {
    set({ loading: true, error: null, message: null });
    try {
      await axiosInstance.post('/forgot-password', { email });
      set({ message: 'Password reset code sent successfully.', email });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

  verifyResetCode: async (email, otp) => {
    set({ loading: true, error: null, message: null });
    try {
      const res = await axiosInstance.post('/verify-reset-code', {
        email,
        code: otp, 
      });

      const token = res.data?.reset_token;
      set({
        message: 'Code verified successfully.',
        resetToken: token,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resetPasswordWithToken: async (email, password, resetToken, confirm_password) => {
    set({ loading: true, error: null, message: null });
    try {
      await axiosInstance.post('/reset-password', {
        email,
        password,
        reset_token: resetToken,
        password_confirmation: confirm_password,
      });
      set({ message: 'Password reset successfully.', email: null, resetToken: null });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      set({ error: message });
    } finally {
      set({ loading: false });
    }
  },

}));
