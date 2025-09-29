import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function onSubmit() {
    router.replace("/(tabs)");
  }

  return (
    <View className="flex-1 items-center justify-center gap-4 bg-white px-6">
      <Text className="text-2xl font-bold">Login</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        className="w-full border rounded px-3 py-2"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        className="w-full border rounded px-3 py-2"
        secureTextEntry
      />
      <TouchableOpacity onPress={onSubmit} className="bg-blue-600 px-4 py-2 rounded">
        <Text className="text-white font-semibold">Sign in</Text>
      </TouchableOpacity>
      <Link href="/auth/signup" className="text-blue-600">Create account</Link>
    </View>
  );
}


