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
import { getMQTTClient } from "@/service/mqtt.client";

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { setToken, setUser, setHydrated, hydrated } = useAuthStore();


  const user = useAuthStore(state => state.user);
  const needsVerification = useAuthStore(state => state.needsVerification);

  // Setup Echo globally - will only initialize when user is authenticated AND verified
  // Don't setup Echo if user needs email verification
  useEchoSetup(needsVerification ? undefined : user?.id);

  const [fontsLoaded] = useFonts({
    "FingerPaint-Regular": require("@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf"),
    "FingerPaint": require("@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf"),
  });

  useEffect(() => {
    async function bootstrap() {
      if (!fontsLoaded) return;

      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
        // Don't initialize Echo here - let useEchoSetup handle it after verification check
      } catch (e) {
        console.log("Auth bootstrap failed:", e);
      } finally {
        setHydrated(true);
        SplashScreen.hideAsync();
      }
    }

    bootstrap();
  }, [fontsLoaded]);

  useEffect(() => {
    getMQTTClient();
  }, []);

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