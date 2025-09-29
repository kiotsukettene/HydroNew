import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function AuthIndex() {
  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white">
      <Text className="text-xl font-semibold">Auth</Text>
      <Link href="/auth/login" className="text-blue-600">Go to Login</Link>
      <Link href="/auth/signup" className="text-blue-600">Go to Signup</Link>
    </View>
  );
}


