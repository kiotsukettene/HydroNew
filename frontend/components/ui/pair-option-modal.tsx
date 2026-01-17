import React from "react";
import { View, Modal, Dimensions, Pressable } from "react-native";
import { Wifi, Bluetooth } from "lucide-react-native";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface PairOptionModalProps {
  visible: boolean;
  onClose: () => void;
  onWifiPress: () => void;
  onBluetoothPress: () => void;
}

export function PairOptionModal({
  visible,
  onClose,
  onWifiPress,
  onBluetoothPress,
}: PairOptionModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 items-center justify-center">
        <Card
          className="rounded-2xl p-6 items-center mx-6"
          style={{ width: Dimensions.get("window").width - 48 }}
        >
          <Text className="text-xl font-semibold text-primary text-center">
            Choose Pairing Method
          </Text>

          <Text className="text-center text-muted-foreground mb-2 -mt-4">
            Select how you want to pair your device
          </Text>

          {/* Pairing Method Options */}
          <View className="w-full mb-4 bg-popover border border-border rounded-md overflow-hidden p-1">
            {/* WiFi Pairing Option */}
            <Pressable
              onPress={onWifiPress}
              className="active:bg-accent flex-row items-center gap-3 rounded-sm px-2 py-2"
            >
              <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                <Wifi size={24} strokeWidth={2} color="#3B82F6" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-popover-foreground">
                  Pair by WiFi
                </Text>
                <Text className="text-sm text-muted-foreground/70">
                  Connect via WiFi network
                </Text>
              </View>
            </Pressable>

            {/* Bluetooth Pairing Option */}
            <Pressable
              onPress={onBluetoothPress}
              className="active:bg-accent flex-row items-center gap-3 rounded-sm px-2 py-2"
            >
              <View className="w-12 h-12 rounded-full bg-purple-50 items-center justify-center">
                <Bluetooth size={24} strokeWidth={2} color="#A855F7" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-popover-foreground">
                  Pair by Bluetooth
                </Text>
                <Text className="text-sm text-muted-foreground/70">
                  Connect via Bluetooth
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Cancel Button */}
          <View className="w-full">
            <Button
              onPress={onClose}
              variant={"ghost"}
              className="w-full border border-muted-foreground/30 h-10 items-center justify-center"
            >
              <Text className="text-muted-foreground font-medium">Cancel</Text>
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
}
