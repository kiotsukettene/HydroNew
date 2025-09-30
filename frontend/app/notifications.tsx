import { useState } from "react";
import { Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Notifications() {
  const router = useRouter();
  const [hasNotifications, setHasNotifications] = useState(true); // Toggle this to see both states

  const notifications = [
    {
      id: 1,
      type: "harvest",
      icon: "leaf",
      title: "Plant ready for harvest!",
      description: "Your plant has reached maturity and is ripe for harvest in 3 days.",
      time: "Sun, 12:40pm",
      isHighlighted: true,
    },
    {
      id: 2,
      type: "filter",
      icon: "warning",
      title: "Filter cleaning!",
      description: "Filter requires cleaning in the next 5 days. Clean immediately to maintain water quality.",
      time: "Sun, 12:40pm",
      isHighlighted: false,
    },
    {
      id: 3,
      type: "water",
      icon: "water",
      title: "Water is potable",
      description: "Your recent waste water has now reached the appropriate potability, safe for hydrophonic.",
      time: "Sun, 12:40pm",
      isHighlighted: false,
    },
    {
      id: 4,
      type: "filter",
      icon: "warning",
      title: "Filter cleaning!",
      description: "Filter requires cleaning in the next 5 days. Clean immediately to maintain water quality.",
      time: "Sun, 12:40pm",
      isHighlighted: false,
    },
    {
      id: 5,
      type: "water",
      icon: "water",
      title: "Water is potable",
      description: "Your recent waste water has now reached the appropriate potability, safe for hydrophonic.",
      time: "Sun, 12:40pm",
      isHighlighted: false,
    },
    {
      id: 6,
      type: "filter",
      icon: "warning",
      title: "Filter cleaning!",
      description: "Filter requires cleaning in the next 5 days. Clean immediately to maintain water quality.",
      time: "Sun, 12:40pm",
      isHighlighted: false,
    },
    {
      id: 7,
      type: "water",
      icon: "water",
      title: "Water is potable",
      description: "Your recent waste water has now reached the appropriate potability, safe for hydrophonic.",
      time: "Sun, 12:40pm",
      isHighlighted: false,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case "harvest":
        return "#4C5D06";
      case "filter":
        return "#EF4444";
      case "water":
        return "#3B82F6";
      default:
        return "#6B7280";
    }
  };

  if (!hasNotifications) {
    // Empty State
    return (
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 pt-12">
          <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center">
            <Ionicons name="chevron-back" size={24} color="#374151" />
          </Pressable>
          <Text className="text-xl font-bold text-[#374151]">Notifications</Text>
          <Pressable className="w-8 h-8 items-center justify-center">
            <Ionicons name="notifications" size={24} color="#374151" />
          </Pressable>
        </View>

        {/* Empty State Content */}
        <View className="flex-1 items-center justify-center px-6">
          <View className="w-24 h-24 rounded-full bg-[#F3F4F6] items-center justify-center mb-6">
            <Ionicons name="notifications-off" size={40} color="#4C5D06" />
          </View>
          
          <Text className="text-2xl font-bold text-[#4C5D06] mb-3 text-center">
            No Notifications Here
          </Text>
          
          <Text className="text-base text-[#9CA3AF] text-center mb-8">
            There is no notification to show right now.
          </Text>

          {/* Separator Line */}
          <View className="w-full h-px bg-[#E5E7EB]" />
        </View>
      </View>
    );
  }

  // Populated State
  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 pt-12">
        <Pressable onPress={() => router.back()} className="w-8 h-8 items-center justify-center">
          <Ionicons name="chevron-back" size={24} color="#374151" />
        </Pressable>
        <Text className="text-xl font-bold text-[#374151]">Notifications</Text>
        <Pressable className="w-8 h-8 items-center justify-center">
          <Ionicons name="notifications" size={24} color="#374151" />
        </Pressable>
      </View>

      {/* Clear All Button */}
      <View className="px-6 mb-4">
        <TouchableOpacity 
          onPress={() => setHasNotifications(false)}
          className="self-end"
        >
          <Text className="text-[#4C5D06] font-medium">Clear all</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <View
            key={notification.id}
            className={`mb-4 p-4 rounded-2xl ${
              notification.isHighlighted ? "bg-[#F0F9FF]" : "bg-[#F9FAFB]"
            }`}
          >
            <View className="flex-row items-start gap-4">
              {/* Icon */}
              <View className="w-10 h-10 rounded-full bg-white items-center justify-center shadow-sm">
                <Ionicons
                  name={notification.icon as any}
                  size={20}
                  color={getIconColor(notification.type)}
                />
              </View>

              {/* Content */}
              <View className="flex-1">
                <Text className="text-base font-semibold text-[#374151] mb-1">
                  {notification.title}
                </Text>
                <Text className="text-sm text-[#6B7280] leading-5 mb-2">
                  {notification.description}
                </Text>
                <Text className="text-xs text-[#9CA3AF]">
                  {notification.time}
                </Text>
              </View>
            </View>
          </View>
        ))}
        
        {/* Bottom padding for tab bar */}
        <View className="h-20" />
      </ScrollView>
    </View>
  );
}
