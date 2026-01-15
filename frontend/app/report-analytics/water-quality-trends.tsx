import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
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
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react-native';
import type { SystemType } from '@/types/reports';

const SYSTEM_TYPES: Array<{ value: SystemType; label: string }> = [
  { value: 'dirty_water', label: 'Dirty Water' },
  { value: 'clean_water', label: 'Clean Water' },
  { value: 'hydroponics_water', label: 'Hydroponics' },
];

const PARAMETER_COLORS: { [key: string]: string } = {
  ph: 'hsl(173 58% 39%)',
  turbidity: '#f59e0b',
  tds: '#3b82f6',
  ec: '#8b5cf6',
  humidity: '#ec4899',
  temperature: '#ef4444',
};

export default function WaterQualityTrends() {
  const [refreshing, setRefreshing] = useState(false);
  const [systemType, setSystemType] = useState<SystemType>('dirty_water');
  const [days, setDays] = useState(7);

  const { waterQualityTrends, loading, fetchWaterQualityTrends } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [systemType, days])
  );

  const loadData = async () => {
    await fetchWaterQualityTrends(systemType, '', days);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Prepare chart data for each parameter
  const prepareChartData = (parameterKey: string) => {
    if (!waterQualityTrends?.datasets || !waterQualityTrends.datasets[parameterKey]) return [];
    
    const dataset = waterQualityTrends.datasets[parameterKey];
    return dataset.data.map((value, index) => ({
      value,
      label: index % Math.ceil(dataset.data.length / 5) === 0 
        ? new Date(waterQualityTrends.labels[index]).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
        : '',
    }));
  };

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
          {/* System Type Filter */}
          <Card className="border-muted-foreground/30 p-3 mb-4">
            <Text className="text-sm font-semibold text-gray-700 mb-0">System Type</Text>
            <View className="flex-row gap-2">
              {SYSTEM_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => setSystemType(type.value)}
                  className={`flex-1 py-2.5 px-3 rounded-lg border ${
                    systemType === type.value
                      ? 'bg-primary border-primary'
                      : 'bg-white border-muted-foreground/30'
                  }`}
                >
                  <Text
                    className={`text-center text-xs font-medium ${
                      systemType === type.value ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>

          {/* Statistics Summary Card */}
          {loading ? (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Skeleton className="w-48 h-6 mb-3" />
              <View className="gap-3">
                {[1, 2, 3].map((item) => (
                  <View key={item} className="border-b border-muted-foreground/20 pb-3">
                    <Skeleton className="w-20 h-4 mb-2" />
                    <View className="flex-row gap-3 items-end">
                      <View className="flex-1">
                        <Skeleton className="w-16 h-3 mb-1" />
                        <Skeleton className="w-24 h-5" />
                      </View>
                      <View className="flex-1">
                        <Skeleton className="w-16 h-3 mb-1" />
                        <Skeleton className="w-20 h-4" />
                      </View>
                      <View className="flex-1">
                        <Skeleton className="w-16 h-3 mb-1" />
                        <View className="flex-row items-center gap-1.5">
                          <Skeleton className="w-6 h-6 rounded-full" />
                          <Skeleton className="w-12 h-3" />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ) : waterQualityTrends?.statistics ? (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-xl font-semibold text-primary">Statistical Summary</Text>
              </View>
              

              <View className="gap-3">
                {Object.entries(waterQualityTrends.statistics).map(([param, stats]) => {
                  const dataset = waterQualityTrends.datasets[param];
                  if (!stats || !dataset) return null;
                  
                  // Determine trend styling
                  const trend = waterQualityTrends.trends[param];
                  let TrendIcon = ArrowRight;
                  let trendColor = '#9CA3AF';
                  let trendLabel = 'Stable';
                  
                  if (trend === 'improving') {
                    TrendIcon = TrendingUp;
                    trendColor = '#10B981';
                    trendLabel = 'Improving';
                  } else if (trend === 'declining') {
                    TrendIcon = TrendingDown;
                    trendColor = '#EF4444';
                    trendLabel = 'Declining';
                  }
                  
                  return (
                    <View key={param} className="border-b border-muted-foreground/20 pb-3 last:border-b-0">
                      <View className="mb-2">
                        <Text className="text-sm font-semibold text-gray-800 uppercase">
                          {dataset.label}
                        </Text>
                      </View>
                      <View className="flex-row gap-3 items-end">
                        <View className="flex-1">
                          <Text className="text-xs text-muted-foreground mb-1">Average</Text>
                          <Text className="text-lg font-semibold text-gray-700">
                            {stats.average.toFixed(2)} {dataset.unit}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className="text-xs text-muted-foreground mb-1">Range</Text>
                          <Text className="text-sm font-medium text-gray-600">
                            {stats.min.toFixed(1)} - {stats.max.toFixed(1)}
                          </Text>
                        </View>
                        {trend && (
                          <View className="flex-1 items-start">
                            <Text className="text-xs text-muted-foreground mb-1">Trend</Text>
                            <View className="flex-row items-center gap-1.5">
                              <View 
                                className="rounded-full w-6 h-6 items-center justify-center"
                                style={{ backgroundColor: trendColor }}
                              >
                                <TrendIcon size={12} color="white" />
                              </View>
                              <Text className="text-[11px] font-medium" style={{ color: trendColor }}>
                                {trendLabel}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                      {dataset.target_min !== null && dataset.target_max !== null && (
                        <View className="mt-2 bg-teal-50 rounded-lg p-2">
                          <Text className="text-xs text-gray-600">
                            Target Range: {dataset.target_min} - {dataset.target_max} {dataset.unit}
                          </Text>
                        </View>
                      )}
                      {dataset.deviation_count > 0 && (
                        <View className="mt-2 bg-yellow-50 rounded-lg p-2">
                          <Text className="text-xs text-yellow-800">
                            {dataset.deviation_count} out of range{dataset.deviation_count > 1} readings
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </Card>
          ) : null}

          {/* Trend Charts for Each Parameter */}
          {loading ? (
            <>
              {[1, 2, 3].map((item) => (
                <View key={item} className="mb-4">
                  <Card className="border-muted-foreground/30 p-4">
                    <View className="mb-3">
                      <Skeleton className="w-32 h-5 mb-1" />
                      <Skeleton className="w-48 h-3" />
                    </View>
                    <Skeleton className="w-full h-64 rounded-lg" />
                  </Card>
                </View>
              ))}
            </>
          ) : waterQualityTrends?.datasets ? (
            Object.entries(waterQualityTrends.datasets).map(([paramKey, dataset]) => {
              const chartData = prepareChartData(paramKey);
              const color = PARAMETER_COLORS[paramKey] || 'hsl(173 58% 39%)';
              const trend = waterQualityTrends.trends[paramKey];
              const trendText = trend ? trend.charAt(0).toUpperCase() + trend.slice(1) : 'No Data';
              
              return (
                <View key={paramKey} className="mb-4">
                  <ChartContainer 
                    title={dataset.label}
                    subtitle={`Last ${days} days`}
                    loading={loading}
                  >
                  <View className="px-4 py-4">
                    {chartData.length > 0 ? (
                      <LineChart
                        areaChart
                        data={chartData}
                        startFillColor={color}
                        startOpacity={0.3}
                        endFillColor={`${color}33`}
                        endOpacity={0.1}
                        height={250}
                        color={color}
                        thickness={3}
                        curved
                        spacing={Math.max(40, 300 / chartData.length)}
                        initialSpacing={20}
                        endSpacing={25}
                        hideDataPoints={false}
                        dataPointsColor={color}
                        dataPointsRadius={3}
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
                      <Text className="text-center text-muted-foreground py-8">No data available</Text>
                    )}
                  </View>
                </ChartContainer>
                </View>
              );
            })
          ) : null}

          {/* Recommendations */}
          {waterQualityTrends?.recommendations && waterQualityTrends.recommendations.length > 0 && (
            <RecommendationAlert
              recommendations={waterQualityTrends.recommendations}
              type="info"
              title="Recommendations"
            />
          )}

          {!loading && (!waterQualityTrends || !waterQualityTrends.datasets || Object.keys(waterQualityTrends.datasets).length === 0) && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No trend data found for the selected system type</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

