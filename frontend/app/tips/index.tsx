import React, { useCallback, useEffect } from 'react';
import { ScrollView, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTipStore } from '@/store/tips_suggestion/tipStore';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth/authStore';

export default function TipsSuggestionPage() {
  const user = useAuthStore(state => state.user);
  const { data, loading, error, fetchTips, timeLeft } = useTipStore();

  useFocusEffect(
    useCallback(() => {
      // This will run every time the screen comes into focus
      if (user?.id) {
      fetchTips(user.id);
    }
      // You can also return a cleanup function if needed
      return () => {};
    }, [fetchTips, user?.id]) // Add fetchTips as a dependency
  );

  const colorPairs = [
    { bg: 'bg-blue-100', badge: 'bg-blue-500' },
    { bg: 'bg-green-100', badge: 'bg-green-500' },
    { bg: 'bg-yellow-100', badge: 'bg-yellow-500' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <PageHeader title="Tips and Suggestions" />

      {/* ⏳ Show only loading screen when fetching */}
      {loading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="mt-2 px-6 text-center text-gray-500">
            Generating personalized tips for your hydroponic setup...
          </Text>
        </View>
      )}

      {/* ⚠️ Error State */}
      {!loading && error && (
        <View className="m-4 rounded-2xl bg-red-100 p-4">
          <Text className="text-center font-semibold text-red-700">⚠️ {error}</Text>
          <Text className="text-center text-gray-600">
            Showing example tips while we reconnect.
          </Text>
        </View>
      )}

      {/* ✅ Data Loaded */}
      {!loading && data && (
        <ScrollView>
          <Text className="mt-1 text-center text-sm text-gray-500">
              New tips available in {timeLeft}
          </Text>
          <View className="gap-1 p-4">
            <Text className="text-lg font-semibold text-blue-600">{data.tips.category}</Text>
            <Text className="text-3xl font-bold">{data.tips.title}</Text>
            <Text className="text-gray-700">{data.tips.description}</Text>
          </View>

          <View className="m-4 gap-3">
            {data.tips.bullet_points.map((bp, i) => {
              const color = colorPairs[i % colorPairs.length];
              return (
                <Card key={i} className={`border-transparent ${color.bg} rounded-2xl p-4`}>
                  <Badge
                    className={`items-center justify-center rounded-full px-4 py-2 ${color.badge} self-start`}>
                    <Text className="text-md text-center font-semibold text-white">
                      {bp.heading}
                    </Text>
                  </Badge>

                  <View className="mt-1 gap-2 px-4">
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
