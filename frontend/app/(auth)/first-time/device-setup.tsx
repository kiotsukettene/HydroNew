import {
  Image,
  View,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import WifiModal from "@/components/ui/wifi-connection";
import { subscribeMessage } from "@/service/mqtt.client";
import { useAuthStore } from "@/store/auth/authStore";
import { useDeviceStore } from "@/store/device/deviceStore";
import { useNetworkStore } from "@/store/network/networkStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PairOptionModal } from "@/components/ui/pair-option-modal";
import { toast } from "sonner-native";
import { CameraView, Camera } from "expo-camera";

export default function DeviceSetup() {
  const router = useRouter();
  const [wifiModal, setWifiModal] = useState(false);
  const [pairingMethodModal, setPairingMethodModal] = useState(false);
  const { pairDeviceByQr, devices } = useDeviceStore();
  const [isPairing, setIsPairing] = useState(false);

  const [showScannerModal, setShowScannerModal] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const userId = useAuthStore((state) => state.user?.id);
  const pairedDevice = devices?.[0] ?? null;

  // Listen for MQTT pairing messages
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
            setIsPairing(false);
            return;
          }

          const existingDevice = await AsyncStorage.getItem(storageKey);
          if (existingDevice) {
            console.log("Device already paired:", JSON.parse(existingDevice));
            useDeviceStore.getState().setDevice(JSON.parse(existingDevice));
            setIsPairing(false);
            return;
          }

          await useDeviceStore.getState().setDeviceAndPersist(payload.device, userId);
          console.log("Device saved to AsyncStorage");

          // Clear pairing state BEFORE showing toast
          setIsPairing(false);

          // Small delay to ensure UI updates before toast
          setTimeout(() => {
            toast.success("Device paired successfully!");
            // Navigate to home or next step
            router.replace("/(tabs)/home");
          }, 100);
        } catch (err) {
          console.error("Failed to handle pairing payload:", err);
          setIsPairing(false);
        }
      }
    );

    return subscribe;
  }, [userId, router]);

  // If device is already paired, redirect to home
  useEffect(() => {
    if (pairedDevice) {
      router.replace("/(tabs)/home");
    }
  }, [pairedDevice, router]);

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
    setIsPairing(true);

    try {
      let parsed: any;
      try {
        parsed = JSON.parse(data);
      } catch (e) {
        toast.error("Invalid QR code format.");
        setIsScanning(false);
        setIsPairing(false);
        return;
      }

      const { serial_number, device_name, model } = parsed || {};

      if (!serial_number || !device_name || !model) {
        toast.error("QR code is missing required device data.");
        setIsScanning(false);
        setIsPairing(false);
        return;
      }

      // Automatically call pair-by-qr API with the QR content
      const payload = { serial_number, device_name, model };
      console.log("QR detected, pairing device with payload:", payload);

      const response = await pairDeviceByQr(payload);

      // Refresh the paired device after successful pairing (store is source of truth)
      if (userId) {
        await useDeviceStore.getState().fetchDevice(userId);
      }

      // Close scanner modal after successful pairing
      setShowScannerModal(false);

      // Show success toast AFTER the state has updated
      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Device paired successfully via QR.");
      }

      // Navigate to home after successful pairing
      setTimeout(() => {
        router.replace("/(tabs)/home");
      }, 500);
    } catch (error: any) {
      console.error("Failed to pair device via QR:", error);
      const errorMessage = error?.response?.data?.message || "Failed to pair device via QR.";
      toast.error(errorMessage);
    } finally {
      setIsScanning(false);
      setIsPairing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
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
            <Text className="text-2xl text-muted-foreground font-bold mb-1 text-center">
              Setup Your Device
            </Text>
            <Text className="text-base text-muted-foreground text-center leading-6">
              Scan the QR code on your device or connect via WiFi to get started.
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
            <Text className="text-primary text-lg font-semibold mb-2">Pair via WiFi</Text>
          </Button>

          <Button
            variant="ghost"
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text className="text-muted-foreground text-base">Skip for now</Text>
          </Button>
        </View>
      </View>

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
          console.log("WiFi pairing initiated with:", ssid, password, device);
          // Set pairing state to show loader
          setIsPairing(true);
          // Close the WiFi modal and keep showing "No device connected"
          // until the MQTT pairing message arrives and updates state.
          setWifiModal(false);
          // Clear pairing flag after successful WiFi request
          useNetworkStore.getState().setIsPairingDevice(false);
        }}
      />

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

      {/* Loading Overlay for Pairing */}
      {isPairing && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
          }}
        >
          <View className="bg-white rounded-3xl p-8 items-center" style={{ minWidth: 200 }}>
            <ActivityIndicator size="large" color="#10b981" style={{ marginBottom: 16 }} />
            <Text className="text-lg font-semibold text-center">
              Pairing device...
            </Text>
            <Text className="text-sm text-muted-foreground text-center mt-2">
              Please wait
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
