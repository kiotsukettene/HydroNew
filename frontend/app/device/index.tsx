import {
  Image,
  View,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { PageHeader } from '@/components/ui/page-header'
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Cpu, HardDrive, Trash2, QrCodeIcon, ChevronRight, Wifi } from "lucide-react-native"
import WifiModal from "@/components/ui/wifi-connection";
import { subscribeMessage } from "@/service/mqtt.client";
import { useAuthStore } from "@/store/auth/authStore";
import { useDeviceStore } from "@/store/device/deviceStore";
import { useNetworkStore } from "@/store/network/networkStore";
import { useDashboardStore } from "@/store/auth/dashboardStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { PairOptionModal } from "@/components/ui/pair-option-modal";
import { toast } from "sonner-native";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import QRCode from "react-native-qrcode-svg";
import { CameraView, Camera } from "expo-camera";

export default function DeviceConnection () {
  const router = useRouter();
  const [wifiModal, setWifiModal] = useState(false);
  const [pairingMethodModal, setPairingMethodModal] = useState(false);
  const [showUnpairModal, setShowUnpairModal] = useState(false);
  const { unpairDevice, generateQrPayload, pairDeviceByQr, loading: deviceLoading, devices, fetchDevice } = useDeviceStore();
  const { fetchDashboard } = useDashboardStore();

  /** Paired device: from store (synced with API/AsyncStorage) so DB-added devices show after focus. */
  const pairedDevice = devices?.[0] ?? null;

  const [isPairing, setIsPairing] = useState(false);

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrValue, setQrValue] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const [showScannerModal, setShowScannerModal] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  /** 1 = Online, 0 = Offline, null = not yet received from MQTT */
  const [deviceHeartbeatStatus, setDeviceHeartbeatStatus] = useState<0 | 1 | null>(null);

  const userId = useAuthStore((state) => state.user?.id);

  useFocusEffect(
    React.useCallback(() => {
      if (userId) fetchDevice(userId);
    }, [userId, fetchDevice])
  );

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

          await fetchDashboard();

          setIsPairing(false);

          setTimeout(() => {
            toast.success("Device paired successfully!");
          }, 100);
        } catch (err) {
          console.error("Failed to handle pairing payload:", err);
          setIsPairing(false);
        }
      }
    );

    return subscribe;
  }, [userId]);

  useEffect(() => {
    const serialNumber = pairedDevice?.serial_number;
    if (!serialNumber) {
      setDeviceHeartbeatStatus(null);
      return;
    }

    const topic = `biotech/${serialNumber}/heartbeat`;
    const unsubscribe = subscribeMessage(topic, (_topic, message) => {
      const value = message.toString().trim();
      if (value === '1') setDeviceHeartbeatStatus(1);
      else if (value === '0') setDeviceHeartbeatStatus(0);
    });

    return () => {
      unsubscribe();
      setDeviceHeartbeatStatus(null);
    };
  }, [pairedDevice?.serial_number]);

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

      const payload = { serial_number, device_name, model };
      console.log("QR detected, pairing device with payload:", payload);

      const response = await pairDeviceByQr(payload);

      if (userId) {
        await useDeviceStore.getState().fetchDevice(userId);
      }

      await fetchDashboard();

      setShowScannerModal(false);

      if (response?.message) {
        toast.success(response.message);
      } else {
        toast.success("Device paired successfully via QR.");
      }
    } catch (error: any) {
      console.error("Failed to pair device via QR:", error);
      const errorMessage = error?.response?.data?.message || "Failed to pair device via QR.";
      toast.error(errorMessage);
    } finally {
      setIsScanning(false);
      setIsPairing(false);
    }
  };

  const handleUnpair = async () => {
    if (!userId) return;

    try {
      const result = await unpairDevice();
      if (result?.success) {
        await fetchDashboard();
        
        setShowUnpairModal(false);
        setTimeout(() => {
          toast.success(result.message);
        }, 100);
      } else {
        toast.error(result?.message ?? "Failed to unpair device");
      }
    } catch (err) {
      console.error("Unpair error:", err);
      toast.error("An error occurred while unpairing");
    }
  };

  const statusDotColor =
    deviceHeartbeatStatus === 1 ? 'bg-emerald-500' :
    deviceHeartbeatStatus === 0 ? 'bg-red-400' : 'bg-gray-300';

  const statusTextColor =
    deviceHeartbeatStatus === 1 ? 'text-emerald-600' :
    deviceHeartbeatStatus === 0 ? 'text-red-500' : 'text-gray-400';


  const statusIconBg =
    deviceHeartbeatStatus === 1 ? 'bg-emerald-50' :
    deviceHeartbeatStatus === 0 ? 'bg-red-50' : 'bg-gray-100';

  const statusIconColor =
    deviceHeartbeatStatus === 1 ? '#10B981' :
    deviceHeartbeatStatus === 0 ? '#EF4444' : '#9CA3AF';

  return (
    <SafeAreaView className="flex-1 bg-[#F7F8FA]">
      <PageHeader title="Device Connection" showNotificationButton={false} />

      {!pairedDevice ? (
        <View className="flex-1 items-center justify-between px-6 pt-10 pb-8">
          <View className="flex-1 items-center justify-center">
            <View className="w-64 h-64 items-center justify-center mb-6">
              <Image
                source={require('@/assets/images/no-connected.png')}
                resizeMode="contain"
                className="w-56 h-56"
              />
            </View>

            <Text className="text-2xl font-bold text-gray-700 mb-2 text-center">
              No device connected
            </Text>
            <Text className="text-base text-gray-400 text-center leading-6 px-4">
              Please connect your device to get started.
            </Text>
          </View>

          <View className="w-full gap-3">
            <Button className="bg-primary" onPress={handleOpenScanner}>
              <QrCodeIcon size={24} color="#fff" />
              <Text className="text-white text-base font-semibold">Scan QR Code</Text>
            </Button>

            <Button variant="outline" onPress={() => setPairingMethodModal(true)}>
              <Text className="text-primary text-base font-semibold">Pair Device</Text>
            </Button>
          </View>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pb-10"
        >
          {/* Hero Device Card */}
          <View className="px-5 pt-3 mb-5">
            <View className="bg-white rounded-3xl overflow-hidden relative shadow-md shadow-black/5">
              <Pressable
                onPress={handleGenerateQr}
                hitSlop={10}
                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-green-100 items-center justify-center shadow-sm shadow-black/10"
              >
                <QrCodeIcon size={55} color="#374151" />
              </Pressable>

              <View className="items-center justify-center py-10 px-6 h-72">
                <Image
                  source={require('@/assets/images/sample-machine.png')}
                  resizeMode="contain"
                  className="w-full h-full"
                />
              </View>
            </View>
          </View>

          {/* Device Name, Serial & Status Badge */}
          <View className="px-6 mb-6">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {pairedDevice.device_name || 'BIOTECH MACHINE'}
            </Text>
            <Text className="text-sm text-gray-400 font-medium mb-3 tracking-wide">
              {pairedDevice.serial_number || 'MFC-1204328HD0B45'}
            </Text>
           
          </View>

          {/* Device Information Cards */}
          <View className="px-5 gap-3 mb-8">
            <Pressable className="w-full active:opacity-80">
              <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm shadow-black/5">
                <View className="w-11 h-11 rounded-xl bg-amber-50 items-center justify-center mr-4">
                  <Cpu size={20} strokeWidth={1.8} color="#F59E0B" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 font-medium mb-0.5">Model</Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {pairedDevice.model || 'Raspberry Pi 5'}
                  </Text>
                </View>
                <ChevronRight size={18} color="#D1D5DB" />
              </View>
            </Pressable>

            <Pressable className="w-full active:opacity-80">
              <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm shadow-black/5">
                <View className="w-11 h-11 rounded-xl bg-slate-100 items-center justify-center mr-4">
                  <HardDrive size={20} strokeWidth={1.8} color="#64748B" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 font-medium mb-0.5">Firmware</Text>
                  <Text className="text-base font-semibold text-gray-800">
                    {pairedDevice.firmware_version || '28743/65FG'}
                  </Text>
                </View>
                <ChevronRight size={18} color="#D1D5DB" />
              </View>
            </Pressable>

            <Pressable className="w-full active:opacity-80">
              <View className="bg-white rounded-2xl px-5 py-4 flex-row items-center shadow-sm shadow-black/5">
                <View className={`w-11 h-11 rounded-xl items-center justify-center mr-4 ${statusIconBg}`}>
                  <Wifi size={20} strokeWidth={1.8} color={statusIconColor} />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400 font-medium mb-0.5">Status</Text>
                  <Text className={`text-base font-semibold ${
                    deviceHeartbeatStatus === 1 ? 'text-emerald-600' :
                    deviceHeartbeatStatus === 0 ? 'text-red-500' : 'text-gray-800'
                  }`}>
                    {deviceHeartbeatStatus === 1 ? 'Online' :
                     deviceHeartbeatStatus === 0 ? 'Offline' : '—'}
                  </Text>
                </View>
                <ChevronRight size={18} color="#D1D5DB" />
              </View>
            </Pressable>
          </View>

          {/* Unpair Device Button */}
          <View className="px-5">
            <Pressable
              className={`flex-row items-center justify-center h-12 rounded-full border border-red-200 bg-red-50 active:bg-red-100 ${deviceLoading ? 'opacity-50' : ''}`}
              onPress={() => setShowUnpairModal(true)}
              disabled={deviceLoading}
            >
              <Trash2 size={16} color="#EF4444" />
              <Text className="text-red-500 text-base font-semibold ml-2">
                {deviceLoading ? "Unpairing..." : "Unpair Device"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      )}

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

      <PairOptionModal
        visible={pairingMethodModal}
        onClose={() => setPairingMethodModal(false)}
        onWifiPress={() => {
          setPairingMethodModal(false);
          setWifiModal(true);
          useNetworkStore.getState().setIsPairingDevice(true);
        }}
        onBluetoothPress={() => {
          setPairingMethodModal(false);
          console.log("Bluetooth pairing selected");
        }}
      />

      <WifiModal
        visible={wifiModal}
        onClose={() => {
          setWifiModal(false);
          useNetworkStore.getState().setIsPairingDevice(false);
        }}
        onConnect={({ ssid, password, device }) => {
          console.log("WiFi pairing initiated with:", ssid, password, device);
          setIsPairing(true);
          setWifiModal(false);
          useNetworkStore.getState().setIsPairingDevice(false);
        }}
      />

      {/* QR Share Modal */}
      <Modal
        visible={showQrModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowQrModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-white rounded-3xl p-8 items-center w-full">
            <Text className="text-xl font-bold text-gray-900 mb-1 text-center">
              Share Device Access
            </Text>
            <Text className="text-sm text-gray-400 mb-6 text-center">
              Scan this QR code to pair with this device
            </Text>

            {qrLoading && (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#10b981" />
                <Text className="text-gray-400 mt-3 text-sm">Generating QR...</Text>
              </View>
            )}

            {!qrLoading && qrValue && (
              <View className="bg-gray-50 rounded-2xl p-6 mb-6 items-center">
                <QRCode value={qrValue} size={220} />
              </View>
            )}

            {!qrLoading && !qrValue && (
              <Text className="text-gray-400 mb-6 text-center">
                Unable to generate QR code.
              </Text>
            )}

            <Pressable
              className="w-full h-12 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
              onPress={() => {
                setShowQrModal(false);
                setQrValue(null);
              }}
            >
              <Text className="text-gray-700 text-base font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Scanner Modal */}
      <Modal
        visible={showScannerModal}
        animationType="slide"
        transparent
        onRequestClose={() => {
          setShowScannerModal(false);
          setHasCameraPermission(null);
        }}
      >
        <View className="flex-1 bg-black/60 items-center justify-center px-6">
          <View className="bg-white rounded-3xl p-6 items-center w-full">
            <Text className="text-xl font-bold text-gray-900 mb-1 text-center">
              Scan Device QR
            </Text>
            <Text className="text-sm text-gray-400 mb-5 text-center">
              Point your camera at the device QR code
            </Text>

            {hasCameraPermission ? (
              <View style={{ width: "100%", height: 320, borderRadius: 24, overflow: "hidden", marginBottom: 16 }}>
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
              <Text className="text-gray-400 mb-5 text-center">
                Camera permission is required to scan QR codes.
              </Text>
            )}

            <Pressable
              className="w-full h-12 rounded-full bg-gray-100 items-center justify-center active:bg-gray-200"
              onPress={() => setShowScannerModal(false)}
            >
              <Text className="text-gray-700 text-base font-semibold">Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Pairing Loading Overlay */}
      {isPairing && (
        <View className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 items-center justify-center z-[9999]">
          <View className="bg-white rounded-3xl px-10 py-8 items-center">
            <View className="mb-4">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center">
              Pairing device...
            </Text>
            <Text className="text-sm text-gray-400 text-center mt-2">
              Please wait
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
