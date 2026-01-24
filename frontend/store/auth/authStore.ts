import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAccountStore } from "../account/accountStore";
import { Platform } from "react-native";
import { disconnectEcho } from "@/lib/echo";
import { useNotificationStore } from "../notification/notificationStore";
import { firebase } from "@react-native-firebase/auth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

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
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  hydrated: false,
  setHydrated: (value) => set({ hydrated: value }),

  resetErrors: () =>
    set({
      fieldErrors: {},
      error: null,
  }),

  register: async (data) => {
    set({ loading: true, error: null, fieldErrors: {} });

    try {
      const response = await axiosInstance.post("/register", data);
      
      // Parse response if it's a string
      let responseData = response.data;
      if (typeof responseData === 'string') {
        console.log('⚠️ Response is a string, extracting JSON...');
        try {
          // Extract JSON from string (backend may have debug output before JSON)
          const jsonMatch = responseData.match(/\{.*\}/s);
          if (jsonMatch) {
            responseData = JSON.parse(jsonMatch[0]);
            console.log('✅ JSON extracted and parsed successfully');
          } else {
            throw new Error('No JSON found in response');
          }
        } catch (parseError) {
          console.error('❌ JSON parse error:', parseError);
          console.error('Raw response:', responseData);
          throw parseError;
        }
      }
      
      console.log('🔍 Register API response:', responseData);
      console.log('🔍 needs_verification value:', responseData.needs_verification);
      console.log('🔍 Setting needsVerification to:', responseData.needs_verification ?? false);

      const needsVerif = responseData.needs_verification ?? false;
      
      set({
        loading: false,
        user: responseData.user,
        token: responseData.token,
        needsVerification: needsVerif,
      });
      
      console.log('✅ State updated, needsVerification is now:', needsVerif);
      
      // Verify the state was actually set
      const currentState = get();
      console.log('🔍 Current needsVerification from store:', currentState.needsVerification);

      await storage.setItem("token", responseData.token);

    } catch (err: any) {
      console.error('❌ Register error:', err);
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
    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem("user");
    }

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

signInWithGoogle: async (firebaseIdToken, first_name, last_name) => {
    set({ loading: true, error: null});
    try {
      const response = await axiosInstance.post("/google-login", {token: firebaseIdToken, first_name, last_name });
      const { token, user, needs_verification } = response.data;

      await storage.setItem("token", token);
      await storage.setItem("user", JSON.stringify(user));

      set({
        loading: false,
        user: user || null,
        token,
        needsVerification: needs_verification ?? false,
      });
      await useAccountStore.getState().fetchAccount();
      console.log("Google sign-in successful:", user);
      return response.data;

    } catch (err: any) {
      const {message} = handleAxiosError(err);
      set({ loading: false, error: message });
      console.log("Google sign-in error:", message);
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
  const user = get().user;

  // Stop listening safely
  if (user?.id) {
    useNotificationStore.getState().stopListening(user.id);
  }

  // Disconnect echo safely
  disconnectEcho();

  // Clear storage
  await storage.removeItem("token");
  await GoogleSignin.signOut();

  // Reset auth state
  set({
    user: null,
    token: null,
    error: null,
    message: null,
    fieldErrors: {},
    needsVerification: false,
  });

  // Reset notification store
  useNotificationStore.setState({
    notifications: [],
    unreadCount: 0,
    error: null,
    loading: false,
    isListening: false,
  });
},

}));