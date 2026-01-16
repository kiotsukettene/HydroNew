import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeEcho } from "@/lib/echo";
import NetInfo, { NetInfoState} from "@react-native-community/netinfo";
import { useNetworkStore } from "@/store/network/networkStore";
import { NetworkAlert } from "@/components/ui/network-alert";


import { useAuthStore } from "@/store/auth/authStore";
import { getMQTTClient } from "@/service/mqtt-client";
export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export { ErrorBoundary } from "expo-router";

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
   // Get authenticated user
  const user = useAuthStore(state => state.user);
  const token = useAuthStore(state => state.token);

  // Setup Echo globally - will only initialize when user is authenticated
  useEchoSetup(user?.id);


  const [fontsLoaded] = useFonts({
    'FingerPaint-Regular': require('@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf'),
    'FingerPaint': require('@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf'),
    
  });

  useEffect(() => {
    async function bootstrap() {
      if (!fontsLoaded) return;

      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("user");

        if (storedToken) setToken(storedToken);
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) initializeEcho(storedToken);
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