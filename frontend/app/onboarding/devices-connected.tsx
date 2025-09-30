import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function DevicesConnected() {
  const router = useRouter();
  const connectedDevices = 2;
  return (
    <View className="flex-1 bg-[#0F553B]">
      <ImageBackground source={require("../../assets/images/bg-5.png")} resizeMode="cover" className="flex-1">
        <View className="flex-1 pt-14 pb-8 px-6">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-white/15 items-center justify-center">
              <Ionicons name="chevron-back" size={20} color="#D6F3E4" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
              <Ionicons name="scan-outline" size={20} color="#D6F3E4" />
            </TouchableOpacity>
          </View>

          <Text className="text-3xl font-extrabold text-white mt-6">Device</Text>
          <Text className="text-3xl font-extrabold text-white -mt-1">Connection</Text>

          <View className="items-center mt-6">
            <View className="relative w-64 h-64 items-center justify-center">
              <Image source={require("../../assets/images/bg-6.png")} className="w-64 h-64" resizeMode="contain" />
              <View className="absolute inset-0 items-center justify-center">
                <Text className="text-6xl font-extrabold text-[#1D4ED8]">{connectedDevices}</Text>
              </View>
              <TouchableOpacity accessibilityLabel="Confirm" onPress={() => {}} className="absolute w-14 h-14 rounded-full bg-[#1D7A52] items-center justify-center">
                <Ionicons name="checkmark" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View className="gap-3 mt-4">
            <View className="bg-white/10 rounded-2xl p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="hardware-chip" size={20} color="#BFE3D3" />
                  <View>
                    <Text className="text-white">Treatment Machine #1</Text>
                    <Text className="text-xs text-[#9CCFB9]">MFC-1204328HD0845</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-[#9CCFB9]">Connected</Text>
                  <View className="w-9 h-9 rounded-full bg-white/15 items-center justify-center">
                    <Ionicons name="flash" size={18} color="#BFE3D3" />
                  </View>
                </View>
              </View>
            </View>

            <View className="bg-white/10 rounded-2xl p-3">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Ionicons name="hardware-chip" size={20} color="#BFE3D3" />
                  <View>
                    <Text className="text-white">Treatment Machine #2</Text>
                    <Text className="text-xs text-[#9CCFB9]">MFC-242353463476456</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-[#9CCFB9]">Connected</Text>
                  <View className="w-9 h-9 rounded-full bg-white/15 items-center justify-center">
                    <Ionicons name="flash" size={18} color="#BFE3D3" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.replace("/onboarding/device-summary")} className="mt-6 bg-white/15 rounded-2xl py-4 items-center">
            <Text className="text-white">Next</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}


