import { View, ScrollView, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { useFocusEffect } from '@react-navigation/native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { ChartContainer } from '@/components/reports/ChartContainer';
import { StatCard } from '@/components/reports/StatCard';
import { BarChart, PieChart } from 'react-native-gifted-charts';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { Package, Scale, TrendingUp } from 'lucide-react-native';

export default function YieldSummary() {
  const [refreshing, setRefreshing] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { yieldSummary, loading, fetchYieldSummary } = useReportsStore();

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [startDate, endDate])
  );

  const loadData = async () => {
    await fetchYieldSummary({
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
  const weightByCropData = yieldSummary?.weight_by_crop
    ? Object.entries(yieldSummary.weight_by_crop).map(([crop, weight]) => ({
        value: weight,
        label: crop.charAt(0).toUpperCase() + crop.slice(1, 3),
        frontColor: 'hsl(173 58% 39%)',
      }))
    : [];

  const gradeDistributionData = yieldSummary?.grade_distribution
    ? [
        {
          value: yieldSummary.grade_distribution.selling?.count || 0,
          color: '#10b981',
          text: 'Selling',
        },
        {
          value: yieldSummary.grade_distribution.consumption?.count || 0,
          color: '#3b82f6',
          text: 'Consumption',
        },
        {
          value: yieldSummary.grade_distribution.disposal?.count || 0,
          color: '#ef4444',
          text: 'Disposal',
        },
      ]
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
          title="Yield Summary"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Filters */}
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onDateRangeChange={handleDateRangeChange}
          />

          {/* Summary Stats */}
          <View className="gap-3 mb-4">
            <StatCard
              title="Total Harvested Setups"
              value={yieldSummary?.total_harvested_setups || 0}
              icon={Package}
              colorScheme="primary"
            />
            
            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  title="Total Weight"
                  value={`${(yieldSummary?.grade_distribution?.total_weight || 0)} kg`}
                  icon={Scale}
                  colorScheme="success"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  title="Sellable"
                  value={`${(yieldSummary?.sellable_yield_percentage || 0)}%`}
                  icon={TrendingUp}
                  colorScheme="success"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1">
                <StatCard
                  title="Selling Grade"
                  value={`${(yieldSummary?.grade_distribution?.selling?.count || 0)} items`}
                  subtitle={`${(yieldSummary?.grade_distribution?.selling?.percentage || 0)}%`}
                  colorScheme="success"
                />
              </View>
              <View className="flex-1">
                <StatCard
                  title="Waste"
                  value={`${(yieldSummary?.waste_percentage || 0)}%`}
                  subtitle={`${(yieldSummary?.grade_distribution?.disposal?.count || 0)} items`}
                  colorScheme="danger"
                />
              </View>
            </View>
          </View>

          {/* Weight by Crop Chart */}
          <ChartContainer 
            title="Weight by Crop Type" 
            subtitle="Total harvest weight per crop"
            loading={loading}
          >
            <View className="px-4 py-4">
              {weightByCropData.length > 0 ? (
                <BarChart
                  data={weightByCropData}
                  height={250}
                  barWidth={40}
                  spacing={30}
                  initialSpacing={20}
                  endSpacing={20}
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

          {/* Grade Distribution */}
          <ChartContainer 
            title="Grade Distribution" 
            subtitle="Quality breakdown of harvests"
            loading={loading}
          >
            <View className="items-center py-4">
              {gradeDistributionData.length > 0 ? (
                <>
                  <PieChart
                    data={gradeDistributionData}
                    radius={100}
                    donut
                    innerRadius={60}
                    centerLabelComponent={() => {
                      const total = gradeDistributionData.reduce((sum, item) => sum + (item?.value || 0), 0);
                      return (
                        <View className="items-center">
                          <Text className="text-2xl font-bold">{total}</Text>
                          <Text className="text-xs text-muted-foreground">kg Total</Text>
                        </View>
                      );
                    }}
                  />
                  
                  {/* Legend */}
                  <View className="flex-row flex-wrap justify-center mt-4 gap-3">
                    {gradeDistributionData.map((item, index) => (
                      <View key={index} className="flex-row items-center gap-1">
                        <View style={{ width: 12, height: 12, backgroundColor: item.color, borderRadius: 2 }} />
                        <Text className="text-xs text-gray-600">{item.text}: {item.value} kg</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text className="text-muted-foreground">No data available</Text>
              )}
            </View>
          </ChartContainer>

          {!loading && !yieldSummary && (
            <View className="p-6 items-center">
              <Text className="text-muted-foreground">No harvest data found for the selected date range</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

