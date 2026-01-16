import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { BarChart } from 'react-native-gifted-charts';
import { Trophy } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function CropComparison() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'duration' | 'quality'>('weight');

  const { cropComparison, loading, fetchCropComparison } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedMetric])
  );

  const loadData = async () => {
    await fetchCropComparison(['lettuce', 'tomato'], selectedMetric);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const metricOptions: Array<{ value: 'weight' | 'duration' | 'quality'; label: string }> = [
    { value: 'weight', label: 'Total Weight' },
    { value: 'duration', label: 'Growth Duration' },
    { value: 'quality', label: 'Quality Score' },
  ];

  // Prepare comparison chart data
  const getComparisonData = () => {
    if (!cropComparison?.crops || !Array.isArray(cropComparison.crops)) return [];

    return cropComparison.crops.filter(crop => crop && crop.crop_name).map((crop) => {
      let value = 0;
      switch (selectedMetric) {
        case 'weight':
          value = crop.total_weight || 0;
          break;
        case 'duration':
          value = crop.avg_duration || 0;
          break;
        case 'quality':
          value = crop.avg_quality_score || 0;
          break;
      }

      return {
        value,
        label: crop.crop_name.charAt(0).toUpperCase() + crop.crop_name.slice(1, 3),
        frontColor: crop.crop_name === cropComparison.best_performer?.crop_name 
          ? '#f59e0b' 
          : 'hsl(173 58% 39%)',
      };
    });
  };

  const comparisonData = getComparisonData();

  return (
    <ScrollView 
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <PageHeader 
          title="Crop Comparison"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Metric Selection */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Compare By</Text>
            <View className="flex-row bg-gray-100 rounded-xl p-1">
              {metricOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  activeOpacity={0.7}
                  className={`flex-1 py-2.5 rounded-lg ${selectedMetric === option.value ? 'bg-primary' : 'bg-transparent'}`}
                  onPress={() => setSelectedMetric(option.value)}
                >
                  <Text className={`text-center text-xs font-semibold ${selectedMetric === option.value ? 'text-white' : 'text-muted-foreground'}`}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Best Performer Badge */}
          {cropComparison?.best_performer && (
            <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 mb-4">
              <View className="flex-row items-center gap-3">
                <View className="bg-yellow-500 rounded-full p-3">
                  <Icon as={Trophy} size={24} className="text-white" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm text-yellow-700 font-medium">Best Performer</Text>
                  <Text className="text-xl font-bold text-yellow-900 capitalize">
                    {cropComparison.best_performer.crop_name}
                  </Text>
                  <Text className="text-sm text-yellow-700">
                    {selectedMetric === 'weight' && `${cropComparison.best_performer.value.toFixed(1)} kg`}
                    {selectedMetric === 'duration' && `${cropComparison.best_performer.value.toFixed(0)} days`}
                    {selectedMetric === 'quality' && `${cropComparison.best_performer.value.toFixed(1)} score`}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Comparison Chart */}
          <ChartContainer 
            title={`${metricOptions.find(m => m.value === selectedMetric)?.label} Comparison`}
            subtitle="Side-by-side crop performance"
            loading={loading}
          >
            <View className="px-4 py-4">
              {comparisonData.length > 0 ? (
                <BarChart
                  data={comparisonData}
                  height={250}
                  barWidth={60}
                  spacing={40}
                  initialSpacing={30}
                  endSpacing={30}
                  noOfSections={5}
                  yAxisThickness={1}
                  xAxisThickness={1}
                  xAxisColor="hsl(0 0% 89.8%)"
                  yAxisColor="hsl(0 0% 89.8%)"
                  yAxisTextStyle={{ color: 'hsl(0 0% 45.1%)', fontSize: 12 }}
                  xAxisLabelTextStyle={{ color: 'hsl(0 0% 45.1%)', fontSize: 12 }}
                  rulesColor="hsl(0 0% 89.8%)"
                  rulesType="solid"
                  showVerticalLines
                  verticalLinesColor="hsl(0 0% 89.8%)"
                  adjustToWidth={true}
                />
              ) : (
                <Text className="text-center text-muted-foreground py-8">No data available</Text>
              )}
            </View>
          </ChartContainer>

          {/* Detailed Comparison Cards */}
          {cropComparison?.crops && cropComparison.crops.length > 0 && (
            <View className="mt-4">
              <Text className="text-xl font-semibold text-primary mb-3">Detailed Metrics</Text>
              {cropComparison.crops.map((crop) => (
                <Card key={crop.crop_name} className="border-muted-foreground/30 p-4 mb-3">
                  <View className="flex-row justify-between items-center mb-3">
                    <Text className="text-lg font-bold text-gray-900 capitalize">{crop.crop_name}</Text>
                    {crop.crop_name === cropComparison.best_performer?.crop_name && (
                      <View className="bg-yellow-100 rounded-full px-3 py-1">
                        <Text className="text-xs font-semibold text-yellow-800">Best</Text>
                      </View>
                    )}
                  </View>
                  
                  <View className="gap-2">
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Total Weight</Text>
                      <Text className="text-sm font-semibold">{crop.total_weight.toFixed(1)} kg</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Avg Duration</Text>
                      <Text className="text-sm font-semibold">{crop.avg_duration.toFixed(0)} days</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Quality Score</Text>
                      <Text className="text-sm font-semibold">{crop.avg_quality_score.toFixed(1)}</Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-sm text-muted-foreground">Harvest Count</Text>
                      <Text className="text-sm font-semibold">{crop.harvest_count}</Text>
                    </View>
                  </View>

                  {/* Grade Percentages */}
                  <View className="mt-3 pt-3 border-t border-gray-100">
                    <Text className="text-xs font-semibold text-gray-700 mb-2">Grade Distribution</Text>
                    <View className="flex-row justify-between">
                      <View className="flex-1">
                        <Text className="text-xs text-green-600 font-semibold">
                          {crop.selling_percentage.toFixed(0)}%
                        </Text>
                        <Text className="text-xs text-muted-foreground">Selling</Text>
                      </View>
                      <View className="flex-1 items-center">
                        <Text className="text-xs text-blue-600 font-semibold">
                          {crop.consumption_percentage.toFixed(0)}%
                        </Text>
                        <Text className="text-xs text-muted-foreground">Consumption</Text>
                      </View>
                      <View className="flex-1 items-end">
                        <Text className="text-xs text-red-600 font-semibold">
                          {crop.disposal_percentage.toFixed(0)}%
                        </Text>
                        <Text className="text-xs text-muted-foreground">Disposal</Text>
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          )}

          {!loading && (!cropComparison || !cropComparison.crops || cropComparison.crops.length === 0) && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No comparison data available</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

