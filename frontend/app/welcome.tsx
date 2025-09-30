import { Link, useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Welcome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-[#F3F3F3]">
      {/* Top Illustration Section */}
      <View className="flex-1 justify-center px-6">
        <View className="w-full rounded-[28px] overflow-hidden shadow-lg">
          <Image
            source={require("../assets/images/bg-1.png")}
            className="w-full h-[400px]"
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Bottom Content Section */}
      <View className="bg-white rounded-t-[28px] px-6 py-8">
        <View className="items-center gap-4 mb-8">
          <Text className="text-3xl font-extrabold text-[#2F2F2F]" style={{ fontFamily: 'FingerPaint' }}>Welcome to</Text>
          <Text className="text-4xl font-extrabold text-[#53610D]" style={{ fontFamily: 'FingerPaint' }}>HydroNew</Text>
          <Text className="text-center text-[#6B7280] px-4 text-base leading-6">
            Sustainable solutions start here — powered by nature and intelligence.
          </Text>
        </View>

        <View className="gap-4">
          <TouchableOpacity
            onPress={() => router.push("/auth/signup")}
            className="bg-[#4C5D06] rounded-2xl py-4 items-center flex-row justify-center"
          >
            <Text className="text-white font-semibold text-lg">Get Started</Text>
            <Text className="text-white font-semibold text-lg ml-2">→</Text>
          </TouchableOpacity>

          <Link
            href="/auth/login"
            className="rounded-2xl py-4 items-center border-2 border-[#4C5D06]"
          >
            <Text className="text-[#4C5D06] font-semibold text-lg">Login</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}


