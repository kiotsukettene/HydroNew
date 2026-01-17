import { View, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { StatCard } from '@/components/reports/StatCard';
import { TrendIndicator } from '@/components/reports/TrendIndicator';
import { RecommendationAlert } from '@/components/reports/RecommendationAlert';
import { LineChart } from 'react-native-gifted-charts';
import { Activity, Target, TrendingUp } from 'lucide-react-native';

export default function TreatmentEfficiency() {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceId] = useState(1); // TODO: Add device selector if multiple devices

  const { treatmentEfficiency, loading, fetchTreatmentEfficiency } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [deviceId])
  );

  const loadData = async () => {
    await fetchTreatmentEfficiency(deviceId, 30);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Prepare chart data
  const cycleCountData = treatmentEfficiency?.cycle_trends
    ? treatmentEfficiency.cycle_trends.map((item, index) => ({
        value: item.cycle_count,
        label: index % 5 === 0 ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      }))
    : [];

  const successRateData = treatmentEfficiency?.cycle_trends
    ? treatmentEfficiency.cycle_trends.map((item, index) => ({
        value: item.success_rate,
        label: index % 5 === 0 ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      }))
    : [];

  return (
    <ScrollView 
      className="flex-1 bg-white/90"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <PageHeader 
          title="Treatment Efficiency"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Summary Stats */}
          <View className="gap-3 mb-4">
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  title="Total Cycles"
                  value={treatmentEfficiency?.total_cycles || 0}
                  colorScheme="primary"
                  bgClassName='bg-[#d6e8b6]'
                />
              </View>
              <View className="flex-1">
                <StatCard
                  title="Avg Cycles/Day"
                  value={(treatmentEfficiency?.avg_cycles_per_day || 0).toFixed(1)}
                  colorScheme="primary"
                  bgClassName='bg-[#d6edf5]'
                />
              </View>
            </View>

          
          </View>

          {/* Efficiency Trend Indicator */}
          {treatmentEfficiency?.efficiency_trend && (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Text className="text-base font-semibold text-gray-900 mb-3">Efficiency Trend</Text>
              <View className="flex-row items-center justify-center">
                <TrendIndicator 
                  trend={treatmentEfficiency.efficiency_trend}
                  showLabel={true}
                />
              </View>
            </Card>
          )}

          {/* Water Quality Improvements */}
          {treatmentEfficiency?.water_quality_improvements && treatmentEfficiency.water_quality_improvements.length > 0 && (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Text className="text-xl font-semibold text-primary mb-3">
                Water Quality Improvements
              </Text>
              {treatmentEfficiency.water_quality_improvements.map((improvement, index) => (
                <View key={index} className="py-3 border-b border-gray-100">
                  <View className="flex-row justify-between items-center mb-1">
                    <Text className="text-sm font-medium text-gray-700 uppercase">{improvement.parameter}</Text>
                    <View className={`px-3 py-1 rounded-full ${improvement.improvement_percentage >= 80 ? 'bg-green-100' : improvement.improvement_percentage >= 60 ? 'bg-blue-100' : 'bg-yellow-100'}`}>
                      <Text className={`text-sm font-bold ${improvement.improvement_percentage >= 80 ? 'text-green-800' : improvement.improvement_percentage >= 60 ? 'text-blue-800' : 'text-yellow-800'}`}>
                        {improvement.improvement_percentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-xs text-muted-foreground">Before</Text>
                      <Text className="text-sm font-semibold">{improvement.avg_before.toFixed(2)}</Text>
                    </View>
                    <View className="items-center">
                      <Text className="text-xs text-muted-foreground">→</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted-foreground">After</Text>
                      <Text className="text-sm font-semibold text-primary">{improvement.avg_after.toFixed(2)}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Daily Cycle Count Chart */}
          <ChartContainer 
            title="Daily Cycle Count" 
            subtitle="Last 30 days"
            loading={loading}
          >
            <View className="px-4 py-4">
              {cycleCountData.length > 0 ? (
                <LineChart
                  data={cycleCountData}
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
                <Text className="text-center text-muted-foreground py-8">No cycle data available</Text>
              )}
            </View>
          </ChartContainer>

          {/* Success Rate Trend Chart */}
          <ChartContainer 
            title="Success Rate Trend" 
            subtitle="Daily success rate over 30 days"
            loading={loading}
          >
            <View className="px-4 py-4">
              {successRateData.length > 0 ? (
                <LineChart
                  areaChart
                  data={successRateData}
                  startFillColor="#10b981"
                  startOpacity={0.3}
                  endFillColor="rgba(16, 185, 129, 0.1)"
                  endOpacity={0.1}
                  height={250}
                  color="#10b981"
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
                  maxValue={100}
                  adjustToWidth={true}
                />
              ) : (
                <Text className="text-center text-muted-foreground py-8">No success rate data available</Text>
              )}
            </View>
          </ChartContainer>

          {/* Maintenance Recommendations */}
          {treatmentEfficiency?.maintenance_recommendations && treatmentEfficiency.maintenance_recommendations.length > 0 && (
            <RecommendationAlert
              recommendations={treatmentEfficiency.maintenance_recommendations}
              type={treatmentEfficiency.efficiency_trend === 'declining' ? 'warning' : 'info'}
              title="Maintenance Recommendations"
            />
          )}

          {!loading && !treatmentEfficiency && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No treatment efficiency data found for the selected period</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

