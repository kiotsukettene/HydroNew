import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { ImageBackground, Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  function onSubmit() {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Please enter email and password." });
      return;
    }
    Toast.show({ type: "success", text1: "Welcome back!" });
    router.replace("/onboarding/greet");
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={require("../../assets/images/bg-2.png")}
        className="flex-1"
        resizeMode="cover"
      >
        {/* Back Button */}
        <Pressable 
          onPress={() => router.back()} 
          className="absolute top-12 left-6 z-10 w-10 h-10 rounded-full bg-white items-center justify-center shadow-lg"
        >
          <Ionicons name="chevron-back" size={20} color="#4C5D06" />
        </Pressable>

        {/* Login Card */}
        <View className="flex-1 justify-center px-6">
          <View className="bg-white rounded-3xl p-8 shadow-2xl">
            {/* Logo */}
            <View className="items-center mb-6">
              <Image 
                source={require("../../assets/images/Logo.png")} 
                className="w-8 h-8 mb-4" 
                resizeMode="contain"
              />
              <Text className="text-3xl font-bold text-[#4C5D06] mb-2">Login</Text>
              <Text className="text-sm text-[#9CA3AF] text-center">
                Welcome back! Let's get growing.
              </Text>
            </View>

            {/* Form Fields */}
            <View className="gap-4 mb-6">
              <View>
                <Text className="text-sm font-medium text-[#374151] mb-2">Email</Text>
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="example@gmail.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-4 bg-white text-base"
                />
              </View>
              
              <View>
                <Text className="text-sm font-medium text-[#374151] mb-2">Password</Text>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="password"
                  secureTextEntry
                  className="w-full border border-[#E5E7EB] rounded-xl px-4 py-4 bg-white text-base"
                />
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View className="flex-row items-center justify-between mb-6">
              <Pressable onPress={() => setRemember(!remember)} className="flex-row items-center gap-2">
                <View className={`w-5 h-5 rounded border-2 ${remember ? "bg-[#4C5D06] border-[#4C5D06]" : "border-[#9CA3AF]"}`}>
                  {remember && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <Text className="text-sm text-[#6B7280]">Remember me</Text>
              </Pressable>
              <Link href="/auth/forgot-password">
                <Text className="text-sm text-[#4C5D06] font-medium">Forgot password?</Text>
              </Link>
            </View>

            {/* Login Button */}
            <TouchableOpacity onPress={onSubmit} className="bg-[#4C5D06] rounded-xl py-4 items-center mb-6">
              <Text className="text-white font-semibold text-lg">Login</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-[#E5E7EB]" />
              <Text className="mx-4 text-sm text-[#9CA3AF]">Or Login With</Text>
              <View className="flex-1 h-px bg-[#E5E7EB]" />
            </View>

            {/* Google Login */}
            <TouchableOpacity className="border border-[#4285F4] rounded-xl py-4 items-center flex-row justify-center gap-3 mb-6">
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text className="font-medium text-[#4285F4] text-lg">Google</Text>
            </TouchableOpacity>

            {/* Signup Link */}
            <View className="items-center">
              <Text className="text-sm text-[#6B7280]">
                Don't have an account? <Link href="/auth/signup" className="text-[#4C5D06] font-semibold">Signup</Link>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}


