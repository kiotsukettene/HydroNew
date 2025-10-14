import React from "react";
import { SafeAreaView, View, Image } from "react-native";
import { Text } from "@/components/ui/text";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "expo-router";

export default function ResetSuccess() {
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
        <Link href="/login" asChild>
        <Button>
        <Text>Back to Login</Text>
      </Button></Link>
      </View>
    </SafeAreaView>
  );
}
