import { View, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { PerformanceGauge } from '@/components/reports/PerformanceGauge';
import { StatCard } from '@/components/reports/StatCard';
import { PieChart } from 'react-native-gifted-charts';
import { Clock, CheckCircle, Droplet, TrendingDown } from 'lucide-react-native';

export default function TreatmentPerformance() {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceId] = useState(1); // TODO: Add device selector if multiple devices

  const { treatmentPerformance, loading, fetchTreatmentPerformance } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [deviceId])
  );

  const loadData = async () => {
    await fetchTreatmentPerformance(deviceId, {});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Prepare success/failure chart data
  const successFailureData = treatmentPerformance
    ? [
        {
          value: treatmentPerformance.success_count,
          color: '#9ab068',
          text: 'Success',
        },
        {
          value: treatmentPerformance.failure_count,
          color: '#ef4444',
          text: 'Failure',
        },
      ]
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
          title="Treatment Performance"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Summary Stats */}
          <View className="gap-3 mb-4">

            <StatCard
              title="Average Cycle Duration"
              value={`${(treatmentPerformance?.avg_cycle_duration || 0).toFixed(1)} min`}
              subtitle="Time to complete treatment"
              colorScheme="primary"
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  title="Total Cycles"
                  value={treatmentPerformance?.total_cycles || 0}
                  colorScheme="primary"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  title="Success Rate"
                  value={`${(treatmentPerformance?.success_rate || 0).toFixed(0)}%`}
                  colorScheme="success"
                />
              </View>
            </View>

            
          </View>

          {/* Performance Score Gauge */}
          {treatmentPerformance && (
            <Card className="border-muted-foreground/30 p-6 mb-4 items-center">
              <PerformanceGauge 
                score={treatmentPerformance.performance_score}
                label="Overall Performance Score"
              />
            </Card>
          )}

          {/* Success/Failure Distribution */}
          <ChartContainer 
            title="Success vs Failure Rate" 
            subtitle="Treatment cycle outcomes"
            loading={loading}
          >
            <View className="items-center py-4">
              {successFailureData.length > 0 ? (
                <>
                  <PieChart
                    data={successFailureData}
                    radius={100}
                    donut
                    innerRadius={60}
                    centerLabelComponent={() => (
                      <View className="items-center">
                        <Text className="text-2xl font-bold">{treatmentPerformance?.total_cycles}</Text>
                        <Text className="text-xs text-muted-foreground">Cycles</Text>
                      </View>
                    )}
                  />
                  
                  {/* Legend */}
                  <View className="flex-row flex-wrap justify-center mt-4 gap-4">
                    {successFailureData.map((item, index) => (
                      <View key={index} className="flex-row items-center gap-2">
                        <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 2 }} />
                        <View>
                          <Text className="text-xs text-gray-600">{item.text}: {item.value}</Text>
                          <Text className="text-xs text-muted-foreground">
                            {index === 0 
                              ? `${treatmentPerformance?.success_rate.toFixed(0)}%`
                              : `${treatmentPerformance?.failure_rate.toFixed(0)}%`
                            }
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text className="text-muted-foreground">No data available</Text>
              )}
            </View>
          </ChartContainer>

          {/* Water Quality Improvements */}
          <Card className="border-muted-foreground/30 mt-4 p-4 mb-2">
            <Text className="text-xl font-semibold text-primary mb-3">
              Water Quality Improvements
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Card className="p-4 bg-blue-50 border ">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TrendingDown size={16} className="text-blue-600" />
                    <Text className="text-xs text-blue-700">Turbidity Reduction</Text>
                  </View>
                  <Text className="text-2xl font-bold text-blue-800">
                    {(treatmentPerformance?.avg_turbidity_improvement || 0).toFixed(1)}%
                  </Text>
                </Card>
              </View>
              <View className="flex-1">
                <Card className="p-4 bg-green-50 border ">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TrendingDown size={16} className="text-green-600" />
                    <Text className="text-xs text-green-700">TDS Reduction</Text>
                  </View>
                  <Text className="text-2xl font-bold text-green-800">
                    {(treatmentPerformance?.avg_tds_improvement || 0).toFixed(1)}%
                  </Text>
                </Card>
              </View>
            </View>
          </Card>

          {/* Stage Efficiency Table */}
          {treatmentPerformance?.stage_efficiency && treatmentPerformance.stage_efficiency.length > 0 && (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Text className="text-xl font-semibold text-primary mb-3">
                Stage-by-Stage Efficiency
              </Text>
              {treatmentPerformance.stage_efficiency.map((stage, index) => (
                <View key={index} className="py-3 border-b border-gray-100">
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-base font-semibold text-gray-900">{stage.stage_name}</Text>
                    <View className={`px-3 py-1 rounded-full ${stage.success_rate >= 80 ? 'bg-green-100' : stage.success_rate >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                      <Text className={`text-sm font-bold ${stage.success_rate >= 80 ? 'text-green-800' : stage.success_rate >= 60 ? 'text-yellow-800' : 'text-red-800'}`}>
                        {stage.success_rate.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between">
                    <View>
                      <Text className="text-xs text-muted-foreground">Duration</Text>
                      <Text className="text-sm font-semibold">{stage.avg_duration.toFixed(1)} min</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted-foreground">Turbidity ↓</Text>
                      <Text className="text-sm font-semibold">{stage.avg_turbidity_reduction.toFixed(1)}%</Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted-foreground">TDS ↓</Text>
                      <Text className="text-sm font-semibold">{stage.avg_tds_reduction.toFixed(1)}%</Text>
                    </View>
                  </View>
                </View>
              ))}
            </Card>
          )}

          {/* Failure Analysis */}
          {treatmentPerformance?.failure_analysis && treatmentPerformance.failure_analysis.failure_count > 0 && (
            <Card className="border-red-300 p-4 bg-red-50">
              <Text className="text-xl font-semibold text-red-900 mb-3">
                Failure Analysis
              </Text>
              <View className="mb-3">
                <Text className="text-sm text-red-700">Most Common Failure Stage</Text>
                <Text className="text-lg font-bold text-red-900">{treatmentPerformance.failure_analysis.most_common_stage}</Text>
                <Text className="text-xs text-red-600">{treatmentPerformance.failure_analysis.failure_count} failures</Text>
              </View>
              {treatmentPerformance.failure_analysis.failure_reasons && treatmentPerformance.failure_analysis.failure_reasons.length > 0 && (
                <View>
                  <Text className="text-sm text-red-700 mb-2">Common Reasons</Text>
                  {treatmentPerformance.failure_analysis.failure_reasons.map((reason, index) => (
                    <View key={index} className="flex-row justify-between py-1">
                      <Text className="text-sm text-red-800 flex-1">{reason.reason}</Text>
                      <Text className="text-sm font-semibold text-red-900">{reason.count}</Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          )}

          {!loading && !treatmentPerformance && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No treatment performance data found for the selected period</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

