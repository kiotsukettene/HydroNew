type User = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
};

type LoginResponse = {
  token: string;
  user: User | null;
  needs_verification: boolean;
  message?: string;
};

type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  message: string | null;
  needsVerification: boolean;
  register: (data: RegisterPayload) => Promise<void>;
  login: (email: string, password: string) => Promise<LoginResponse | null>;
  resetErrors: () => void;
  verifyOtp: (otp: string) => Promise<void>;
  resendOtp: () => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string;
  setUserEmail: (userEmail: string) => void;
  setNeedsVerification: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
};
