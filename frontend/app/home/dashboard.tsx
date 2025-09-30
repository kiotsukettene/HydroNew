import { Image, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Dashboard() {
  const router = useRouter();
  
  return (
    <View className="flex-1 bg-white px-5 pt-10 pb-20">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-xs text-[#9CA3AF]">Hello,</Text>
          <Text className="text-xl font-extrabold text-[#111827]">Momo!</Text>
        </View>
        <TouchableOpacity 
          onPress={() => router.push("/notifications")}
          className="w-9 h-9 rounded-full bg-[#E7F0E9] items-center justify-center"
        >
          <Ionicons name="notifications-outline" size={18} color="#1D7A52" />
        </TouchableOpacity>
      </View>

      <View className="rounded-2xl overflow-hidden mb-3 bg-white shadow">
        <Image source={require("../../assets/images/bg-home.jpg")} className="w-full h-36" resizeMode="cover" />
        <View className="absolute left-5 top-5">
          <View className="bg-white/80 rounded-lg px-2 py-1 mb-1 w-16 items-center">
            <Text className="text-[#0EA5E9] font-bold">6.5</Text>
            <Text className="text-[10px] text-[#64748B]">pH Level</Text>
          </View>
        </View>
        <View className="absolute bottom-3 left-0 right-0 px-5 flex-row justify-between">
          <View className="items-center">
            <Text className="text-[#475569] text-xs">Water Status</Text>
            <Text className="text-[11px] bg-white/90 px-2 py-[2px] rounded">Good</Text>
          </View>
          <View className="items-center">
            <Text className="text-[#475569] text-xs">Water Level</Text>
            <Text className="text-[11px] bg-white/90 px-2 py-[2px] rounded">Low</Text>
          </View>
        </View>
      </View>

      <View className="rounded-2xl bg-[#3B5D19] p-4 mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-white font-semibold">lettuce growth</Text>
          <Text className="text-white">progress</Text>
          <Text className="text-white mt-1">→</Text>
        </View>
        <View className="w-24 h-24 rounded-full bg-white/30 items-center justify-center">
          <Text className="text-white text-2xl font-extrabold">80%</Text>
        </View>
      </View>

      <Text className="font-extrabold text-[#111827] mb-3">Quick Actions</Text>
      <View className="flex-row flex-wrap justify-between gap-y-3">
        <TouchableOpacity onPress={() => router.push("/plant/status")} className="w-[48%] h-32 rounded-2xl bg-[#EFF8F1] p-4">
          <View className="w-8 h-8 rounded-full bg-[#DDF1E3] items-center justify-center mb-2">
            <Ionicons name="leaf-outline" size={16} color="#1D7A52" />
          </View>
          <Text className="text-[#111827]">Plant</Text>
          <Text className="text-[#111827]">Status</Text>
        </TouchableOpacity>

        <View className="w-[48%] h-32 rounded-2xl bg-[#ECF4FF] p-4">
          <View className="w-8 h-8 rounded-full bg-white items-center justify-center mb-2">
            <Ionicons name="cube-outline" size={16} color="#2563EB" />
          </View>
          <Text className="text-[#2563EB]">Connected</Text>
          <Text className="text-[#2563EB]">Devices</Text>
        </View>

        <View className="w-[48%] h-32 rounded-2xl bg-[#FFF7ED] p-4">
          <View className="w-8 h-8 rounded-full bg-white items-center justify-center mb-2">
            <Ionicons name="analytics-outline" size={16} color="#F59E0B" />
          </View>
          <Text className="text-[#F59E0B]">Report and</Text>
          <Text className="text-[#F59E0B]">Analytics</Text>
        </View>

        <View className="w-[48%] h-32 rounded-2xl bg-white p-4 border border-[#F1F5F9]">
          <Text className="text-[#94A3B8]">Water Monitor</Text>
        </View>
      </View>
    </View>
  );
}


