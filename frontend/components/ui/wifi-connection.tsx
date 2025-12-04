import React, { useState } from "react";
import { Modal, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Button } from "@/components/ui/button";
import { Wifi, Eye, EyeOff } from "lucide-react-native";
import { useDeviceStore } from "@/store/device/deviceStore";

interface WifiModalProps {
  visible: boolean;
  onClose: () => void;
  onConnect: (data: { ssid: string; password: string }) => void;
}

export default function WifiModal({ visible, onClose, onConnect }: WifiModalProps) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { connectDevicetoWifi, loading, error } = useDeviceStore();

  const handleConnect = async () => {
    const result = await connectDevicetoWifi(ssid, password);
    if (result) {
      onConnect({ ssid, password }); 
      onClose();
    }
  }
  
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl pt-0">

          <View className="bg-[#0D4E31] w-full pt-10 pb-12 rounded-t-3xl items-center">
              <Wifi size={50} color="white" />

            <Text className="text-white text-2xl font-bold">
              Connect device to WiFi
            </Text>
            <Text className="text-white text-base opacity-90 mt-1">
              Enter your network credentials to connect
            </Text>
          </View>

          <SafeAreaView className="p-5">
            <Text className="text-gray-700 font-medium mb-1">
              Network Name (SSID)
            </Text>
            <InputWithIcon
              placeholder="Enter WiFi network name"
              rightIcon={null}
              value={ssid}
              onChangeText={setSsid}
              className="mb-4 bg-green-50 border border-green-200 text-black"
            />

            <Text className="text-gray-700 font-medium mb-1">
              Password
            </Text>
            <InputWithIcon
              placeholder="Enter WiFi password"
              rightIcon={null}
              value={password}
              onChangeText={setPassword}
              className="mb-4 bg-green-50 border border-green-200 text-black"
              secureTextEntry={!showPassword}
            />

            <Button
              className="mt-6 bg-[#0D4E31]"
              onPress={handleConnect}
            >
              <Text className="text-white text-lg font-semibold">
                Connect
              </Text>
            </Button>

            <Text className="text-center text-gray-500 text-xs mt-4 px-6">
              Your WiFi credentials are used only for this connection and are not stored on external servers.
            </Text>

            <TouchableOpacity onPress={onClose} className="mt-5 items-center">
              <Text className="text-gray-500">Cancel</Text>
            </TouchableOpacity>

          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
