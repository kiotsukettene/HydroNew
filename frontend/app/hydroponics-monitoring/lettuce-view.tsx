import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import FolderBg from '@/components/ui/folder-bg';
import { Droplet, Leaf, Activity, Thermometer, Wind } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore';

export default function LettuceView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setupId = params.id;
  const { currentSetup, fetchSetupById, loading, error } = useHydroponicSetupStore();
  const [activeTab, setActiveTab] = useState<'details' | 'monitoring'>('monitoring');

  // Check if harvest is allowed (plant age must be >= 14 days)
  const canHarvest = currentSetup ? (currentSetup.plant_age ?? 0) >= 14 : false;

  useEffect(() => {
    if (setupId) {
      fetchSetupById(Number(setupId));
    }
  }, [setupId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* =========== Page Header =========== */}
        <View className="relative z-10">
          <PageHeader title="Hydroponics Monitoring" />
        </View>

        {/* =========== Plant Section =========== */}
        <View
          className="mt-2"
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <View className="items-center justify-center py-4">
            <Image
              source={require('@/assets/images/lettuce.png')}
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* =========== Folder Section =========== */}
        <View className="flex-1 px-4 pt-5 pb-5">
          <FolderBg>
            <View className="flex-1 justify-between p-4">
              <View>
                <Text className="mb-4 text-xl font-bold text-white">
                  {currentSetup?.crop_name
                    ? currentSetup.crop_name.charAt(0).toUpperCase() +
                      currentSetup.crop_name.slice(1)
                    : 'Loading...'}
                </Text>

                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {currentSetup?.plant_age ?? '-'} Days
                    </Text>
                    <Text className="text-xs text-lime-200">PLANT AGE</Text>

                    <Text className="mt-1 text-xl font-bold text-white">{currentSetup?.water_amount ?? '-'}</Text>
                    <Text className="text-xs text-lime-200">WATER AMOUNT</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {currentSetup?.days_left ?? '-'} Days
                    </Text>
                    <Text className="text-xs text-lime-200">ESTIMATED DAYS LEFT</Text>

                    <Text className="mt-1 text-xl font-bold text-white">
                      {currentSetup?.number_of_crops ?? '-'}
                    </Text>
                    <Text className="text-xs text-lime-200">NUMBER OF CROPS</Text>
                  </View>
                </View>
              </View>

              <View className="mt-7">
                <Button
                  className="w-full rounded-xl bg-emerald-50"
                  onPress={() => {
                    router.push('/hydroponics-monitoring/pump-screen');
                  }}
                  disabled={loading}>
                  <Icon as={Droplet} className="text-primary" />
                  <Text className="ml-2 text-primary">Start Pump</Text>
                </Button>
              </View>
            </View>
          </FolderBg>

          {/* Mark as Harvested Button - Outside FolderBg */}
          <View>
            <Button
              variant="outline"
              className={`w-full rounded-xl mt-2 ${!canHarvest ? 'opacity-50 border-muted-foreground' : 'border-primary'}`}
              onPress={() => {
                router.push({
                  pathname: '/hydroponics-monitoring/harvest-form',
                  params: { id: setupId }
                });
              }}
              disabled={loading || !canHarvest}>
              <Icon as={Leaf} className={!canHarvest ? 'text-muted-foreground' : 'text-primary'} />
              <Text className={`ml-2 ${!canHarvest ? 'text-muted-foreground' : 'text-primary'}`}>
                Mark as Harvested
              </Text>
            </Button>
            {!canHarvest && currentSetup && (
              <Text className="text-xs text-muted-foreground text-center mt-2">
                {currentSetup.plant_age !== null && currentSetup.plant_age !== undefined
                  ? `${14 - currentSetup.plant_age} day${14 - currentSetup.plant_age !== 1 ? 's' : ''} remaining until harvest is available`
                  : 'Minimum 14 days required before harvest'}
              </Text>
            )}
          </View>
        </View>

        {/* =========== Tabs Section =========== */}
        <View className="px-4 pb-4">
          <View className="flex-row bg-gray-100 rounded-xl p-1">
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-1 py-3 rounded-lg ${activeTab === 'monitoring' ? 'bg-primary' : 'bg-transparent'}`}
              onPress={() => setActiveTab('monitoring')}
            >
              <Text className={`text-center font-semibold ${activeTab === 'monitoring' ? 'text-white' : 'text-muted-foreground'}`}>
                Real-Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              className={`flex-1 py-3 rounded-lg ${activeTab === 'details' ? 'bg-primary' : 'bg-transparent'}`}
              onPress={() => setActiveTab('details')}
            >
              <Text className={`text-center font-semibold ${activeTab === 'details' ? 'text-white' : 'text-muted-foreground'}`}>
                Crop Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* =========== Real-Time Monitoring Section =========== */}
        {activeTab === 'monitoring' && (
          <View className="px-4 pb-5">
            <View className="mb-4">
              <Text className="text-lg font-semibold">Real-Time Monitoring</Text>
              <Text className="text-xs text-muted-foreground mt-1">Updated just now</Text>
            </View>

            {/* Monitoring Cards Grid */}
            <View className="gap-3">
              {/* pH Level Card */}
              <Card className="p-4 border border-muted-foreground/20">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Icon as={Activity} size={16} className="text-muted-foreground" />
                      <Text className="text-sm text-muted-foreground">pH Level</Text>
                    </View>
                    <Text className="text-3xl font-bold">6.8</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-muted-foreground mb-1">Target Range</Text>
                    <Text className="text-sm font-semibold">{currentSetup?.target_ph_min} - {currentSetup?.target_ph_max}</Text>
                  </View>
                </View>
              </Card>

              {/* TDS Card */}
              <Card className="p-4 border border-muted-foreground/20">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Icon as={Droplet} size={16} className="text-muted-foreground" />
                      <Text className="text-sm text-muted-foreground">TDS (Total Dissolved Solids)</Text>
                    </View>
                    <Text className="text-3xl font-bold">920 <Text className="text-lg text-muted-foreground">ppm</Text></Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-muted-foreground mb-1">Target Range</Text>
                    <Text className="text-sm font-semibold">{currentSetup?.target_tds_min} - {currentSetup?.target_tds_max}</Text>
                  </View>
                </View>
              </Card>

              {/* EC and Humidity Row */}
              <View className="flex-row gap-3">
                <Card className="flex-1 p-4 border border-muted-foreground/20">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Icon as={Thermometer} size={16} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">EC</Text>
                  </View>
                  <Text className="text-2xl font-bold">1.8</Text>
                  <Text className="text-xs text-muted-foreground mt-1">mS/cm</Text>
                </Card>

                <Card className="flex-1 p-4 border border-muted-foreground/20">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Icon as={Wind} size={16} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">Humidity</Text>
                  </View>
                  <Text className="text-2xl font-bold">41%</Text>
                  <Text className="text-xs text-muted-foreground mt-1">Optimal: 50-70%</Text>
                </Card>
              </View>
            </View>
          </View>
        )}

        {/* =========== Setup Information Section =========== */}
        {activeTab === 'details' && (
          <View className="px-4 pb-5">
            <Card className="rounded-2xl p-6">
              <Text className="mb-4 text-lg font-semibold">Crop Details</Text>

              {/* Basic Info */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold capitalize">
                    {currentSetup?.crop_name || 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">CROP NAME</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.status ? currentSetup.status.charAt(0).toUpperCase() + currentSetup.status.slice(1) : 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">STATUS</Text>
                </View>
              </View>

              {/* Setup and Harvest Dates */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.setup_date 
                      ? new Date(currentSetup.setup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">SETUP DATE</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.harvest_date 
                      ? new Date(currentSetup.harvest_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">EXPECTED HARVEST</Text>
                </View>
              </View>

              {/* Bed and Crops Info */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold capitalize">
                    {currentSetup?.bed_size || 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">BED SIZE</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.nutrient_solution || 'Not specified'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">NUTRIENT SOLUTION</Text>
                </View>
              </View>

              {/* Water Amount and Nutrient Solution */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.water_amount || 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">WATER AMOUNT</Text>
                </View>
                
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
