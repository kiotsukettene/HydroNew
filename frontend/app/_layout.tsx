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

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    'FingerPaint-Regular': require('@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf'),
    'FingerPaint': require('@/assets/fonts/Finger_Paint/FingerPaint-Regular.ttf'),
    'Poppins-Regular': require('@/assets/fonts/Poppins/Poppins-Regular.ttf'),
    'Poppins-Medium': require('@/assets/fonts/Poppins/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('@/assets/fonts/Poppins/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('@/assets/fonts/Poppins/Poppins-Bold.ttf'),
    'Poppins-Light': require('@/assets/fonts/Poppins/Poppins-Light.ttf'),
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
    <ThemeProvider value={NAV_THEME['light']}> 
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
       {/* 👇 The Stack Navigator for all auth screens */}
      <Stack
        screenOptions={{
          headerShown: false, // hide headers for welcome/signup
        }}
      >
        {/* The router will automatically find the screens in /app folder */}
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
