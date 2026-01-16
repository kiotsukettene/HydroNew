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
import React, {useEffect, useState} from "react";
import { PageHeader } from '@/components/ui/page-header'
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { SafeAreaView } from "react-native-safe-area-context";
import { WifiOff, Smartphone, X } from "lucide-react-native"
import WifiModal from "@/components/ui/wifi-connection";
import FolderBg from "@/components/ui/folder-bg";
import { getMQTTClient, publishMessage, subscribeMessage } from "@/service/mqtt-client";
import { useAuthStore } from "@/store/auth/authStore";
import { Card } from "@/components/ui/card";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function DeviceConnection () {
const [wifiModal, setWifiModal] = useState(false);
const [pairedDevice, setPairedDevice] = useState<any>(null);

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
        <ImageBackground className="flex-1" source={require('@/assets/images/device-con-bg.png')} resizeMode="cover">
            <SafeAreaView className="flex-1">
                <View className='flex-1 p-4'>
                    <PageHeader title="Device Connection" showNotificationButton={false} />
                    {!pairedDevice ? (
                        <View className="flex-1 justify-between items-center px-6" style={{ paddingVertical: 40 }}>
                            {/* Top Content */}
                            <View className="items-center" style={{ flex: 1, justifyContent: 'center' }}>
                                {/* Illustration Container */}
                                

                                {/* Text Content */}
                                <View className="px-2">
                                   
                                    <Text className="text-lg font-semibold mb-2 text-center" style={{ color: '#155036', textShadowColor: 'rgba(255, 255, 255, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                                        No device connected.
                                    </Text>
                                    <Text className="text-base text-center" style={{ color: '#155036', opacity: 0.9, textShadowColor: 'rgba(255, 255, 255, 0.8)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }}>
                                        Please connect your device to get started.
                                    </Text>
                                </View>
                            </View>

                            {/* Pair Device Button at Bottom */}
                            <View className="w-full" style={{ paddingBottom: 20 }}>
                                <Button 
                                    className="" 
                                    onPress={() => setWifiModal(true)}
                                >
                                    <Text className="text-white text-lg font-semibold">Pair Device</Text>
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <>
                            <ImageBackground
                                source={require('@/assets/images/add-device-circle.png')}
                                resizeMode="contain"
                                className="h-80 w-64 justify-center items-center self-center"
                            >   <Pressable onPress={() => setWifiModal(true)}>
                                <View className="p-4 items-center justify-center">
                                    <Text className="text-secondary font-bold text-5xl">+</Text>
                                </View>
                                </Pressable>
                            </ImageBackground>

                            <View className="flex-1 p-4 bg-white/75 rounded-3xl mt-4 space-y-3 ">
                                <Text className="text-center text-[#155036] text-base">
                                Click the button below to pair a device. Make sure your device is powered on and already connected to a known network.  
                                If not, add it to the network to pair it.
                                </Text>
                                <View className="flex-1 justify-end">
                                    <Button className="bg-[#155036]">
                                        <Text className="text-white">Pair Device</Text>
                                    </Button>
                                </View>
                            </View>
                        </>
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
        </ImageBackground> 
    )
}