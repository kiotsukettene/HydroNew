import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { LineChart } from 'react-native-gifted-charts';
import { AlertCircle } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';
import { Skeleton } from '@/components/ui/skeleton';
import type { SystemType } from '@/types/reports';

const SYSTEM_TYPES: Array<{ value: SystemType; label: string }> = [
  { value: 'dirty_water', label: 'Dirty Water' },
  { value: 'clean_water', label: 'Clean Water' },
  { value: 'hydroponics_water', label: 'Hydroponics' },
];

const INTERVAL_OPTIONS: Array<{ value: 'hourly' | 'daily' | 'weekly'; label: string }> = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
];

const PARAMETER_COLORS: { [key: string]: string } = {
  ph: 'hsl(173 58% 39%)',
  turbidity: '#f59e0b',
  tds: '#3b82f6',
  ec: '#8b5cf6',
  humidity: '#ec4899',
  temperature: '#ef4444',
};

const PARAMETER_LABELS: { [key: string]: string } = {
  ph: 'pH Level',
  turbidity: 'Turbidity',
  tds: 'TDS',
  ec: 'Electrical Conductivity',
  humidity: 'Humidity',
  temperature: 'Temperature',
};

const PARAMETER_UNITS: { [key: string]: string } = {
  ph: '',
  turbidity: 'NTU',
  tds: 'ppm',
  ec: 'mS/cm',
  humidity: '%',
  temperature: '°C',
};

export default function WaterQualityHistorical() {
  const [refreshing, setRefreshing] = useState(false);
  const [systemType, setSystemType] = useState<SystemType>('dirty_water');
  const [interval, setInterval] = useState<'hourly' | 'daily' | 'weekly'>('daily');

  const { waterQualityHistorical, loading, fetchWaterQualityHistorical } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [systemType, interval])
  );

  const loadData = async () => {
    await fetchWaterQualityHistorical(systemType, {
      interval,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  // Prepare chart data for each parameter
  const prepareChartData = (parameterKey: string) => {
    if (!waterQualityHistorical?.time_series) return [];
    
    return waterQualityHistorical.time_series
      .filter(item => {
        const paramData = item[parameterKey as keyof typeof item] as any;
        return paramData && paramData.average !== undefined && paramData.average !== null;
      })
      .map((item, index) => {
        const paramData = item[parameterKey as keyof typeof item] as any;
        return {
          value: paramData.average,
          label: index % Math.ceil(waterQualityHistorical.time_series.length / 5) === 0 
            ? new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) 
            : '',
          dataPointText: (paramData.average || 0).toFixed(1),
        };
      });
  };

  return (
    <ScrollView 
      className="flex-1 bg-white/90"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <PageHeader 
          title="Historical Data"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Filters */}
          <View className="gap-3 mb-4">
            {/* System Type Filter */}
            <View>
              <Text className="font-medium text-gray-700 mb-2">System Type</Text>
              <View className="flex-row bg-stone-100 rounded-full p-1 border border-brown-100">
                {SYSTEM_TYPES.map((type) => (
                  <TouchableOpacity
                    key={type.value}
                    onPress={() => setSystemType(type.value)}
                    className={`flex-1 py-2 px-2 rounded-full ${
                      systemType === type.value
                        ? 'bg-stone-700'
                        : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-center text-[11px] font-medium ${
                        systemType === type.value ? 'text-white' : 'text-stone-500'
                      }`}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interval Filter */}
            <View>
              <Text className="font-medium text-gray-700 mb-2">Interval</Text>
              <View className="flex-row bg-stone-100 rounded-full p-1 border border-brown-100">
                {INTERVAL_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => setInterval(opt.value)}
                    className={`flex-1 py-2 px-3 rounded-full ${
                      interval === opt.value
                        ? 'bg-stone-700'
                        : 'bg-transparent'
                    }`}
                  >
                    <Text
                      className={`text-center text-xs font-medium ${
                        interval === opt.value ? 'text-white' : 'text-stone-500'
                      }`}
                    >
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Statistical Summary */}
          {loading ? (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Skeleton className="w-48 h-6 mb-3" />
              <View className="gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} className="flex-row justify-between items-center border-b border-muted-foreground/10 pb-2">
                    <Skeleton className="w-20 h-4" />
                    <View className="flex-row gap-4">
                      <Skeleton className="w-10 h-8" />
                      <Skeleton className="w-10 h-8" />
                      <Skeleton className="w-10 h-8" />
                    </View>
                  </View>
                ))}
              </View>
            </Card>
          ) : waterQualityHistorical?.statistics && (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Text className="text-xl font-semibold text-primary mb-3">Statistical Summary</Text>
              <View className="gap-3">
                {Object.entries(waterQualityHistorical.statistics).map(([param, stats]) => {
                  if (!stats || typeof stats !== 'object') return null;
                  return (
                    <View key={param} className="flex-row justify-between items-center border-b border-muted-foreground/10 pb-2 last:border-b-0">
                      <Text className="text-sm font-medium text-gray-700 uppercase flex-1">{param}</Text>
                      <View className="flex-row gap-4">
                        <View className="items-center">
                          <Text className="text-[10px] text-muted-foreground">Min</Text>
                          <Text className="text-xs font-semibold">{(stats.min || 0).toFixed(1)}</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-[10px] text-muted-foreground">Avg</Text>
                          <Text className="text-xs font-semibold text-primary">{(stats.average || 0).toFixed(1)}</Text>
                        </View>
                        <View className="items-center">
                          <Text className="text-[10px] text-muted-foreground">Max</Text>
                          <Text className="text-xs font-semibold">{(stats.max || 0).toFixed(1)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          )}

          {/* Out of Range Alert */}
          {!loading && waterQualityHistorical?.out_of_range_count && (
            (() => {
              const counts = waterQualityHistorical.out_of_range_count;
              const hasAlerts = Array.isArray(counts) ? counts.length > 0 : Object.keys(counts).length > 0;
              
              if (!hasAlerts) return null;

              const alertCount = Array.isArray(counts) 
                ? counts.length 
                : Object.values(counts).reduce((sum, val) => sum + (val as number), 0);

              return (
                <Card className="p-4 bg-red-50 border border-red-200 mb-4">
                  <View className="flex-row items-center gap-2">
                    <Icon as={AlertCircle} size={20} className="text-red-600" />
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-red-800">Out of Range Alert</Text>
                      <Text className="text-xs text-red-700 mt-1">
                        {alertCount} readings outside target parameters
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })()
          )}

          {/* Charts */}
          {loading ? (
            <View className="gap-4">
              {[1, 2].map((i) => (
                <Card key={i} className="border-muted-foreground/30 p-4">
                  <Skeleton className="w-32 h-5 mb-2" />
                  <Skeleton className="w-48 h-3 mb-4" />
                  <Skeleton className="w-full h-64 rounded-xl" />
                </Card>
              ))}
            </View>
          ) : (
            waterQualityHistorical?.statistics && Object.keys(waterQualityHistorical.statistics).map((paramKey) => {
              const chartData = prepareChartData(paramKey);
              if (chartData.length === 0) return null;
              
              const color = PARAMETER_COLORS[paramKey] || 'hsl(173 58% 39%)';
              const label = PARAMETER_LABELS[paramKey] || paramKey.toUpperCase();
              const unit = PARAMETER_UNITS[paramKey] || '';

              return (
                <View key={paramKey} className="mb-4">
                  <ChartContainer 
                    title={label} 
                    subtitle={`Historical readings in ${unit || 'units'}`}
                    loading={loading}
                  >
                    <View className="px-4 py-4">
                      <LineChart
                        areaChart
                        data={chartData}
                        startFillColor={color}
                        startOpacity={0.3}
                        endFillColor={`${color}1A`}
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
                    </View>
                  </ChartContainer>
                </View>
              );
            })
          )}

          {!loading && (!waterQualityHistorical || !waterQualityHistorical.time_series || waterQualityHistorical.time_series.length === 0) && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No water quality data found for the selected period</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

