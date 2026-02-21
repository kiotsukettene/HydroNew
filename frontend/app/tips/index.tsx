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
import { useDeviceStore } from '@/store/device/deviceStore';

export default function TipsSuggestionPage() {
  const user = useAuthStore(state => state.user);
  const devices = useDeviceStore(state => state.devices);
  const { data, loading, error, fetchTips } = useTipStore();

  useFocusEffect(
    useCallback(() => {
      if (user?.id && devices.length > 0) {
        fetchTips({
          userId: user.id,
          deviceId: devices[0].id,
          systemType: 'clean_water'
        });
      }
      return () => {};
    }, [fetchTips, user?.id, devices])
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
          <View className="gap-1 p-4">
            <Text className="text-lg font-semibold text-blue-600">{data.category}</Text>
            <Text className="text-3xl font-bold">{data.title}</Text>
            <Text className="text-gray-700">{data.description}</Text>
          </View>

          {/* ⚠️ Warnings Section */}
          {data.warnings && data.warnings.length > 0 && (
            <View className="mx-4 mb-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
              <Text className="mb-2 font-semibold text-amber-900">⚠️ Warnings</Text>
              {data.warnings.map((warning, i) => (
                <Text key={i} className="mb-1 text-amber-800">
                  • {warning}
                </Text>
              ))}
            </View>
          )}

          <View className="m-4 gap-3">
            {data.bullet_points && data.bullet_points.map((bp, i) => {
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
                    {bp.tips && bp.tips.slice(0, 3).map((tip, idx) => (
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
