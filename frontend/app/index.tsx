import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { THEME } from '@/lib/theme';
import { Link, Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';

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
  const isLoggedIn = false; // Replace with real auth check

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