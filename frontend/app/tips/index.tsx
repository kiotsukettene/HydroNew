import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View, ActivityIndicator, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTipStore } from '@/store/tips_suggestion/tipStore';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth/authStore';
import { useDeviceStore } from '@/store/device/deviceStore';
import { Minus, Plus } from 'lucide-react-native';

export default function TipsSuggestionPage() {
  const user = useAuthStore(state => state.user);
  const devices = useDeviceStore(state => state.devices);
  const { data, loading, error, fetchTips } = useTipStore();

  const [expandedTips, setExpandedTips] = useState<number[]>([]);
  const [warningsExpanded, setWarningsExpanded] = useState(false);

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

  const colorPairs = useMemo(
    () => [{ badge: 'bg-blue-500' }, { badge: 'bg-green-500' }, { badge: 'bg-yellow-500' }],
    []
  );

  const toggleTipExpanded = (index: number) => {
    setExpandedTips(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white/50">
      <PageHeader title="Tips and Suggestions" />

      {/* ⏳ Show only loading screen when fetching */}
      {loading && (
        <View className="flex-1 justify-center px-4">
          <Card className="border border-muted-foreground/10">
            <CardContent className="items-center p-5">
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text className="mt-3 text-center text-sm leading-6 text-muted-foreground">
                Generating personalized tips for your hydroponic setup...
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      {/* ⚠️ Error State */}
      {!loading && error && (
        <View className="px-4 pt-3">
          <Card className="border border-red-200 bg-red-50/70">
            <CardContent className="p-4">
              <Text className="text-center text-sm font-semibold text-red-700">{error}</Text>
              <Text className="mt-1 text-center text-sm leading-6 text-gray-600">
                Showing example tips while we reconnect.
              </Text>
            </CardContent>
          </Card>
        </View>
      )}

      {/* ✅ Data Loaded */}
      {!loading && data && (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header / Summary */}
          <Card className="border border-muted-foreground/10">
            <CardContent className="p-4">
              <Text className="text-sm font-semibold text-blue-600">{data.category}</Text>
              <Text className="mt-1 text-2xl font-bold text-foreground">{data.title}</Text>
              <Text className="mt-2 text-sm leading-6 text-gray-700">{data.description}</Text>
            </CardContent>
          </Card>

          {/* ⚠️ Warnings Section */}
          {data.warnings && data.warnings.length > 0 && (
            <Card className="mt-4 border border-amber-200 bg-amber-50/70">
              <Pressable onPress={() => setWarningsExpanded(v => !v)}>
                <CardContent className="p-4">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-base font-semibold text-amber-900">Warnings</Text>
                    {warningsExpanded ? (
                      <Minus size={18} color="#92400e" />
                    ) : (
                      <Plus size={18} color="#92400e" />
                    )}
                  </View>

                  <Text className="mt-1 text-sm leading-5 text-amber-800/90">
                    {warningsExpanded
                      ? 'Tap to hide'
                      : `Tap to view ${data.warnings.length} warning${data.warnings.length === 1 ? '' : 's'}`}
                  </Text>

                  {warningsExpanded && (
                    <View className="mt-3 border-t border-amber-200 pt-3">
                      {data.warnings.map((warning, i) => (
                        <Text key={i} className="mb-2 text-sm leading-6 text-amber-800">
                          • {warning}
                        </Text>
                      ))}
                    </View>
                  )}
                </CardContent>
              </Pressable>
            </Card>
          )}

          {/* Tips as expandable cards */}
          <View className="mt-4 gap-4">
            {data.bullet_points?.map((bp, i) => {
              const color = colorPairs[i % colorPairs.length];
              const isExpanded = expandedTips.includes(i);
              const tips = bp.tips ?? [];
              const preview = tips.slice(0, 2);
              const remainingCount = Math.max(0, tips.length - preview.length);

              return (
                <Card key={i} className="border border-muted-foreground/15">
                  <Pressable onPress={() => toggleTipExpanded(i)}>
                    <CardContent className="p-4">
                      <View className="flex-row items-center justify-between gap-3">
                        <View className="flex-1">
                          <Badge className={`self-start rounded-full px-3 py-1 ${color.badge}`}>
                            <Text className="text-xs font-semibold text-white">{bp.heading}</Text>
                          </Badge>
                          {!isExpanded && (
                            <View className="mt-3 gap-2">
                              {preview.map((tip, idx) => (
                                <Text key={idx} className="text-sm leading-6 text-gray-700">
                                  • {tip}
                                </Text>
                              ))}
                              {remainingCount > 0 && (
                                <Text className="text-xs text-muted-foreground">
                                  +{remainingCount} more
                                </Text>
                              )}
                            </View>
                          )}
                        </View>

                        {isExpanded ? (
                          <Minus size={20} color="#445104" />
                        ) : (
                          <Plus size={20} color="#445104" />
                        )}
                      </View>

                      <Text className="mt-3 text-xs text-muted-foreground">
                        {isExpanded ? 'Read less' : 'Read more'}
                      </Text>

                      {isExpanded && (
                        <View className="mt-3 border-t border-muted-foreground/15 pt-3">
                          {tips.length === 0 ? (
                            <Text className="text-sm leading-6 text-muted-foreground">
                              No tips available.
                            </Text>
                          ) : (
                            <View className="gap-2">
                              {tips.map((tip, idx) => (
                                <Text key={idx} className="text-sm leading-6 text-gray-700">
                                  • {tip}
                                </Text>
                              ))}
                            </View>
                          )}
                        </View>
                      )}
                    </CardContent>
                  </Pressable>
                </Card>
              );
            })}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
