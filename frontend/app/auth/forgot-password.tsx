import { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleSendOTP() {
    if (!email.trim()) {
      Toast.show({ type: "error", text1: "Please enter your email" });
      return;
    }
    Toast.show({ type: "success", text1: "OTP sent to your email" });
    router.push("/auth/check-email");
  }

  return (
    <View className="flex-1 bg-[#F3F3F3] items-center justify-center px-6">
      <View className="bg-white rounded-3xl w-full p-6 relative">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center absolute top-4 left-4">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View className="items-center mt-8">
          <Text className="text-2xl font-extrabold text-[#1D7A52] mb-2">Forgot password</Text>
          <Text className="text-center text-[#6B7280] mb-6">Please enter your email and we'll send you a verification code.</Text>

          <View className="w-full mb-6">
            <Text className="text-[#374151] text-sm mb-2">Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@gmail.com"
              keyboardType="email-address"
              autoCapitalize="none"
              className="w-full border border-[#D1D5DB] rounded-xl px-4 py-3 bg-white"
            />
          </View>

          <TouchableOpacity onPress={handleSendOTP} className="bg-[#1D7A52] rounded-xl py-4 items-center w-full mb-4">
            <Text className="text-white font-semibold">Send OTP</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="border border-[#1D7A52] rounded-xl py-4 items-center w-full flex-row justify-center">
            <Ionicons name="chevron-back" size={16} color="#1D7A52" />
            <Text className="text-[#1D7A52] font-semibold ml-2">Back to Login</Text>
          </TouchableOpacity>
        </View>

        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 left-0 w-16 h-16" resizeMode="contain" />
        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 right-0 w-16 h-16" resizeMode="contain" />
      </View>
    </View>
  );
}
