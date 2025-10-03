import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link } from "expo-router";

export default function WelcomeScreen() {
  return (
    <View className="flex-1 bg-green-50 justify-center items-center px-6">
      {/* Title */}
      <Text className="text-3xl font-bold text-primary mb-6">
        Welcome!
      </Text>

      {/* Temporary Lettuce Icon */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/7663/7663303.png",
        }}
        className="w-24 h-24 mb-4"
      />

      {/* Tagline */}
      <Text className="text-center text-primary mb-8">
        Fresh hydroponic lettuce, right at your fingertips.
      </Text>

      {/* Buttons */}
      <Link href="/signup" asChild>
        <TouchableOpacity className="bg-primary px-8 py-3 rounded-lg mb-4">
          <Text className="text-white font-semibold text-lg">Sign Up</Text>
        </TouchableOpacity>
      </Link>

      <Link href="/login" asChild>
        <TouchableOpacity className="border border-primary px-8 py-3 rounded-lg">
          <Text className="text-primary font-semibold text-lg">Login</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
