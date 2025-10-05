import React from "react";
import { View, Text, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/button";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Content */}
      <View className="flex-1 justify-center items-center ">
        {/* Illustration Image */}
        <Image
          source={require('@/assets/images/welcome-bg.png')}
          resizeMode="cover"
          className="w-72 h-80 mb-8"
        />

        {/* Title */}
        <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
          Welcome to HydroNew
        </Text>

        {/* Subtitle */}
        <Text className="text-base text-center text-muted">
          Monitor your plants, control watering, and keep everything healthy
          right from your phone.
        </Text>
      </View>

      {/* Button */}
      <View className="px-6 pb-10">
        <Button
          className="bg-primary "
        >
          <Text className="text-foreground ">
            Get Started
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default WelcomeScreen;
