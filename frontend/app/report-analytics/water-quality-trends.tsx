import { View, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { TrendIndicator } from '@/components/reports/TrendIndicator';
import { RecommendationAlert } from '@/components/reports/RecommendationAlert';
import { LineChart } from 'react-native-gifted-charts';

export default function WaterQualityTrends() {
  const [refreshing, setRefreshing] = useState(false);

  const { waterQualityTrends, loading, fetchWaterQualityTrends } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    await fetchWaterQualityTrends('hydroponics_water', 'ph', 30);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Prepare chart data
  const chartData = waterQualityTrends?.trend_data
    ? waterQualityTrends.trend_data.map((item, index) => ({
        value: item.value,
        label: index % 5 === 0 ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      }))
    : [];

  return (
    <ScrollView 
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <PageHeader 
          title="Water Quality Trends"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Trend Analysis Card */}
          {waterQualityTrends?.analysis && (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Text className="text-xl font-semibold text-primary mb-3">Trend Analysis</Text>
              
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-sm text-muted-foreground">Trend Direction</Text>
                <TrendIndicator 
                  trend={waterQualityTrends.analysis.trend} 
                  value={`${waterQualityTrends.analysis.percentage_change.toFixed(1)}%`}
                />
              </View>

              <View className="flex-row justify-between mb-3">
                <View className="flex-1">
                  <Text className="text-sm text-muted-foreground">Current Value</Text>
                  <Text className="text-2xl font-bold text-primary">
                    {waterQualityTrends.analysis.current_value.toFixed(2)}
                  </Text>
                </View>
                <View className="flex-1 items-end">
                  <Text className="text-sm text-muted-foreground">Historical Avg</Text>
                  <Text className="text-2xl font-bold text-gray-700">
                    {waterQualityTrends.analysis.historical_avg.toFixed(2)}
                  </Text>
                </View>
              </View>

              {waterQualityTrends.analysis.deviation_count > 0 && (
                <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <Text className="text-sm text-yellow-800">
                    {waterQualityTrends.analysis.deviation_count} significant deviation{waterQualityTrends.analysis.deviation_count > 1 ? 's' : ''} detected
                  </Text>
                </View>
              )}
            </Card>
          )}

          {/* Target Range Card */}
          {waterQualityTrends?.target_range && (
            <Card className="border-primary/30 p-4 mb-4 bg-primary/5">
              <Text className="text-base font-semibold text-gray-900 mb-2">Target Range</Text>
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-xs text-muted-foreground">Minimum</Text>
                  <Text className="text-xl font-bold text-primary">
                    {waterQualityTrends.target_range.min.toFixed(2)}
                  </Text>
                </View>
                <Text className="text-2xl text-muted-foreground">—</Text>
                <View>
                  <Text className="text-xs text-muted-foreground">Maximum</Text>
                  <Text className="text-xl font-bold text-primary">
                    {waterQualityTrends.target_range.max.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* Trend Chart */}
          <ChartContainer 
            title="pH Trend"
            subtitle="Last 30 days"
            loading={loading}
          >
            <View className="px-4 py-4">
              {chartData.length > 0 ? (
                <LineChart
                  areaChart
                  data={chartData}
                  startFillColor="hsl(173 58% 39%)"
                  startOpacity={0.3}
                  endFillColor="hsl(173 58% 39% / 0.1)"
                  endOpacity={0.1}
                  height={250}
                  color="hsl(173 58% 39%)"
                  thickness={3}
                  curved
                  spacing={40}
                  initialSpacing={20}
                  endSpacing={25}
                  hideDataPoints={false}
                  xAxisLabelTextStyle={{color: 'hsl(0 0% 45.1%)', fontSize: 11}}
                  yAxisTextStyle={{color: 'hsl(0 0% 45.1%)', fontSize: 12}}
                  rulesColor="hsl(0 0% 89.8%)"
                  rulesType="solid"
                  showVerticalLines
                  verticalLinesColor="hsl(0 0% 89.8%)"
                  yAxisLabelWidth={50}
                  xAxisColor="hsl(0 0% 89.8%)"
                  yAxisColor="hsl(0 0% 89.8%)"
                  adjustToWidth={true}
                />
              ) : (
                <Text className="text-center text-muted-foreground py-8">No trend data available</Text>
              )}
            </View>
          </ChartContainer>

          {/* Recommendations */}
          {waterQualityTrends?.recommendations && waterQualityTrends.recommendations.length > 0 && (
            <RecommendationAlert
              recommendations={waterQualityTrends.recommendations}
              type={waterQualityTrends.analysis?.trend === 'declining' ? 'warning' : 'info'}
              title="Recommendations"
            />
          )}

          {!loading && (!waterQualityTrends || !waterQualityTrends.trend_data || waterQualityTrends.trend_data.length === 0) && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No trend data found for the selected parameters</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

