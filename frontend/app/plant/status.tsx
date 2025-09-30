import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function PlantStatus() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-12 pb-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center">
          <Ionicons name="chevron-back" size={24} color="#111827" />
          <Text className="text-lg font-semibold text-[#111827] ml-2">Plant Status</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-9 h-9 rounded-full bg-[#E7F0E9] items-center justify-center">
          <Ionicons name="notifications-outline" size={18} color="#1D7A52" />
        </TouchableOpacity>
      </View>

      {/* Plant Display */}
      <View className="items-center px-5 mb-6">
        <Text className="text-2xl font-extrabold text-[#111827] mb-4">Green Lettuce</Text>
        <View className="relative">
          <Image source={require("../../assets/images/lettuce.png")} className="w-64 h-80" resizeMode="contain" />
          <Image source={require("../../assets/images/container.png")} className="absolute bottom-0 w-32 h-20" resizeMode="contain" />
        </View>
      </View>

      {/* Stats Card */}
      <View className="mx-5 mb-6">
        <View className="bg-[#1D7A52] rounded-2xl p-5">
          <Text className="text-white text-lg font-semibold mb-4">My Lettuce</Text>
          
          <View className="flex-row justify-between mb-4">
            <View className="items-center">
              <Text className="text-white text-2xl font-extrabold">10</Text>
              <Text className="text-white/80 text-xs">DAYS</Text>
              <Text className="text-white/60 text-xs">PLANT AGE</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-extrabold">18</Text>
              <Text className="text-white/80 text-xs">DAYS</Text>
              <Text className="text-white/60 text-xs">ESTIMATED DAYS LEFT</Text>
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="items-center">
              <Text className="text-white text-2xl font-extrabold">41%</Text>
              <Text className="text-white/80 text-xs">HUMIDITY</Text>
            </View>
            <View className="items-center">
              <Text className="text-white text-2xl font-extrabold">80%</Text>
              <Text className="text-white/80 text-xs">WATER TANK</Text>
              <Text className="text-white/60 text-xs">AVAILABLE</Text>
            </View>
          </View>

          <TouchableOpacity className="bg-[#EAF4E9] border border-[#1D7A52] rounded-xl py-3 flex-row items-center justify-center">
            <Ionicons name="water" size={20} color="#1D7A52" />
            <Text className="text-[#1D7A52] font-semibold ml-2">Start Pump</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Watering Schedule */}
      <View className="mx-5 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-[#111827]">Watering Schedule</Text>
        <TouchableOpacity>
          <Text className="text-[#1D7A52] font-semibold">Edit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
