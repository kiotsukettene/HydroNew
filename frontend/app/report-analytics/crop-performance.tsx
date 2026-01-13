import { View, ScrollView, RefreshControl, FlatList } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { HealthStatusBadge } from '@/components/reports/HealthStatusBadge';
import { GrowthStageBadge } from '@/components/reports/GrowthStageBadge';
import { PieChart } from 'react-native-gifted-charts';

export default function CropPerformance() {
  const [refreshing, setRefreshing] = useState(false);

  const { cropPerformance, loading, fetchCropPerformance } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    await fetchCropPerformance({});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Prepare chart data
  const growthStageData = cropPerformance?.growth_stage_distribution 
    ? Object.entries(cropPerformance.growth_stage_distribution).map(([key, value], index) => {
        const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
        return {
          value,
          color: colors[index % colors.length],
          text: key.replace('-', ' '),
        };
      })
    : [];

  const healthStatusData = cropPerformance?.health_status_distribution
    ? Object.entries(cropPerformance.health_status_distribution).map(([key, value]) => {
        const colorMap: Record<string, string> = {
          good: '#2d7a5f',
          moderate: '#f59e0b',
          poor: '#ef4444',
        };
        return {
          value,
          color: colorMap[key] || '#6b7280',
          text: key,
        };
      })
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
          title="Crop Performance"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Growth Stage Distribution */}
          <View className="mb-4">
            <ChartContainer 
              title="Growth Stage Distribution" 
              subtitle="Active setups by growth stage"
              loading={loading}
            >
            <View className="items-center py-4">
              {growthStageData.length > 0 ? (
                <PieChart
                  data={growthStageData}
                  radius={100}
                  innerRadius={60}
                  centerLabelComponent={() => (
                    <View className="items-center">
                      <Text className="text-2xl font-bold">{cropPerformance?.setups.length}</Text>
                      <Text className="text-xs text-muted-foreground">Total</Text>
                    </View>
                  )}
                />
              ) : (
                <Text className="text-muted-foreground">No data available</Text>
              )}
              
              {/* Legend */}
              <View className="flex-row flex-wrap justify-center mt-4 gap-3">
                {growthStageData.map((item, index) => (
                  <View key={index} className="flex-row items-center gap-1">
                    <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 2 }} />
                    <Text className="text-xs text-gray-600 capitalize">{item.text}: {item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            </ChartContainer>
          </View>

          {/* Health Status Distribution */}
          <View className="mb-4">
            <ChartContainer 
              title="Health Status Distribution" 
              subtitle="Overall health of active setups"
              loading={loading}
            >
            <View className="items-center py-4">
              {healthStatusData.length > 0 ? (
                <PieChart
                  data={healthStatusData}
                  radius={100}
                  donut
                  innerRadius={60}
                  centerLabelComponent={() => {
                    const total = healthStatusData.reduce((sum, item) => sum + item.value, 0);
                    return (
                      <View className="items-center">
                        <Text className="text-2xl font-bold">{total}</Text>
                        <Text className="text-xs text-muted-foreground">Setups</Text>
                      </View>
                    );
                  }}
                />
              ) : (
                <Text className="text-muted-foreground">No data available</Text>
              )}
              
              {/* Legend */}
              <View className="flex-row flex-wrap justify-center mt-4 gap-3">
                {healthStatusData.map((item, index) => (
                  <View key={index} className="flex-row items-center gap-1">
                    <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 2 }} />
                    <Text className="text-xs text-gray-600 capitalize">{item.text}: {item.value}</Text>
                  </View>
                ))}
              </View>
            </View>
            </ChartContainer>
          </View>

          {/* Parameter Compliance */}
          {cropPerformance?.parameter_compliance && (
            <Card className="border-muted-foreground/30 p-4 mt-4">
              <Text className="text-xl font-semibold text-primary mb-3">
                Parameter Compliance
              </Text>
              <View className="gap-3">
                {Object.entries(cropPerformance.parameter_compliance).map(([param, data]) => (
                  <View key={param} className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-700 uppercase">{param}</Text>
                      <Text className="text-xs text-muted-foreground">
                        {data.compliant} of {data.total} setups
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className={`text-2xl font-bold ${data.percentage >= 80 ? 'text-green-600' : data.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {data.percentage.toFixed(0)}%
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          )}

          {/* Active Setups List */}
          {cropPerformance?.setups && cropPerformance.setups.length > 0 && (
            <Card className="border-muted-foreground/30 p-4 mt-4">
              <Text className="text-xl font-semibold text-primary mb-3">
                Active Setups ({cropPerformance.setups.length})
              </Text>
              <FlatList
                data={cropPerformance.setups}
                scrollEnabled={false}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="py-3 border-b border-gray-100">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-base font-semibold text-gray-900 capitalize flex-1">
                        {item.crop_name}
                      </Text>
                      <HealthStatusBadge status={item.health_status} size="sm" />
                    </View>
                    <View className="flex-row items-center gap-2 mb-2">
                      <GrowthStageBadge stage={item.growth_stage} size="sm" />
                    </View>
                    <View className="flex-row justify-between mt-2">
                      <View>
                        <Text className="text-xs text-muted-foreground">
                          pH: {item.current_parameters.ph !== null ? item.current_parameters.ph : 'N/A'}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Target: {item.target_parameters.ph_min} - {item.target_parameters.ph_max}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs text-muted-foreground">
                          TDS: {item.current_parameters.tds !== null ? item.current_parameters.tds : 'N/A'}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Target: {item.target_parameters.tds_min} - {item.target_parameters.tds_max}
                        </Text>
                      </View>
                      <View>
                        <Text className="text-xs text-muted-foreground">
                          EC: {item.current_parameters.ec !== null ? item.current_parameters.ec : 'N/A'}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </Card>
          )}

          {!loading && (!cropPerformance || cropPerformance.setups.length === 0) && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No active setups found for the selected date range</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

