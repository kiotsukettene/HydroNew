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
import { WifiOff, Smartphone, X, Settings, Star, Film, Heart, Sofa, Cpu, HardDrive } from "lucide-react-native"
import WifiModal from "@/components/ui/wifi-connection";
import FolderBg from "@/components/ui/folder-bg";
import { getMQTTClient, publishMessage, subscribeMessage } from "@/service/mqtt.client";
import { useAuthStore } from "@/store/auth/authStore";
import { useDeviceStore } from "@/store/device/deviceStore";
import { Card } from "@/components/ui/card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PairOptionModal } from "@/components/ui/pair-option-modal";


export default function DeviceConnection () {
const [wifiModal, setWifiModal] = useState(false);
const [pairingMethodModal, setPairingMethodModal] = useState(false);


// Temporary: Set to show connected device UI for testing


/* const [pairedDevice, setPairedDevice] = useState<any>({
   id: 'temp-device-1',
   name: 'BIOTECH MACHINE',
   model: 'MFC-1204328HD0B45',
   modelType: 'Raspberry Pi 5',
   firmware: '28743/65FG'
 });*/


// if want to test no device connected UI, set to null
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
        
        // Also update the deviceStore so useSensorData can react to it
        useDeviceStore.getState().setDevice(payload.device);
        console.log("Device updated in deviceStore");
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
            <SafeAreaView className="flex-1 bg-gray-50">
            <PageHeader title="Device Connection" showNotificationButton={false} />
                <View className='flex-1 p-4'>
                  
                  {/* ========= IF NO DEVICE CONNECTED ========= */}
                    {!pairedDevice ? (
                        <View className="flex-1 justify-between items-center px-6" style={{ paddingVertical: 40 }}>
                            <View className="items-center" style={{ flex: 1, justifyContent: 'center' }}>
                                <View className="items-center justify-center mb-1" style={{ position: 'relative', width: 320, height: 320 }}>                    
                                    {/* Image */}
                                    <View style={{ zIndex: 1 }}>
                                        <Image 
                                            source={require('@/assets/images/no-connected.png')}
                                            resizeMode="contain"
                                            style={{ width: 220, height: 220 }}
                                        />
                                    </View>
                                </View>

                                <View className="px-2 items-center">
                                    <Text className="text-2xl text-muted-foreground font-bold mb-1 text-center" >
                                        No device connected
                                    </Text>
                                    <Text className="text-base text-muted-foreground text-center leading-6" >
                                        Please connect your device to get started.
                                    </Text>
                                </View>
                            </View>

                            {/*============== Pair Device Button ==============*/}
                            <View className="w-full" style={{ paddingBottom: 20 }}>
                                <Button 
                                    className="bg-primary" 
                                    onPress={() => setPairingMethodModal(true)}
                                >
                                    <Text className="text-white text-lg font-semibold">Pair Device</Text>
                                </Button>
                            </View>
                        </View>
                    ) : (
                        <ScrollView className="flex-1 " showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
                            {/* ============= IF DEVICE CONNECTED ============== */}

                            {/* Machine Image in Card with Shadow */}
                            <View className="items-center  justify-center mb-3 px-4">
                                <Card
                                    className=" overflow-hidden h-80 w-auto border-muted-foreground/10"
                                    style={{
                                        width: Dimensions.get('window').width - 32,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.08,
                                        shadowRadius: 20,
                                        elevation: 8,
                                        padding: 20
                                    }}
                                >
                                    <Image 
                                        source={require('@/assets/images/sample-machine.png')}
                                        resizeMode="contain"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </Card>
                            </View>

                            {/* Device Title with Better Hierarchy */}
                            <View className="mb-4 px-6">
                                <Text className="text-gray-900 text-4xl font-black text-left mb-2" >
                                    {pairedDevice.device_name || 'BIOTECH MACHINE'}
                                </Text>
                                <Text className=" text-sm text-primary text-left font-medium" >
                                    {pairedDevice.serial_number || 'MFC-1204328HD0B45'}
                                </Text>
                            </View>

                            {/* Detail Cards with Soft Shadows */}
                            <View className="flex-row gap-4 mb-4 px-4">
                                {/* Model Card - White with Yellow Accent Icon */}
                                <Pressable className="flex-1">
                                    <Card 
                                        className=" rounded-3xl border-muted-foreground/20 px-4">
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1 mr-3">
                                                <Text className="text-muted-foreground text-xs font-medium mb-3" style={{ letterSpacing: 0.3 }}>
                                                    Model
                                                </Text>
                                                <Text className=" text-lg font-bold" style={{ lineHeight: 24 }}>
                                                    {pairedDevice.model || 'Raspberry Pi 5'}
                                                </Text>
                                            </View>
                                            <View className="w-12 h-12 rounded-full bg-yellow-50 items-center justify-center">
                                                <Cpu size={22} strokeWidth={1.5} color="#FBBF24" />
                                            </View>
                                        </View>
                                    </Card>
                                </Pressable>

                                {/* Firmware Card - White */}
                                <Pressable className="flex-1">
                                    <Card 
                                        className=" rounded-3xl border-muted-foreground/20 px-4" >
                                        <View className="flex-row justify-between items-start">
                                            <View className="flex-1 mr-3">
                                                <Text className="text-muted-foreground text-xs font-medium mb-3" >
                                                    Firmware
                                                </Text>
                                                <Text className="text-lg font-bold" >
                                                    {pairedDevice.firmware_version || '28743/65FG'}
                                                </Text>
                                            </View>
                                            <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center">
                                                <HardDrive size={22} strokeWidth={1.5} color="#6B7280" />
                                            </View>
                                        </View>
                                    </Card>
                                </Pressable>
                            </View>

                            {/* Status Card  */}
                            <View className="mb-6 px-4">
                                <Card 
                                    className="rounded-3xl border-muted-foreground/20 px-6 py-4"    
                                >
                                    <View className="flex-row justify-between items-center">
                                        <View>
                                            <Text className="text-muted-foreground text-xs font-medium mb-3" >
                                                Status
                                            </Text>
                                            <Text className="text-lg font-bold">
                                                {pairedDevice.status || 'Connected'}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>

                        </ScrollView>
                    )}
                </View>

                {/* =============== PAIRING DEVICE SELECTION BUTTON & MODAL ================== */}
                <PairOptionModal
                    visible={pairingMethodModal}
                    onClose={() => setPairingMethodModal(false)}
                    onWifiPress={() => {
                        setPairingMethodModal(false);
                        setWifiModal(true);
                    }}
                    onBluetoothPress={() => {
                        setPairingMethodModal(false);
                        // TODO: Implement Bluetooth pairing
                        console.log("Bluetooth pairing selected");
                    }}
                />

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