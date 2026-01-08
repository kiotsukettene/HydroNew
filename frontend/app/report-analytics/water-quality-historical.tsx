import { View, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { FilterDropdown } from '@/components/reports/FilterDropdown';
import { SystemTypeFilter } from '@/components/reports/filters/SystemTypeFilter';
import { DateRangeFilter } from '@/components/reports/filters/DateRangeFilter';
import { IntervalFilter } from '@/components/reports/filters/IntervalFilter';
import { LineChart } from 'react-native-gifted-charts';
import type { SystemType } from '@/types/reports';
import { AlertCircle } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

export default function WaterQualityHistorical() {
  const [refreshing, setRefreshing] = useState(false);
  const [systemType, setSystemType] = useState<SystemType>('hydroponics_water');
  const [interval, setInterval] = useState<'hourly' | 'daily' | 'weekly'>('daily');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { waterQualityHistorical, loading, fetchWaterQualityHistorical } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [systemType, interval, startDate, endDate])
  );

  const loadData = async () => {
    await fetchWaterQualityHistorical(systemType, {
      interval,
      start_date: startDate,
      end_date: endDate,
    });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Prepare chart data
  const prepareChartData = (parameter: 'ph' | 'tds' | 'ec' | 'turbidity' | 'temperature' | 'humidity') => {
    if (!waterQualityHistorical?.readings) return [];
    
    return waterQualityHistorical.readings
      .filter(reading => reading[parameter] !== null)
      .map((reading, index) => ({
        value: reading[parameter] as number,
        label: index % 3 === 0 ? new Date(reading.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '',
      }));
  };

  const phData = prepareChartData('ph');
  const tdsData = prepareChartData('tds');

  return (
    <ScrollView 
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <PageHeader 
          title="Water Quality Historical"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Filters */}
          <FilterDropdown filterCount={2}>
            <SystemTypeFilter
              value={systemType}
              onChange={setSystemType}
            />
            <IntervalFilter
              value={interval}
              onChange={setInterval}
            />
            <DateRangeFilter
              startDate={startDate}
              endDate={endDate}
              onDateRangeChange={handleDateRangeChange}
            />
          </FilterDropdown>

          {/* Statistical Summary */}
          {waterQualityHistorical?.statistics && (
            <Card className="border-muted-foreground/30 p-4 mb-4">
              <Text className="text-xl font-semibold text-primary mb-3">Statistical Summary</Text>
              <View className="gap-3">
                {Object.entries(waterQualityHistorical.statistics).map(([param, stats]) => {
                  if (!stats || typeof stats !== 'object') return null;
                  return (
                    <View key={param} className="flex-row justify-between items-center">
                      <Text className="text-sm font-medium text-gray-700 uppercase flex-1">{param}</Text>
                      <View className="flex-row gap-4">
                        <View>
                          <Text className="text-xs text-muted-foreground">Min</Text>
                          <Text className="text-sm font-semibold">{(stats.min || 0).toFixed(2)}</Text>
                        </View>
                        <View>
                          <Text className="text-xs text-muted-foreground">Avg</Text>
                          <Text className="text-sm font-semibold text-primary">{(stats.avg || 0).toFixed(2)}</Text>
                        </View>
                        <View>
                          <Text className="text-xs text-muted-foreground">Max</Text>
                          <Text className="text-sm font-semibold">{(stats.max || 0).toFixed(2)}</Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          )}

          {/* Out of Range Alert */}
          {systemType === 'hydroponics_water' && waterQualityHistorical?.out_of_range_count !== undefined && waterQualityHistorical.out_of_range_count > 0 && (
            <Card className="p-4 bg-red-50 border border-red-200 mb-4">
              <View className="flex-row items-center gap-2">
                <Icon as={AlertCircle} size={20} className="text-red-600" />
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-red-800">Out of Range Alert</Text>
                  <Text className="text-xs text-red-700 mt-1">
                    {waterQualityHistorical.out_of_range_count} readings outside target parameters
                  </Text>
                </View>
              </View>
            </Card>
          )}

          {/* pH Chart */}
          <ChartContainer 
            title="pH Levels" 
            subtitle={`${interval} readings`}
            loading={loading}
          >
            <View className="px-4 py-4">
              {phData.length > 0 ? (
                <LineChart
                  areaChart
                  data={phData}
                  startFillColor="hsl(173 58% 39%)"
                  startOpacity={0.3}
                  endFillColor="hsl(173 58% 39% / 0.1)"
                  endOpacity={0.1}
                  height={250}
                  color="hsl(173 58% 39%)"
                  thickness={3}
                  curved
                  spacing={50}
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
                <Text className="text-center text-muted-foreground py-8">No pH data available</Text>
              )}
            </View>
          </ChartContainer>

          {/* TDS Chart */}
          <ChartContainer 
            title="TDS (Total Dissolved Solids)" 
            subtitle={`${interval} readings in ppm`}
            loading={loading}
          >
            <View className="px-4 py-4">
              {tdsData.length > 0 ? (
                <LineChart
                  areaChart
                  data={tdsData}
                  startFillColor="#3b82f6"
                  startOpacity={0.3}
                  endFillColor="rgba(59, 130, 246, 0.1)"
                  endOpacity={0.1}
                  height={250}
                  color="#3b82f6"
                  thickness={3}
                  curved
                  spacing={50}
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
                <Text className="text-center text-muted-foreground py-8">No TDS data available</Text>
              )}
            </View>
          </ChartContainer>

          {!loading && (!waterQualityHistorical || !waterQualityHistorical.readings || waterQualityHistorical.readings.length === 0) && (
            <Card className="p-6 items-center">
              <Text className="text-muted-foreground">No water quality data found for the selected period</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

