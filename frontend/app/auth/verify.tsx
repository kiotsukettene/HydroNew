import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

function showToast(message: string, type: "success" | "error" = "success") {
  Toast.show({ type, text1: message });
}

export default function VerifyEmail() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputs = [useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null), useRef<TextInput>(null)];

  function setDigitAt(index: number, value: string) {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    if (v && index < 5) inputs[index + 1].current?.focus();
    if (!v && index > 0) inputs[index - 1].current?.focus();
  }

  function handleKeyPress(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputs[index - 1].current?.focus();
    }
  }

  function verify() {
    const code = digits.join("");
    if (code.length !== 6) {
      showToast("Please enter the 6-digit code.", "error");
      return;
    }
    if (code === "123456") {
      showToast("Email verified!", "success");
      router.replace("/auth/verify-success");
    } else {
      showToast("Incorrect code. Try again.", "error");
    }
  }

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="h-[190px] w-full overflow-hidden">
          <Image
            source={require("../../assets/images/bg-3.png")}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="-mt-10 px-5">
          <View className="bg-white rounded-2xl p-6 shadow items-center">
            <Pressable onPress={() => router.back()} className="w-9 h-9 rounded-full bg-white items-center justify-center shadow absolute -top-4 -left-2">
              <Ionicons name="chevron-back" size={22} color="#1F2937" />
            </Pressable>

            <Image source={require("../../assets/images/icon.png")} className="w-9 h-9 mb-2" />
            <Text className="text-[#2F3A10] font-extrabold text-base">Email Verification</Text>
            <Text className="text-xs text-[#6B7280] mt-1 text-center">We've sent a 6-digit verification code to ad***@gmail.com</Text>

            <View className="flex-row gap-2 mt-4">
              {digits.map((d, i) => (
                <TextInput
                  key={i}
                  ref={inputs[i]}
                  value={d}
                  onChangeText={(t) => setDigitAt(i, t)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(i, nativeEvent.key)}
                  keyboardType="number-pad"
                  maxLength={1}
                  className="w-10 h-10 rounded-md border border-[#E5E7EB] text-center text-base"
                />
              ))}
            </View>

            <TouchableOpacity onPress={verify} className="bg-[#4C5D06] rounded-full py-3 items-center w-full mt-5">
              <Text className="text-white font-semibold">Verify Email</Text>
            </TouchableOpacity>

            <View className="items-center mt-3">
              <Text className="text-[11px] text-[#9CA3AF]">Didn't receive the code?</Text>
              <Pressable onPress={() => showToast("Verification code resent.", "success")}> 
                <Text className="text-xs text-[#4C5D06] font-semibold">Resend code</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View className="mt-8">
          <Image
            source={require("../../assets/images/bg-3.png")}
            className="w-full h-28"
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </View>
  );
}


