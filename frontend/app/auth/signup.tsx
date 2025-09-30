import { useState } from "react";
import { Link, useRouter } from "expo-router";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [agree, setAgree] = useState(false);

  function onSubmit() {
    if (!agree) {
      Toast.show({ type: "error", text1: "Please agree to the terms." });
      return;
    }
    router.push("/auth/verify");
  }

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      <View className="h-[190px] w-full overflow-hidden">
        <Image
          source={require("../../assets/images/bg-2.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} className="-mt-10 px-5">
        <View className="bg-white rounded-2xl p-5 shadow">
          <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-white items-center justify-center shadow absolute -top-4 -left-2">
            <Ionicons name="chevron-back" size={22} color="#1F2937" />
          </TouchableOpacity>

          <View className="items-center mb-4">
            <Text className="text-xl font-extrabold text-[#2F2F2F]">Create your account</Text>
            <Text className="text-xs text-[#9CA3AF] mt-1">Get started — sign up now!</Text>
          </View>

          <View className="gap-3">
            <View>
              <Text className="text-xs text-[#6B7280] mb-1">Fullname</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="username"
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 bg-white"
              />
            </View>

            <View>
              <Text className="text-xs text-[#6B7280] mb-1">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@gmail.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 bg-white"
              />
            </View>

            <View>
              <Text className="text-xs text-[#6B7280] mb-1">Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="password"
                secureTextEntry
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 bg-white"
              />
            </View>

            <View>
              <Text className="text-xs text-[#6B7280] mb-1">Confirm Password</Text>
              <TextInput
                value={confirm}
                onChangeText={setConfirm}
                placeholder="password"
                secureTextEntry
                className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 bg-white"
              />
            </View>

            <TouchableOpacity onPress={() => setAgree(!agree)} className="flex-row items-start gap-2 mt-1">
              <View className={`w-4 h-4 rounded-[4px] border ${agree ? "bg-[#4C5D06] border-[#4C5D06]" : "border-[#9CA3AF]"}`} />
              <Text className="text-xs text-[#6B7280] flex-1">
                By signing up, you agree to the <Link href="/auth/terms" className="font-semibold text-[#4C5D06]">Terms and Conditions</Link>.
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSubmit} className="bg-[#4C5D06] rounded-full py-4 items-center mt-2">
              <Text className="text-white font-semibold">Sign up  →</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-2">
              <View className="flex-1 h-px bg-[#E5E7EB]" />
              <Text className="mx-2 text-xs text-[#9CA3AF]">Or Register With</Text>
              <View className="flex-1 h-px bg-[#E5E7EB]" />
            </View>

            <TouchableOpacity className="border border-[#8A944F] rounded-full py-4 items-center flex-row justify-center gap-2">
              <Ionicons name="logo-google" size={18} color="#1F2937" />
              <Text className="font-semibold text-[#1F2937]">Google</Text>
            </TouchableOpacity>

            <View className="items-center mt-2">
              <Text className="text-xs text-[#6B7280]">
                Already have an account? <Link href="/auth/login" className="text-[#4C5D06] font-semibold">Login</Link>
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


