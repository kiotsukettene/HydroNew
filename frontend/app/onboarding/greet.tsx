import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Greet() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#0E5A3E] items-center justify-between pt-16 pb-8 px-6">
      <View className="items-center">
        <Image
          source={require("../../assets/images/bg-4.png")}
          className="w-56 h-56"
          resizeMode="contain"
        />
        <Text className="text-white text-3xl font-extrabold text-center mt-4">Welcome</Text>
        <Text className="text-white text-2xl font-extrabold text-center">to HydroNew, Momo!</Text>
        <Text className="text-[#BFE3D3] text-center mt-2">
          Let's start nurturing smarter and greener farming together.
        </Text>
      </View>

      <TouchableOpacity onPress={() => router.push("/onboarding/device")} className="bg-white rounded-full py-4 items-center w-full">
        <Text className="text-[#0E5A3E] font-semibold">Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}


