interface ResetPasswordStore {
  loading: boolean;
  error: string | null;
  message: string | null;
  email: string | null;
  resetToken: string | null;
  setEmail: (email: string | null) => void;
  resetPassword: (email: string) => Promise<void>;
  verifyResetCode: (email: string, otp: string) => Promise<void>;
  resetPasswordWithToken: (
    email: string,
    newPassword: string,
    resetToken: string,
    confirm_password?: string
  ) => Promise<void>;
}