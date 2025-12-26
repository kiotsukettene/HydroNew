// components/system/NetworkAlert.tsx
import React from "react";
import { View, Modal } from "react-native";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { useNetworkStore } from "@/store/network/networkStore";

export function NetworkAlert() {
  const isOffline = useNetworkStore((s) => s.isInternetReachable === false);

  if (!isOffline) return null;

  return (
    <Modal transparent animationType="fade" statusBarTranslucent>
      <View className="flex-1 bg-black/40 justify-center items-center px-6">
        <Card className="w-full max-w-md p-6">
          <Text className="text-xl font-bold text-center mb-2">
            No Internet Connection
          </Text>

          <Text className="text-gray-600 text-center">
            You’re offline or your connection is unstable.
            Some features are unavailable.
          </Text>
        </Card>
      </View>
    </Modal>
  );
}
