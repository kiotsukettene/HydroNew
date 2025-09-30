import { useRef, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

export default function CheckEmail() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", ""]);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  function setDigitAt(index: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < 4) inputs[index + 1].current?.focus();
    if (!v && index > 0) inputs[index - 1].current?.focus();
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  }

  function verifyCode() {
    const code = digits.join("");
    if (code.length !== 5) {
      Toast.show({ type: "error", text1: "Please enter the complete code" });
      return;
    }
    if (code === "12345") {
      router.push("/auth/create-password");
    } else {
      Toast.show({ type: "error", text1: "Invalid code, Try again" });
    }
  }

  function resendCode() {
    Toast.show({ type: "success", text1: "Code resent to your email" });
  }

  return (
    <View className="flex-1 bg-[#F3F3F3] items-center justify-center px-6">
      <View className="bg-white rounded-3xl w-full p-6 relative">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center absolute top-4 left-4">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View className="items-center mt-8">
          <Text className="text-2xl font-extrabold text-[#1D7A52] mb-2">Check your email</Text>
          <Text className="text-center text-[#6B7280] mb-2">We sent a reset link to youremail@com</Text>
          <Text className="text-center text-[#6B7280] mb-6">enter 5 digit code that mentioned in the email</Text>

          <View className="flex-row gap-3 mb-6">
            {digits.map((d, i) => (
              <TextInput
                key={i}
                ref={inputs[i]}
                value={d}
                onChangeText={(t) => setDigitAt(i, t)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                keyboardType="number-pad"
                maxLength={1}
                className="w-12 h-12 rounded-lg border border-[#1D7A52] text-center text-lg font-semibold"
              />
            ))}
          </View>

          <TouchableOpacity onPress={verifyCode} className="bg-[#1D7A52] rounded-xl py-4 items-center w-full mb-4">
            <Text className="text-white font-semibold">Verify Code</Text>
          </TouchableOpacity>

          <View className="flex-row items-center">
            <Text className="text-[#6B7280]">Did not receive the email? </Text>
            <TouchableOpacity onPress={resendCode}>
              <Text className="text-[#1D7A52] font-semibold">Resend Code</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 left-0 w-16 h-16" resizeMode="contain" />
        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 right-0 w-16 h-16" resizeMode="contain" />
      </View>
    </View>
  );
}
