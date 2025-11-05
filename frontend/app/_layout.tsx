import "@/global.css";
import { NAV_THEME } from "@/lib/theme";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { Stack, router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Toaster } from "sonner-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/auth/authStore";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    "FingerPaint-Regular": require("@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf"),
    "FingerPaint": require("@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        if (!fontsLoaded) return;

        const token = await AsyncStorage.getItem("token");
        const userString = await AsyncStorage.getItem("user");

        if (token && userString) {
          setToken(token);
          setUser(JSON.parse(userString));
          router.replace("/(tabs)/home");
        }
      } catch (e) {
        console.log("Error restoring session", e);
      } finally {
        setAppReady(true);
        SplashScreen.hideAsync();
      }
    }

    prepareApp();
  }, [fontsLoaded]);

  if (!appReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <PortalHost />
      <Toaster position="top-center" />
    </GestureHandlerRootView>
  );
}
