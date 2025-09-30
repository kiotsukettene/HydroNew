import { useState } from "react";
import { ImageBackground, Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function QrScan() {
  const router = useRouter();
  const [detected, setDetected] = useState(false);
  const [payload] = useState<{ deviceName: string; serial: string }>({
    deviceName: "HydroNew Device",
    serial: "MFC-1204328HD0845",
  });

  return (
    <View className="flex-1 bg-black/80">
      <ImageBackground source={require("../../assets/images/bg-5.png")} resizeMode="cover" className="flex-1 opacity-90">
        <View className="flex-1 pt-14 px-6">
          <TouchableOpacity onPress={() => router.back()} className="w-9 h-9 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <Text className="text-white text-2xl font-extrabold mt-6">Scan QR Code</Text>

          <View className="items-center mt-6">
            <View className="w-72 h-72 items-center justify-center rounded-2xl bg-black/40">
              <View className="w-60 h-60 rounded-2xl border-2 border-[#57C08B] items-center justify-center">
                <Ionicons name="qr-code" size={120} color="#57C08B" />
              </View>
            </View>
            <View className="items-center mt-4">
              <Pressable onPress={() => setDetected(true)} className="px-4 py-2 rounded-full bg-white/20">
                <Text className="text-white text-xs">Simulate Detection</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ImageBackground>

      <Modal visible={detected} transparent animationType="fade" onRequestClose={() => setDetected(false)}>
        <View className="flex-1 bg-black/50 items-center justify-center px-6">
          <View className="bg-white rounded-3xl w-full p-6">
            <View className="items-center">
              <View className="w-36 h-36 bg-black" />
            </View>
            <View className="items-center mt-4">
              <Text className="font-extrabold text-[#111827]">Device Name:</Text>
              <Text className="text-xs text-[#9CA3AF]">{payload.deviceName}</Text>
              <Text className="font-extrabold text-[#111827] mt-2">Serial Number:</Text>
              <Text className="text-xs text-[#6B7280]">{payload.serial}</Text>
            </View>
            <TouchableOpacity onPress={() => { setDetected(false); router.replace("/onboarding/devices-connected"); }} className="bg-[#1D7A52] rounded-full py-4 items-center mt-6">
              <Text className="text-white font-semibold">Connect Device</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}


