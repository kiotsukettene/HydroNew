import {
  Image,
  TextInput,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Pressable
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import React, {useEffect, useState} from "react";
import { PageHeader } from '@/components/ui/page-header'
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { SafeAreaView } from "react-native-safe-area-context";
import { WifiOff, Smartphone, X, Music, Lightbulb, Star, Film, Heart, Sofa, Settings } from "lucide-react-native"
import WifiModal from "@/components/ui/wifi-connection";
import FolderBg from "@/components/ui/folder-bg";
import { getMQTTClient, publishMessage, subscribeMessage } from "@/service/mqtt.client";
import { useAuthStore } from "@/store/auth/authStore";
import { Card } from "@/components/ui/card";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function DeviceConnection () {
const [wifiModal, setWifiModal] = useState(false);
// Temporary: Set to show connected device UI for testing
const [pairedDevice, setPairedDevice] = useState<any>({
  id: 'temp-device-1',
  name: 'BIOTECH MACHINE',
  model: 'MFC-1204328HD0B45',
  modelType: 'Raspberry Pi 5',
  firmware: '28743/65FG'
});

// Control states
const [soundOn, setSoundOn] = useState(true);
const [lightOn, setLightOn] = useState(false);
const [selectedPreset, setSelectedPreset] = useState('Movie');

const userId = useAuthStore((state) => state.user?.id);


useEffect(() => {
  // Check for existing paired device on mount
  const checkPairedDevice = async () => {
    if (!userId) return;
    
    try {
      const storageKey = `paired_device:${userId}`;
      const existingDevice = await AsyncStorage.getItem(storageKey);
      if (existingDevice) {
        setPairedDevice(JSON.parse(existingDevice));
      }
    } catch (err) {
      console.error("Failed to check paired device:", err);
    }
  };

  checkPairedDevice();
}, [userId]);

useEffect(() => {
  if (!userId) return;

  const subscribe = subscribeMessage(
    `devices/${userId}/pairing`,
    async (topic, message) => {
      try {
        const payloadString = message.toString();
        console.log("Received message on topic:", topic);
        console.log("Message payload:", payloadString);

        const payload = JSON.parse(payloadString);

        const storageKey = `paired_device:${userId}`;

        if (!payload?.device?.id) {
          console.warn("Invalid pairing payload:", payload);
          return;
        }

        const existingDevice = await AsyncStorage.getItem(storageKey);
        if (existingDevice) {
          console.log("Device already paired:", JSON.parse(existingDevice));
          setPairedDevice(JSON.parse(existingDevice));
          return;
        }

        await AsyncStorage.setItem(
          storageKey,
          JSON.stringify(payload.device)
        );

        setPairedDevice(payload.device);
        console.log("Device saved to AsyncStorage");
      } catch (err) {
        console.error("Failed to handle pairing payload:", err);
      }
    }
  );

  return subscribe;
}, [userId]);



function publishTestMessage() {
    publishMessage('iot/valve', 'OPEN', 0);

}
function publishTestMessage1() {
    publishMessage('iot/valve', 'CLOSE', 1);
    
}

    return (
            <SafeAreaView className="flex-1 bg-green-900">
            <PageHeader title="Device Connection" showNotificationButton={false} />
                <View className='flex-1 p-4'>
                  
                  {/* ========= IF NO DEVICE CONNECTED ========= */}
                    {!pairedDevice ? (
                        <View className="flex-1 justify-between items-center px-6" style={{ paddingVertical: 40 }}>
                            <View className="items-center" style={{ flex: 1, justifyContent: 'center' }}>
                                <View className="items-center justify-center " style={{ position: 'relative', width: 320, height: 320 }}>                    
                                    {/* Image */}
                                    <View style={{ zIndex: 1 }}>
                                        <Image 
                                            source={require('@/assets/images/no-connected.png')}
                                            resizeMode="contain"
                                            className="opacity-55"
                                            style={{ width: 220, height: 220 }}
                                        />
                                    </View>
                                </View>

                                <View className="px-2 items-center">
                                    <Text className="text-2xl font-bold mb-1 text-center" style={{ color: '#FFFFFF' }}>
                                        No device connected
                                    </Text>
                                    <Text className="text-base text-center leading-6" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                                        Please connect your device to get started.
                                    </Text>
                                </View>
                            </View>

                            {/* Pair Device Button at Bottom */}
                            <View className="w-full" style={{ paddingBottom: 20 }}>
                                <Button 
                                    variant={'ghost'}
                                    className="" 
                                    onPress={() => setWifiModal(true)}
                                >
                                    <Text className="text-lg font-semibold">Pair Device</Text>
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>

                          {/* ============= IF DEVICE CONNECTED ============== */}

                            {/* Machine Image */}
                            <View className="items-center justify-center mb-6 mt-4">
                                <Image 
                                    source={require('@/assets/images/sample-machine.png')}
                                    resizeMode="contain"
                                    style={{ width: Dimensions.get('window').width - 60, height: 300 }}
                                    className="rounded-2xl"
                                />
                            </View>

                            {/* Device Title */}
                            <View className="mb-4 px-2">
                                <Text className="text-white text-2xl font-bold text-center mb-1" style={{ textTransform: 'uppercase' }}>
                                    {pairedDevice.name || 'BIOTECH MACHINE'}
                                </Text>
                                <Text className="text-white/70 text-sm text-center">
                                    {pairedDevice.model || 'MFC-1204328HD0B45'}
                                </Text>
                            </View>

                            {/* Detail */}
                            <View className="flex-row gap-3 mb-4 px-2">
                                <Card className="flex-1 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                    <Text className="text-white/80 text-xs mb-2">Model:</Text>
                                    <Text className="text-white text-base font-semibold">
                                        {pairedDevice.modelType || 'Raspberry Pi 5'}
                                    </Text>
                                </Card>

                                {/* Firmware Card */}
                                <Card className="flex-1 p-4 rounded-2xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                    <Text className="text-white/80 text-xs mb-2">Firmware:</Text>
                                    <Text className="text-white text-base font-semibold">
                                        {pairedDevice.firmware || '28743/65FG'}
                                    </Text>
                                </Card>
                            </View>

                            {/* Status Card */}
                            <Card className="p-4 rounded-2xl mb-4 mx-2" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                                <Text className="text-white/80 text-xs mb-2">Status:</Text>
                                <Text className="text-white text-base font-semibold">Connected</Text>
                            </Card>
                        </ScrollView>
                    )}
                </View>

                <WifiModal
                    visible={wifiModal}
                    onClose={() => setWifiModal(false)}
                    onConnect={({ ssid, password, device }) => {
                        console.log("Connecting with:", ssid, password, device);
                        setPairedDevice(device);
                        setWifiModal(false); 
                    }}
                />

            </SafeAreaView>
        
    )
}