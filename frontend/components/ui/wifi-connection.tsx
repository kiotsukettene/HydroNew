import React, { useState, useEffect } from "react";
import { Modal, View, TouchableOpacity, Platform, Linking} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { InputWithIcon } from "@/components/ui/input-with-icon";
import { Button } from "@/components/ui/button";
import { Wifi } from "lucide-react-native";
import { useDeviceStore } from "@/store/device/deviceStore";
import * as IntentLauncher from 'expo-intent-launcher';
import { Device } from "@/types/device";

interface WifiModalProps {
  visible: boolean;
  onClose: () => void;
  onConnect: (data: { ssid: string; password: string; device: Device }) => void;
}

export default function WifiModal({ visible, onClose, onConnect }: WifiModalProps) {
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneWifiPrompt, setShowPhoneWifiPrompt] = useState(false);
  const { connectDeviceToWifi, loading, error, getPairingToken } = useDeviceStore();
  const [pairingToken, setPairingToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (visible) {
      // Prefetch the token when modal opens
      getPairingToken().then(token => {
        if (token) setPairingToken(token);
        console.log("Fetched pairing token:", token);
      });
    } else {
      setPairingToken(undefined);
    }
  }, [visible]);

const handleConnect = async () => {
  if (!ssid.trim() || !password.trim()) {
    console.error("SSID and password are required");
    return;
  }

  try {
    const device = await connectDeviceToWifi(ssid, password, pairingToken);
    console.log("credentials:", ssid, password);
    if (!device || device.status === "error") {
      console.error("Device failed to connect to WiFi:", device?.message || "Unknown error");
      return;
    }

    console.log("Device connected to WiFi successfully:", device);
    setShowPhoneWifiPrompt(true);

  } catch (error: any) {
    console.error("Error connecting device:", error.message || error);
  }
};




const resetWifiModal = () => {
  setSsid("");
  setPassword("");
  setShowPassword(false);
  onClose();
}

const openPhoneWifiSettings = () => {
  if (Platform.OS === 'android') {
    IntentLauncher.startActivityAsync('android.settings.WIFI_SETTINGS');
  } else {
    Linking.openURL('App-Prefs:root=WIFI');
  }
};

  return (
    <>
      {/* Original WiFi modal */}
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
            <View>
              <Button className="mt-6 bg-[#0D4E31]" onPress={handleConnect} disabled={loading}>
                <Text className="text-white text-lg font-semibold text-center">
                  {loading ? "Connecting..." : "Connect"}
                </Text>
              </Button>
            </View>

              <Text className="text-center text-gray-500 text-xs mt-4 px-6">
                Your WiFi credentials are used only for this connection and are not stored on external servers.
              </Text>

              <TouchableOpacity onPress={resetWifiModal} className="mt-5 items-center">
                <Text className="text-gray-500">Cancel</Text>
              </TouchableOpacity>

            </SafeAreaView>
          </View>
        </View>
      </Modal>

      {/* Small follow-up modal prompting user phone to connect */}
      <Modal visible={showPhoneWifiPrompt} animationType="fade" transparent>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md items-center">
            <Wifi size={40} color="#0D4E31" className="mb-4" />
            <Text className="text-xl font-bold text-center mb-2">
              Connect your phone to WiFi
            </Text>
            <Text className="text-center text-gray-700 mb-6">
              Please connect your phone to the same network as your device:
            </Text>
            <Text className="font-semibold text-center mb-4">{ssid}</Text>

            <Button className="bg-[#0D4E31] w-full mb-3" onPress={openPhoneWifiSettings}>
              <Text className="text-white text-lg font-semibold text-center">
                Open WiFi Settings
              </Text>
            </Button> 

            <TouchableOpacity onPress={() => setShowPhoneWifiPrompt(false)} className="mt-2">
              <Text className="text-gray-500 text-center">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
