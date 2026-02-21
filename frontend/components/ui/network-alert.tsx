import React from "react";
import { View, Image, SafeAreaView } from "react-native";
import { Text } from "@/components/ui/text";
import { useNetworkStore } from "@/store/network/networkStore";
import Svg, { Rect, Circle, Defs, ClipPath, G } from "react-native-svg";

export function NetworkAlert() {
  const isOffline = useNetworkStore(s => s.isInternetReachable === false);
  const isPairingDevice = useNetworkStore(s => s.isPairingDevice);
  
  // Don't show the alert if we're pairing a device (expected to lose internet)
  if (!isOffline || isPairingDevice) return null;

  return (
    <SafeAreaView className="absolute inset-0 z-[99999] bg-white">
      {/* SVG BACKGROUND */}
      <Svg viewBox="0 0 415 896" className="absolute inset-0">
        <Defs>
          <ClipPath id="clip">
            <Rect width="415" height="896" rx="37" />
          </ClipPath>
        </Defs>

        <G clipPath="url(#clip)">
          <Rect width="415" height="896" fill="white" />
          <Circle cx="24" cy="590" r="38" fill="#1D6143" opacity={0.2} />
          <Circle cx="415" cy="206" r="38" fill="#1D6143" opacity={0.2} />
          <Circle cx="295.5" cy="32.5" r="32.5" fill="#1D6143" opacity={0.2} />
          <Circle cx="252" cy="78" r="52" fill="#1D6143" opacity={0.2} />
          <Circle cx="152" cy="306" r="72" fill="#1D6143" opacity={0.1} />
          <Circle cx="296" cy="510" r="72" fill="#1D6143" opacity={0.1} />
          <Circle cy="550" r="40" fill="#1D6143" opacity={0.2} />
          <Circle cx="223" cy="799" r="23" fill="#1D6143" opacity={0.2} />
          <Circle cx="263" cy="816" r="40" fill="#1D6143" opacity={0.2} />
        </G>
      </Svg>

      {/* FOREGROUND CONTENT */}
      <View className="absolute inset-0 justify-center items-center px-6">
        <Image
          source={require("@/assets/images/no-connected.png")}
          className="w-48 h-48 mb-6"
          resizeMode="contain"
        />
        <View className="px-2">
          <Text className="text-2xl font-semibold mb-1.5 text-center">
            No Internet
          </Text>
          <Text className="text-lg opacity-60 text-center">
            Your internet connection is down. Please connect to the internet to continue using the app.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}