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
import { Clock, CheckCircle, Droplet, TrendingDown, TrendingUp } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth/authStore';
import { useDeviceStore } from '@/store/device/deviceStore';
import NoDevice from '@/components/ui/no-device';

export default function TreatmentPerformance() {
  const [refreshing, setRefreshing] = useState(false);
  const [deviceChecked, setDeviceChecked] = useState(false);
  
  const userId = useAuthStore((state) => state.user?.id);
  const { devices, fetchDevice } = useDeviceStore();
  const { treatmentPerformance, loading, fetchTreatmentPerformance } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      setDeviceChecked(false);
      
      if (userId) {
        fetchDevice(userId).then(() => {
          setDeviceChecked(true);
          const currentDevices = useDeviceStore.getState().devices;
          if (currentDevices && currentDevices.length > 0) {
            loadData();
          }
        });
      } else {
        setDeviceChecked(true);
      }
    }, [userId])
  );

  const loadData = async () => {
    const deviceId = devices[0]?.id;
    if (deviceId) {
      await fetchTreatmentPerformance(deviceId, {});
    }
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
          value: Math.round(treatmentPerformance.total_cycles * treatmentPerformance.success_rate / 100),
          color: '#9ab068',
          text: 'Success',
        },
        {
          value: Math.round(treatmentPerformance.total_cycles * treatmentPerformance.failure_rate / 100),
          color: '#ef4444',
          text: 'Failure',
        },
      ]
    : [];

  // Show skeleton during device check
  if (!deviceChecked) {
    return (
      <ScrollView className="flex-1 bg-white/90">
        <SafeAreaView>
          <PageHeader 
            title="Treatment Performance"
            showBackButton={true}
            showNotificationButton={false}
          />
          <View className="p-4">
            <Text className="text-center text-muted-foreground">Loading...</Text>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }

  // Show NoDevice if no device paired after check
  if (deviceChecked && (!devices || devices.length === 0)) {
    return <NoDevice />;
  }

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
              value={`${(treatmentPerformance?.average_duration_minutes || 0).toFixed(1)} min`}
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
          <Card className="border-muted-foreground/30 mt-4 p-4">
            <Text className="text-xl font-semibold text-primary mb-3">
              Water Quality Improvements
            </Text>
            <View className="flex-row gap-3">
              <View className="flex-1">
                <Card className="p-4 bg-gray-50 border ">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TrendingDown size={16} className="text-gray-600" />
                    <Text className="text-xs text-gray-600">Turbidity Reduction</Text>
                  </View>
                  <Text className="text-2xl font-bold text-primary">
                    {(treatmentPerformance?.average_improvements?.turbidity_reduction || 0).toFixed(1)}%
                  </Text>
                </Card>
              </View>
              <View className="flex-1">
                <Card className="p-4 bg-gray-50 border ">
                  <View className="flex-row items-center gap-2 mb-1">
                    <TrendingDown size={16} className="text-gray-600" />
                    <Text className="text-xs text-gray-600">TDS Reduction</Text>
                  </View>
                  <Text className="text-2xl font-bold text-primary">
                    {(treatmentPerformance?.average_improvements?.tds_reduction || 0).toFixed(1)}%
                  </Text>
                </Card>
              </View>
            </View>
            <View>
              <Card className="p-4 bg-gray-50 border ">
                <View className="flex-row items-center">
                  {(treatmentPerformance?.average_improvements?.ph_change ?? 0) >= 0 ? (
                    <TrendingUp size={16} className="text-gray-600" />
                  ) : (
                    <TrendingDown size={16} className="text-gray-600" />
                  )}
                  <Text className="text-xs text-gray-600"> pH Change</Text>
                </View>
                <View className="flex-row items-baseline gap-1">
                  <Text className="text-2xl font-bold text-primary">
                    {(treatmentPerformance?.average_improvements?.ph_change ?? 0) >= 0 ? '+' : ''}
                    {(treatmentPerformance?.average_improvements?.ph_change ?? 0).toFixed(2)}
                  </Text>
                  <Text className="text-xs text-gray-500">
                    {(treatmentPerformance?.average_improvements?.ph_change ?? 0) > 0 
                      ? '(more alkaline)' 
                      : (treatmentPerformance?.average_improvements?.ph_change ?? 0) < 0 
                      ? '(more acidic)' 
                      : '(neutral)'}
                  </Text>
                </View>
              </Card>
            </View>
          </Card>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

