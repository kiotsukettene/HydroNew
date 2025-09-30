import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DeviceSummary() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-white items-center justify-between pt-16 pb-10 px-6">
      <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-black/5 items-center justify-center self-start">
        <Ionicons name="chevron-back" size={20} color="#111827" />
      </TouchableOpacity>

      <View className="items-center -mt-8">
        <Image source={require("../../assets/images/bg-circle.png")} className="w-64 h-64" resizeMode="contain" />
        <Text className="text-xl font-extrabold text-[#111827] mt-6 text-center">Device connected
successfully !</Text>
        <Text className="text-center text-[#6B7280] mt-3">
          Your IoT Device has been connected! Start monitoring now!
        </Text>
      </View>

      <View className="w-full gap-3">
        <TouchableOpacity onPress={() => router.replace("/onboarding/devices-connected")} className="bg-[#1D7A52] rounded-2xl py-4 items-center">
          <Text className="text-white">View Devices</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/(tabs)")} className="bg-[#E5E7EB] rounded-2xl py-4 items-center">
          <Text className="text-[#6B7280]">Go to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


