import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth/authStore";
import { initializeEcho } from "@/lib/echo";

export default function AuthLayout() {
  const {token, hydrated} = useAuthStore();

  if (!hydrated) return null;

  if (token) {
    return <Redirect href="/(tabs)/home" />;
  };

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="login/index" />
      <Stack.Screen name="signup/index" />
      <Stack.Screen name="first-time" />
      <Stack.Screen name="forgot-password/index" />
    </Stack>
  );
}