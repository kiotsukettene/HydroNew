import { View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { 
  TrendingUp, 
  Package, 
  GitCompare, 
  Droplet, 
  Activity, 
  Zap,
  BarChart3,
  ChevronRight,
  HelpCircle
} from 'lucide-react-native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { Skeleton } from '@/components/ui/skeleton';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: any;
  onPress: () => void;
  iconBgClassName?: string;
  iconClassName?: string;
}

const NavigationCard = ({ 
  title, 
  description, 
  icon, 
  onPress,
  iconBgClassName = 'bg-green-100',
  iconClassName = 'text-green-700'
}: NavigationCardProps) => (
  <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
    <Card className="p-4 mb-2 shadow-sm border border-muted-foreground/20">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`${iconBgClassName} rounded-2xl p-3 mr-3.5`}>
            <Icon as={icon} size={22} className={iconClassName} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-semibold text-gray-800 mb-0.5">
              {title}
            </Text>
            <Text className="text-xs text-gray-500">
              {description}
            </Text>
          </View>
        </View>
        <View className="bg-gray-100 rounded-xl p-1.5">
          <Icon as={ChevronRight} size={18} className="text-gray-400" />
        </View>
      </View>
    </Card>
  </TouchableOpacity>
);

interface StatCardProps {
  value: string | number;
  label: string;
  valueClassName: string;
  bgClassName: string;
}

const StatCard = ({ value, label, valueClassName, bgClassName }: StatCardProps) => (
  <Card className={`flex-1 ${bgClassName} rounded-2xl p-2 mx-1 items-center justify-center `}>
    <Text className={`text-3xl pt-3 font-bold ${valueClassName} `}>
      {value}
    </Text>
    <Text className="text-xs text-foreground text-center">
      {label}
    </Text>
  </Card>
);

interface SectionHeaderProps {
  icon: any;
  title: string;
  iconClassName: string;
}

const SectionHeader = ({ icon, title, iconClassName }: SectionHeaderProps) => (
  <View className="flex-row items-center mb-4">
    <View className={`rounded-xl p-2 mr-2.5`}>
      <Icon as={icon} size={18} className={iconClassName} />
    </View>
    <Text className="text-lg font-bold text-gray-800">
      {title}
    </Text>
  </View>
);

export default function ReportAnalytics() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { 
    cropPerformance, 
    yieldSummary,
    loading,
    error,
    fetchCropPerformance,
    fetchYieldSummary,
  } = useReportsStore();

  // Auto-refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const loadDashboardData = async () => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    await Promise.all([
      fetchCropPerformance({
        status: 'active',
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
      }),
      fetchYieldSummary({
        start_date: start.toISOString().split('T')[0],
        end_date: end.toISOString().split('T')[0],
      }),
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <View className="flex-1 ">
      <SafeAreaView className="flex-1 bg-white/90">
        <ScrollView 
          className="flex-1"
          contentContainerClassName="pb-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              tintColor="#4A7C59"
              colors={['#4A7C59']}
            />
          }
        >
         
              <PageHeader 
                title=""
                showBackButton={true}
                showNotificationButton={false}
              />
             
         
          {/* Title Card */}
          <View className="mt-2 mb-5">
            <Card className="rounded-3xl p-5 border-0">
              <View className="flex-row items-center">
                <View className="w-1 h-7 bg-green-700 rounded-full mr-3" />
                <View>
                  <Text className="text-2xl font-bold ">
                    Report Analytics
                  </Text>
                  <Text className="text-sm ">
                    See your farm insights
                  </Text>
                </View>
              </View>
            </Card>
          </View>

          {/* Quick Stats Summary */}
          <View className="px-5 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-base font-semibold text-gray-800">
                Quick Overview
              </Text>
            </View>
            
            {loading ? (
              <View className="flex-row gap-2">
                <Skeleton className="flex-1 h-24 rounded-2xl" />
                <Skeleton className="flex-1 h-24 rounded-2xl" />
                <Skeleton className="flex-1 h-24 rounded-2xl" />
              </View>
            ) : (
              <View className="flex-row -mx-1">
                <StatCard
                  value={cropPerformance?.setups.length || 0}
                  label="Active Setups"
                  valueClassName="text-green-900"
                  bgClassName="bg-[#d6e8b6]"
                />
                <StatCard
                  value={yieldSummary?.total_harvested_setups || 0}
                  label="Total Harvests"
                  valueClassName="text-brown-900"
                  bgClassName="bg-[#ffd4c2]"
                />
                <StatCard
                  value={yieldSummary?.sellable_yield_percentage 
                    ? `${yieldSummary.sellable_yield_percentage.toFixed(0)}%` 
                    : '0%'}
                  label="Sellable"
                  valueClassName="text-blue-900"
                  bgClassName="bg-[#d6edf5]"
                />
              </View>
            )}
          </View>

          {/* Crop Analytics Section */}
          <View className="px-5 mb-5 mt-3">
            <SectionHeader
              icon={TrendingUp}
              title="Crop Analytics"
              iconClassName="text-green-700"
            />
            
            <NavigationCard
              title="Crop Performance"
              description="Active setups, health status, and growth stages"
              icon={BarChart3}
              iconBgClassName="bg-green-50"
              iconClassName="text-green-700"
              onPress={() => router.push('/report-analytics/crop-performance')}
            />
            
            <NavigationCard
              title="Yield Summary"
              description="Harvest data, weights, and grade distribution"
              icon={Package}
              iconBgClassName="bg-orange-50"
              iconClassName="text-orange-500"
              onPress={() => router.push('/report-analytics/yield-summary')}
            />
            
            <NavigationCard
              title="Crop Comparison"
              description="Compare multiple crops side-by-side"
              icon={GitCompare}
              iconBgClassName="bg-teal-50"
              iconClassName="text-teal-600"
              onPress={() => router.push('/report-analytics/crop-comparison')}
            />
          </View>

          {/* Water Quality Section */}
          <View className="px-5 mb-5">
            <SectionHeader
              icon={Droplet}
              title="Water Quality"
              iconClassName="text-blue-500"
            />
            
            <NavigationCard
              title="Historical Data"
              description="Time-series analysis of water parameters"
              icon={Activity}
              iconBgClassName="bg-blue-50"
              iconClassName="text-blue-500"
              onPress={() => router.push('/report-analytics/water-quality-historical')}
            />
            
            <NavigationCard
              title="Trends Analysis"
              description="Parameter trends and recommendations"
              icon={TrendingUp}
              iconBgClassName="bg-cyan-50"
              iconClassName="text-cyan-600"
              onPress={() => router.push('/report-analytics/water-quality-trends')}
            />
          </View>

          {/* Treatment Performance Section */}
          <View className="px-5 mb-5">
            <SectionHeader
              icon={Zap}
              title="Treatment Performance"
              iconClassName="text-purple-500"
            />
            
            <NavigationCard
              title="Performance Overview"
              description="Success rates and stage efficiency"
              icon={Zap}
              iconBgClassName="bg-purple-50"
              iconClassName="text-purple-500"
              onPress={() => router.push('/report-analytics/treatment-performance')}
            />
            
            <NavigationCard
              title="Efficiency Analysis"
              description="Cycle trends and maintenance insights"
              icon={Activity}
              iconBgClassName="bg-violet-50"
              iconClassName="text-violet-600"
              onPress={() => router.push('/report-analytics/treatment-efficiency')}
            />
          </View>

          {/* Error Display */}
          {error && (
            <View className="px-5 mb-5">
              <Card className="p-4 bg-red-50 border border-red-200 rounded-2xl">
                <Text className="text-sm text-red-700">{error}</Text>
              </Card>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
