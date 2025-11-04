import React, { useEffect } from "react";
import { ScrollView, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/ui/text";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTipStore } from "@/store/tips_suggestion/tipStore";

export default function TipsSuggestionPage() {
  const { data, loading, error, fetchTips } = useTipStore();

  useEffect(() => {
    fetchTips();
  }, []);

  const colorPairs = [
    { bg: "bg-blue-100", badge: "bg-blue-500" },
    { bg: "bg-green-100", badge: "bg-green-500" },
    { bg: "bg-yellow-100", badge: "bg-yellow-500" },
  ];

  return (
    <SafeAreaView className="bg-white flex-1">
      <PageHeader title="Tips and Suggestions" />

      {/* ⏳ Show only loading screen when fetching */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 text-gray-500 text-center px-6">
            Generating personalized tips for your hydroponic setup...
          </Text>
        </View>
      )}

      {/* ⚠️ Error State */}
      {!loading && error && (
        <View className="m-4 bg-red-100 p-4 rounded-2xl">
          <Text className="text-red-700 font-semibold text-center">
            ⚠️ {error}
          </Text>
          <Text className="text-gray-600 text-center">
            Showing example tips while we reconnect.
          </Text>
        </View>
      )}

      {/* ✅ Data Loaded */}
      {!loading && data && (
        <ScrollView>
          <View className="p-4 gap-1">
            <Text className="font-semibold text-blue-600 text-lg">
              {data.tips.category}
            </Text>
            <Text className="text-3xl font-bold">{data.tips.title}</Text>
            <Text className="text-gray-700">{data.tips.description}</Text>
          </View>

          <View className="m-4 gap-3">
            {data.tips.bullet_points.map((bp, i) => {
              const color = colorPairs[i % colorPairs.length];
              return (
                <Card
                  key={i}
                  className={`border-transparent ${color.bg} p-4 rounded-2xl`}
                >
                  <Badge
                    className={`w-36 items-center justify-center rounded-full ${color.badge} p-2 self-start`}
                  >
                    <Text className="text-md text-white font-semibold">
                      {bp.heading}
                    </Text>
                  </Badge>

                  <View className="gap-2 px-4 mt-3">
                    {bp.tips.slice(0, 3).map((tip, idx) => (
                      <Text key={idx} className="text-gray-700">
                        • {tip}
                      </Text>
                    ))}
                  </View>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
