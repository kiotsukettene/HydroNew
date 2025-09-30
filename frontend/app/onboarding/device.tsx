import { useState } from "react";
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";

export default function DeviceConnect() {
  const router = useRouter();
  const [deviceId, setDeviceId] = useState("");

  function onScan() {
    Toast.show({ type: "info", text1: "Scanner not implemented (demo)" });
  }

  function onSubmit() {
    if (!deviceId.trim()) {
      Toast.show({ type: "error", text1: "Enter a device number" });
      return;
    }
    Toast.show({ type: "success", text1: `Connected to ${deviceId}` });
  }

  return (
    <View className="flex-1 bg-[#0F553B]">
      <ImageBackground source={require("../../assets/images/bg-5.png")} resizeMode="cover" className="flex-1">
        <View className="flex-1 justify-between pt-14 pb-8 px-6">
          <View>
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-white/15 items-center justify-center">
                <Ionicons name="chevron-back" size={20} color="#D6F3E4" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => router.push("/onboarding/qr-scan")} className="w-10 h-10 rounded-full bg-white/15 items-center justify-center">
                <Ionicons name="scan-outline" size={20} color="#D6F3E4" />
              </TouchableOpacity>
            </View>

            <Text className="text-3xl font-extrabold text-white mt-6">Device</Text>
            <Text className="text-3xl font-extrabold text-white -mt-1">Connection</Text>

            <View className="items-center mt-8">
              <View className="w-64 h-64 items-center justify-center">
                <View className="w-56 h-56 rounded-full bg-white/6 items-center justify-center">
                  <View className="w-40 h-40 rounded-full bg-white/6 items-center justify-center">
                    <Ionicons name="add" size={56} color="#77C2A8" />
                  </View>
                </View>
              </View>
              <Text className="text-[#8CC9B1] mt-3">No Device Connected!</Text>
            </View>
          </View>

          <View className="w-full gap-3">
            <View className="flex-row items-center gap-3">
              <TextInput
                placeholder="Enter Device Number"
                value={deviceId}
                onChangeText={setDeviceId}
                className="flex-1 bg-white/10 text-white px-4 py-3 rounded-2xl"
                placeholderTextColor="#9CCFB9"
              />
              <TouchableOpacity onPress={onScan} className="w-12 h-12 rounded-2xl bg-white/10 items-center justify-center">
                <Ionicons name="wifi" size={20} color="#BFE3D3" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.replace("/(tabs)")} className="bg-[#E6F0EA] rounded-full py-4 items-center">
              <Text className="text-[#0E5A3E] font-semibold">Skip for Now</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSubmit} className="hidden" />
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}


