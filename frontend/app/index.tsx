import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Link, Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';
import { useAuthStore } from '@/store/auth/authStore';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

// const SCREEN_OPTIONS = {
//   light: {
//     title: 'React Native Reusables',
//     headerTransparent: true,
//     headerShadowVisible: true,
//     headerStyle: { backgroundColor: THEME.light.background },
//   },
//   dark: {
//     title: 'React Native Reusables',
//     headerTransparent: true,
//     headerShadowVisible: true,
//     headerStyle: { backgroundColor: THEME.dark.background },
//   },
// };

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();
  const token = useAuthStore(state => state.token);
  const user = useAuthStore(state => state.user);
  const needsVerification = useAuthStore(state => state.needsVerification);
  const hydrated = useAuthStore(state => state.hydrated);

  // Wait for hydration to complete before redirecting
  if (!hydrated) {
    return null;
  }

  const isLoggedIn = token && user && !needsVerification;

  if (token && needsVerification) {
    return <Redirect href="/signup/email-verification" />;
  }

  return isLoggedIn ? (
    <>
      {/* <Stack.Screen options={SCREEN_OPTIONS[colorScheme ?? 'light']} /> */}
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Redirect href="/(tabs)/home" />
      </View>
    </>
  ) : (
    <Redirect href="/welcome" />
  );
}