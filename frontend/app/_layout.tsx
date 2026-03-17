import "@/global.css";
import { PortalHost } from "@rn-primitives/portal";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeEcho } from "@/lib/echo";
import NetInfo, { NetInfoState} from "@react-native-community/netinfo";
import { useNetworkStore } from "@/store/network/networkStore";
import { NetworkAlert } from "@/components/ui/network-alert";
import { useEchoSetup } from "@/app/hooks/useEchoSetup";

import { useAuthStore } from "@/store/auth/authStore";
import { connectWithClientId, subscribeMessage } from "@/service/mqtt.client";
import { usePumpStore } from "@/store/hydroponics/pumpStore";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { setToken, setUser, setHydrated, hydrated } = useAuthStore();


  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);
  const needsVerification = useAuthStore(state => state.needsVerification);

  // Compute userId for Echo setup
  // Only provide userId when:
  // 1. Hydration is complete (token/user loaded from storage)
  // 2. User doesn't need verification
  // 3. Token exists
  // 4. User exists with an ID
  const echoUserId = hydrated && !needsVerification && token && user?.id ? user.id : undefined;

  // Setup Echo globally - will only initialize when user is authenticated AND verified
  useEchoSetup(echoUserId);

  const [fontsLoaded] = useFonts({
    "FingerPaint-Regular": require("@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf"),
    "FingerPaint": require("@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf"),
  });

  // Debug logging for persistent auth
  useEffect(() => {
    console.log('🔍 [RootLayout] Auth state:', {
      hydrated,
      hasToken: !!token,
      hasUser: !!user,
      userId: user?.id,
      needsVerification,
      echoUserId,
    });
  }, [hydrated, token, user, needsVerification, echoUserId]);

  useEffect(() => {
    async function bootstrap() {
      if (!fontsLoaded) return;

      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        console.log('🔍 [Bootstrap] Loading from AsyncStorage:', {
          hasToken: !!storedToken,
          hasUser: !!storedUser,
          userRaw: storedUser?.substring(0, 100), // First 100 chars
        });

        if (storedToken) {
          console.log('✅ [Bootstrap] Setting token');
          setToken(storedToken);
        }
        
        if (storedUser) {
          console.log('✅ [Bootstrap] Parsing and setting user');
          const parsedUser = JSON.parse(storedUser);
          console.log('✅ [Bootstrap] Parsed user:', parsedUser);
          setUser(parsedUser);
        } else {
          console.log('⚠️ [Bootstrap] No user found in AsyncStorage');
        }
        // Don't initialize Echo here - let useEchoSetup handle it after verification check
      } catch (e) {
        console.error("❌ [Bootstrap] Auth bootstrap failed:", e);
      } finally {
        console.log('✅ [Bootstrap] Setting hydrated to true');
        setHydrated(true);
        SplashScreen.hideAsync();
      }
    }

    bootstrap();
  }, [fontsLoaded]);

  useEffect(() => {
    const userId = user?.id;
    if (userId) {
      connectWithClientId(String(userId));
    }
  }, [user?.id]);

  // Global MQTT subscription for pump 2 state - persists across all screens
  useEffect(() => {
    const getDeviceSerial = async () => {
      if (!user?.id) return null;
      
      try {
        const storageKey = `paired_device:${user.id}`;
        const deviceData = await AsyncStorage.getItem(storageKey);
        if (deviceData) {
          const device = JSON.parse(deviceData);
          return device.serial_number;
        }
      } catch (error) {
        console.error("[RootLayout] Failed to retrieve device serial:", error);
      }
      return null;
    };

    let unsubscribe: (() => void) | null = null;

    getDeviceSerial().then((serial) => {
      if (!serial) return;

      const stateTopic = `hydroponics/${serial}/pump/2/state`;
      console.log(`[RootLayout] Global pump 2 subscription to: ${stateTopic}`);
      
      unsubscribe = subscribeMessage(stateTopic, (_topic, payload) => {
        const value = payload.toString().trim();
        const isRunning = value === '1';
        console.log(`[RootLayout] Global pump 2 state: ${isRunning ? 'ON' : 'OFF'}`);
        usePumpStore.getState().setPump2Running(isRunning);
      }, 1);
    });

    return () => {
      if (unsubscribe) {
        console.log('[RootLayout] Cleaning up global pump 2 subscription');
        unsubscribe();
      }
    };
  }, [user?.id]);

useEffect(() => {
  console.log("Initializing NetInfo listener");

  const setState = (state: NetInfoState) => {
    console.log("NetInfo event:", state.type, state.isConnected);

    useNetworkStore.getState().setNetworkState({
      isConnected: state.isConnected ?? false,
      isInternetReachable: state.isInternetReachable ?? null,
      type: state.type,
      details: state.details,
    });
  };

  NetInfo.fetch().then(setState);
  const unsubscribe = NetInfo.addEventListener(setState);

  return unsubscribe;
}, []);


  if (!hydrated) return null;

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}/>
        <NetworkAlert />
        <PortalHost />
        <Toaster position="top-center" />
      </GestureHandlerRootView>
  );
}