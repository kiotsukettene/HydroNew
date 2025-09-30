import { Image, Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";

export default function VerifySuccess() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white items-center justify-between pt-16 pb-8 px-6">
      <View className="items-center">
        <View className="w-24 h-24 rounded-full bg-[#E6F0FA] items-center justify-center mb-6">
          <Image source={require("../../assets/images/icon.png")} className="w-10 h-10" />
        </View>
        <Text className="text-xl font-extrabold text-center text-[#111827]">
          Your account
        </Text>
        <Text className="text-xl font-extrabold text-center text-[#111827] -mt-1">
          was successfully created!
        </Text>
        <Text className="text-center text-[#6B7280] mt-3">
          Welcome aboard! Your account has been created. We’re excited to have you join us.
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.replace("/auth/login")} className="bg-[#4C5D06] rounded-full py-4 items-center w-full">
        <Text className="text-white font-semibold">Login</Text>
      </TouchableOpacity>

      <Image source={require("../../assets/images/bg-3.png")} className="w-full h-28" resizeMode="cover" />
    </View>
  );
}


