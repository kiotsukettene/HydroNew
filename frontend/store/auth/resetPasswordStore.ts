import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';

export const useResetPasswordStore = create<ResetPasswordStore>((set) => ({
  loading: false,
  error: null,
  message: null,
  email: null,
  resetToken: null,
  resetTimer: 0,
  setEmail: (email) => set({ email }),

  resetPassword: async (email) => {
    set({ loading: true, error: null, message: null });
    try {
      await axiosInstance.post('/forgot-password', { email });
      set({ message: 'Password reset code sent successfully.', email, loading: false });

    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
        set({ error: message, loading: false });
        throw error;
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
        loading: false,
      });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      set({ error: message, loading: false });
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
      set({ message: 'Password reset successfully.', email: null, resetToken: null, loading: false });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      set({ error: message, loading: false });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  resendResetCode: async (email) => {
    set({ loading: false, error: null, message: null });
    try {
      await axiosInstance.post('/resend-reset-code', { email });
      set({ message: 'Reset code resent successfully.' });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ?? error?.message ?? String(error);
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },


}));
