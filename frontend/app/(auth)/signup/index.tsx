import { View } from "react-native";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Link, useRouter } from "expo-router";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter()

  const handleSignUp = () => {
    console.log("Signing up with:", email, password);
    router.push('/(auth)/first-time/welcome-first-time')
  };

  return (
    <View className="flex-1 bg-green-50 px-6 justify-center">
      {/* Title */}
      <Text className="text-3xl font-bold text-primary text-center mb-6">
        Create an Account
      </Text>

      {/* Email Field */}
      <Input
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        className="mb-4"
      />

      {/* Password Field */}
      <Input
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="mb-6"
      />

      {/* Sign Up Button */}
      <Button
        onPress={handleSignUp}
      >
        <Text> Sign Up</Text>
      </Button>

      <Link href="/login" asChild>
        <Text className="text-center text-sm text-muted-foreground">
          Already have an account? <Text className="text-primary">Login</Text>
        </Text>
      </Link>
    </View>
  );
}
