import React, { useEffect } from "react";
import { SafeAreaView, View, Image, BackHandler } from "react-native";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";

export default function ResetSuccess() {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/(auth)/login');
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const handleBackToLogin = () => {
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center  px-6">
      {/* Circular Icon Wrapper */}
      <View className="w-36 h-36 rounded-full bg-primary/20  overflow-hidden">
        <Image
        style={{ width: 140, height: 140, backgroundColor: '#E9FFD8' }}
          source={require("@/assets/images/check.png")}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View className=" mt-4 pt-3 items-center">
        <Text className="text-2xl font-semibold text-primary text-center">
          Password Reset Successfully!
        </Text>
        <Label className="text-center text-muted-foreground/70 mt-2 text-base font-normal leading-5">
          Your password has been updated. You can now log in securely.
        </Label>
      </View>
      
      <View className="mt-4 pt-4 w-full">
        <Button onPress={handleBackToLogin}>
          <Text>Back to Login</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
