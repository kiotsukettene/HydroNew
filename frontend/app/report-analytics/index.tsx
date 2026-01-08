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
  ChevronRight
} from 'lucide-react-native';
import { useReportsStore } from '@/store/reports/reportsStore';
import { Skeleton } from '@/components/ui/skeleton';

interface NavigationCardProps {
  title: string;
  description: string;
  icon: any;
  onPress: () => void;
  color?: string;
}

const NavigationCard = ({ 
  title, 
  description, 
  icon, 
  onPress,
  color = 'bg-primary'
}: NavigationCardProps) => (
  <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
    <Card className="p-4 border border-muted-foreground/20 mb-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className={`${color} rounded-xl p-3 mr-3`}>
            <Icon as={icon} size={24} className="text-white" />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-900">{title}</Text>
            <Text className="text-xs text-muted-foreground mt-0.5">{description}</Text>
          </View>
        </View>
        <Icon as={ChevronRight} size={20} className="text-muted-foreground" />
      </View>
    </Card>
  </TouchableOpacity>
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
    <ScrollView 
      className="flex-1"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <SafeAreaView>
        <PageHeader 
          title="Report & Analytics"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Creative Title Section */}
          <View className="relative mb-6">
            <View className="bg-green-50 rounded-2xl p-4 border-transparent">
              <View className="relative z-10">
                <View className="flex-row items-center">
                  <View className="w-1.5 h-6 bg-primary rounded-full mr-3" />
                  <Text className="text-2xl font-bold text-primary">
                    Report Analytics
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats Summary */}
          <Card className="p-4 border-muted-foreground/30 mb-6 bg-gradient-to-br from-primary/5 to-white">
            <Text className="text-lg font-semibold text-gray-900 mb-3">Quick Overview</Text>
            {loading ? (
              <View className="gap-2">
                <Skeleton className="w-full h-12 rounded-lg" />
                <Skeleton className="w-full h-12 rounded-lg" />
              </View>
            ) : (
              <View className="flex-row justify-between">
                <View className="flex-1 items-center">
                  <Text className="text-3xl font-bold text-primary">
                    {cropPerformance?.setups.length || 0}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">Active Setups</Text>
                </View>
                <View className="w-px bg-muted-foreground/20" />
                <View className="flex-1 items-center">
                  <Text className="text-3xl font-bold text-green-600">
                    {yieldSummary?.total_harvested_setups || 0}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">Total Harvests</Text>
                </View>
                <View className="w-px bg-muted-foreground/20" />
                <View className="flex-1 items-center">
                  <Text className="text-3xl font-bold text-blue-600">
                    {yieldSummary?.sellable_percentage 
                      ? `${yieldSummary.sellable_percentage.toFixed(0)}%` 
                      : '0%'}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">Sellable</Text>
                </View>
              </View>
            )}
          </Card>

          {/* Crop Analytics Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Icon as={TrendingUp} size={20} className="text-primary mr-2" />
              <Text className="text-xl font-bold text-gray-900">Crop Analytics</Text>
            </View>
            
            <NavigationCard
              title="Crop Performance"
              description="Active setups, health status, and growth stages"
              icon={BarChart3}
              color="bg-green-600"
              onPress={() => router.push('/report-analytics/crop-performance')}
            />
            
            <NavigationCard
              title="Yield Summary"
              description="Harvest data, weights, and grade distribution"
              icon={Package}
              color="bg-emerald-600"
              onPress={() => router.push('/report-analytics/yield-summary')}
            />
            
            <NavigationCard
              title="Crop Comparison"
              description="Compare multiple crops side-by-side"
              icon={GitCompare}
              color="bg-teal-600"
              onPress={() => router.push('/report-analytics/crop-comparison')}
            />
          </View>

          {/* Water Quality Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Icon as={Droplet} size={20} className="text-blue-600 mr-2" />
              <Text className="text-xl font-bold text-gray-900">Water Quality</Text>
            </View>
            
            <NavigationCard
              title="Historical Data"
              description="Time-series analysis of water parameters"
              icon={Activity}
              color="bg-blue-600"
              onPress={() => router.push('/report-analytics/water-quality-historical')}
            />
            
            <NavigationCard
              title="Trends Analysis"
              description="Parameter trends and recommendations"
              icon={TrendingUp}
              color="bg-cyan-600"
              onPress={() => router.push('/report-analytics/water-quality-trends')}
            />
          </View>

          {/* Treatment Performance Section */}
          <View className="mb-6">
            <View className="flex-row items-center mb-3">
              <Icon as={Zap} size={20} className="text-purple-600 mr-2" />
              <Text className="text-xl font-bold text-gray-900">Treatment Performance</Text>
            </View>
            
            <NavigationCard
              title="Performance Overview"
              description="Success rates and stage efficiency"
              icon={Zap}
              color="bg-purple-600"
              onPress={() => router.push('/report-analytics/treatment-performance')}
            />
            
            <NavigationCard
              title="Efficiency Analysis"
              description="Cycle trends and maintenance insights"
              icon={Activity}
              color="bg-violet-600"
              onPress={() => router.push('/report-analytics/treatment-efficiency')}
            />
          </View>

          {/* Error Display */}
          {error && (
            <Card className="p-4 bg-red-50 border border-red-200">
              <Text className="text-sm text-red-800">{error}</Text>
            </Card>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
