import {
  Image,
  TextInput,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  Pressable,
  Modal,
} from "react-native";
import Svg, { Circle } from "react-native-svg";
import React, { useEffect, useState } from "react";
import { PageHeader } from '@/components/ui/page-header'
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Separator } from "@/components/ui/separator";
import { SafeAreaView } from "react-native-safe-area-context";
import { WifiOff, Smartphone, X, Settings, Star, Film, Heart, Sofa, Cpu, HardDrive, Trash2, QrCodeIcon } from "lucide-react-native"
import WifiModal from "@/components/ui/wifi-connection";
import FolderBg from "@/components/ui/folder-bg";
import { getMQTTClient, publishMessage, subscribeMessage } from "@/service/mqtt.client";
import { useAuthStore } from "@/store/auth/authStore";
import { useDeviceStore } from "@/store/device/deviceStore";
import { useNetworkStore } from "@/store/network/networkStore";
import { Card } from "@/components/ui/card";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PairOptionModal } from "@/components/ui/pair-option-modal";
import { toast } from "sonner-native";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import QRCode from "react-native-qrcode-svg";
import { CameraView, Camera } from "expo-camera";

export default function DeviceConnection () {
const [wifiModal, setWifiModal] = useState(false);
const [pairingMethodModal, setPairingMethodModal] = useState(false);
const [showUnpairModal, setShowUnpairModal] = useState(false);
const { unpairDevice, generateQrPayload, pairDeviceByQr, loading: deviceLoading } = useDeviceStore();

// if want to test no device connected UI, set to null
const [pairedDevice, setPairedDevice] = useState<any>(null);

const [showQrModal, setShowQrModal] = useState(false);
const [qrValue, setQrValue] = useState<string | null>(null);
const [qrLoading, setQrLoading] = useState(false);

const [showScannerModal, setShowScannerModal] = useState(false);
const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
const [isScanning, setIsScanning] = useState(false);

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
        toast.success("Device paired successfully!");
        
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

async function handleGenerateQr() {
    try {
      setQrLoading(true);
      setShowQrModal(true);

      const payload = await generateQrPayload();

      if (!payload) {
        toast.error("Failed to generate QR payload.");
        setShowQrModal(false);
        return;
      }

      const value = JSON.stringify(payload);
      setQrValue(value);
    } catch (error) {
      console.error("Failed to generate QR payload:", error);
      toast.error("An error occurred while generating QR payload.");
      setShowQrModal(false);
    } finally {
      setQrLoading(false);
    }
  }

  const handleOpenScanner = async () => {
    try {
      // Request permission FIRST before opening modal
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status === "granted") {
        setHasCameraPermission(true);
        setShowScannerModal(true);
      } else {
        setHasCameraPermission(false);
        toast.error("Camera permission is required to scan QR codes.");
      }
    } catch (error) {
      console.error("Failed to request camera permission:", error);
      toast.error("Unable to access camera for scanning.");
      setHasCameraPermission(false);
    }
  };

  const handleBarCodeScanned = async (data: string) => {
    if (isScanning) return;
    setIsScanning(true);

    try {
      let parsed: any;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        toast.error("Invalid QR code format.");
        setIsScanning(false);
        return;
      }

      const { serial_number, device_name, model } = parsed || {};

      if (!serial_number || !device_name || !model) {
        toast.error("QR code is missing required device data.");
        setIsScanning(false);
        return;
      }

      // Automatically call pair-by-qr API with the QR content
      const payload = { serial_number, device_name, model };
      console.log("QR detected, pairing device with payload:", payload);

      const response = await pairDeviceByQr(payload);

      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Device paired successfully via QR.");
      }

      // Refresh the paired device after successful pairing
      if (userId) {
        const storageKey = `paired_device:${userId}`;
        // Wait a moment for backend to save, then refresh
        setTimeout(async () => {
          try {
            const existingDevice = await AsyncStorage.getItem(storageKey);
            if (existingDevice) {
              const device = JSON.parse(existingDevice);
              setPairedDevice(device);
              useDeviceStore.getState().setDevice(device);
            } else {
              // If not in storage, fetch from API
              await useDeviceStore.getState().fetchDevice(userId);
              const devices = useDeviceStore.getState().devices;
              if (devices.length > 0) {
                setPairedDevice(devices[0]);
              }
            }
          } catch (err) {
            console.error("Failed to refresh device after pairing:", err);
          }
        }, 500);
      }

      // Close scanner modal after successful pairing
      setShowScannerModal(false);
    } catch (error: any) {
      console.error("Failed to pair device via QR:", error);
      const errorMessage = error?.response?.data?.message || "Failed to pair device via QR.";
      toast.error(errorMessage);
    } finally {
      setIsScanning(false);
    }
  };

const handleUnpair = async () => {
    if (!userId) return;

    try {
        const result = await unpairDevice();
        if (result?.success) {
            setPairedDevice(null);
            setShowUnpairModal(false);
            toast.success(result.message);
        } else {
            toast.error(result?.message ?? "Failed to unpair device");
        }
    } catch (err) {
        console.error("Unpair error:", err);
        toast.error("An error occurred while unpairing");
    }
};

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
                            <View className="w-full space-y-3 gap-2" style={{ paddingBottom: 20 }}>
                                <Button 
                                    className="bg-primary" 
                                    onPress={handleOpenScanner}
                                >
                                    <Text className="text-white text-lg font-semibold">Scan QR Code</Text>
                                </Button>

                                <Button 
                                    variant="outline"
                                    onPress={() => setPairingMethodModal(true)}
                                >
                                    <Text className="text-primary text-lg font-semibold mb-2">Pair Device</Text>
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
                                        position: 'relative',
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.08,
                                        shadowRadius: 20,
                                        elevation: 8,
                                        padding: 20
                                    }}
                                >
                                    {/* Generate QR Button overlayed on top-right of the machine image */}
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: 16,
                                            right: 16,
                                            zIndex: 2,
                                        }}
                                    >
                                        <Pressable
                                            onPress={handleGenerateQr}
                                            hitSlop={10}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <QrCodeIcon size={25} color="#000" />
                                        </Pressable>
                                    </View>

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

                            {/* Button to go to filtration page */}
                            <View className="px-4">
                                <Button 
                                    className="bg-red-500 active:bg-red-600" 
                                    onPress={() => setShowUnpairModal(true)}
                                    disabled={deviceLoading}
                                >
                                    <Text className="text-white text-lg font-semibold">
                                        {deviceLoading ? "Unpairing..." : "Unpair Device"}
                                    </Text>
                                </Button>
                            </View>
                        </ScrollView>
                    )}
                </View>

                <ConfirmationModal
                    visible={showUnpairModal}
                    icon={<Trash2 size={40} color="#EF4444" />}
                    modalTitle="Unpair Device"
                    modalDescription="Are you sure you want to unpair this device? You will need to pair it again to use it."
                    confirmText="Unpair"
                    confirmButtonColor="bg-red-500"
                    iconBgColor="bg-red-50"
                    onConfirm={handleUnpair}
                    onCancel={() => setShowUnpairModal(false)}
                />

                {/* =============== PAIRING DEVICE SELECTION BUTTON & MODAL ================== */}
                <PairOptionModal
                    visible={pairingMethodModal}
                    onClose={() => setPairingMethodModal(false)}
                    onWifiPress={() => {
                        setPairingMethodModal(false);
                        setWifiModal(true);
                        // Set pairing flag to ignore network alerts
                        useNetworkStore.getState().setIsPairingDevice(true);
                    }}
                    onBluetoothPress={() => {
                        setPairingMethodModal(false);
                        // TODO: Implement Bluetooth pairing
                        console.log("Bluetooth pairing selected");
                    }}
                />

                <WifiModal
                    visible={wifiModal}
                    onClose={() => {
                        setWifiModal(false);
                        // Clear pairing flag when modal closes
                        useNetworkStore.getState().setIsPairingDevice(false);
                    }}
                    onConnect={({ ssid, password, device }) => {
                        console.log("Connecting with:", ssid, password, device);
                        setPairedDevice(device);
                        setWifiModal(false);
                        // Clear pairing flag after successful connection
                        useNetworkStore.getState().setIsPairingDevice(false);
                    }}
                />

                <Modal
                  visible={showQrModal}
                  animationType="slide"
                  transparent
                  onRequestClose={() => setShowQrModal(false)}
                >
                  <View className="flex-1 bg-black/70 items-center justify-center px-6">
                    <View className="bg-white rounded-3xl p-6 items-center w-full">
                      <Text className="text-xl font-semibold mb-4 text-center">
                        Share Device Access
                      </Text>

                      {qrLoading && (
                        <Text className="text-muted-foreground mb-4">
                          Generating QR...
                        </Text>
                      )}

                      {!qrLoading && qrValue && (
                        <View className="mb-4 items-center justify-center">
                          <View
                            style={{
                              padding: 16,
                              backgroundColor: "white",
                              borderRadius: 24,
                            }}
                          >
                            <QRCode
                              value={qrValue}
                              size={240}
                            />
                          </View>
                        </View>
                      )}

                      {!qrLoading && !qrValue && (
                        <Text className="text-muted-foreground mb-4 text-center">
                          Unable to generate QR code.
                        </Text>
                      )}

                      <Button
                        className="mt-2 w-full"
                        onPress={() => {
                          setShowQrModal(false);
                          setQrValue(null);
                        }}
                      >
                        <Text className="text-white text-base font-semibold">
                          Close
                        </Text>
                      </Button>
                    </View>
                  </View>
                </Modal>

                {/* Scanner Modal for pairing via QR code */}
                <Modal
                  visible={showScannerModal}
                  animationType="slide"
                  transparent
                  onRequestClose={() => {
                    setShowScannerModal(false);
                    setHasCameraPermission(null);
                  }}
                >
                  <View className="flex-1 bg-black/70 items-center justify-center px-6">
                    <View className="bg-white rounded-3xl p-6 items-center w-full">
                      <Text className="text-xl font-semibold mb-4 text-center">
                        Scan Device QR Code
                      </Text>

                      {hasCameraPermission ? (
                        <View style={{ width: "100%", height: 320, borderRadius: 24, overflow: "hidden" }}>
                          <CameraView
                            style={{ width: "100%", height: "100%" }}
                            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
                            onBarcodeScanned={({ data }) => {
                              if (!isScanning) {
                                handleBarCodeScanned(data);
                              }
                            }}
                          />
                        </View>
                      ) : (
                        <Text className="text-muted-foreground mb-4 text-center">
                          Camera permission is required to scan QR codes.
                        </Text>
                      )}

                      <Button
                        className="mt-4 w-full"
                        onPress={() => setShowScannerModal(false)}
                      >
                        <Text className="text-white text-base font-semibold">
                          Close
                        </Text>
                      </Button>
                    </View>
                  </View>
                </Modal>

            </SafeAreaView>
        
    )
}