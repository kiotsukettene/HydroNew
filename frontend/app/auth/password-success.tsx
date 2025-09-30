import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PasswordSuccess() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F3F3F3] items-center justify-center px-6">
      <View className="bg-white rounded-3xl w-full p-6 relative">
        <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center absolute top-4 left-4">
          <Ionicons name="chevron-back" size={20} color="#374151" />
        </TouchableOpacity>

        <View className="items-center mt-8">
          <View className="w-20 h-20 rounded-full bg-[#E8F5E9] items-center justify-center mb-6">
            <Ionicons name="checkmark" size={40} color="#1D7A52" />
          </View>

          <Text className="text-2xl font-extrabold text-[#1D7A52] mb-2 text-center">Password Reset Successfully!</Text>
          <Text className="text-center text-[#6B7280] mb-8">Your password has been updated. You can now log in securely.</Text>

          <TouchableOpacity onPress={() => router.replace("/auth/login")} className="bg-[#1D7A52] rounded-xl py-4 items-center w-full">
            <Text className="text-white font-semibold">Go to Login</Text>
          </TouchableOpacity>
        </View>

        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 left-0 w-16 h-16" resizeMode="contain" />
        <Image source={require("../../assets/images/leaf.png")} className="absolute bottom-0 right-0 w-16 h-16" resizeMode="contain" />
      </View>
    </View>
  );
}
