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


export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded] = useFonts({
    'FingerPaint-Regular': require('@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf'),
    'FingerPaint': require('@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf'),
    
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack
          screenOptions={{
            headerShown: false,
        }}
        >
        </Stack> 
        <PortalHost />
      <Toaster position="top-center" />
    </GestureHandlerRootView>
  );
}