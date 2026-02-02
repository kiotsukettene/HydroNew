import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Loader } from '@/components/ui/loader';
import { PageHeader } from '@/components/ui/page-header';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import {
  BadgeCheckIcon,
  CircleArrowRight,
  Info,
  Sparkles,
  AlertTriangle,
  Beaker,
  TrendingUp,
} from 'lucide-react-native';
import React, { use, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PHLevelDetailsModal from '../water-monitor/ph-level-details';
import TDSDetailsModal from '../water-monitor/tds-details';
import PhScale from '@/components/ui/ph-meter';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TurbidityDetailsModal from '../water-monitor/turbidity-details';
import { useSensorStore } from '@/store/sensor/sensorStore';
import { MonitorSkeleton } from '@/components/skeletons';

export default function Monitor() {
  const router = useRouter();
  const [isTDSDetailsModalVisible, setIsTDSDetailsModalVisible] = useState(false);
  const [isTurbidityDetailsModalVisible, setIsTurbidityDetailsModalVisible] = useState(false);
  const [isPHLevelDetailsModalVisible, setIsPHLevelDetailsModalVisible] = useState(false);
  const [tabValue, setTabValue] = useState('clean');
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Real-time sensor data from WebSocket - read directly from store (subscription is in _layout.tsx via useEchoSetup)
  const cleanWater = useSensorStore((state) => state.cleanWater);
  const dirtyWater = useSensorStore((state) => state.dirtyWater);
  const lastUpdated = useSensorStore((state) => state.lastUpdated);
  const loading = useSensorStore((state) => state.loading);

  // Show skeleton while initial data is loading
  if (loading && !cleanWater && !dirtyWater) {
    return <MonitorSkeleton />;
  }

  const handleGenerateInsights = async () => {
    // If already showing recommendations, just toggle them off
    if (showRecommendations) {
      setShowRecommendations(false);
      return;
    }

    // Start loading
    setIsGeneratingInsights(true);

    // Simulate API call / AI processing (replace with actual API call later)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Loading complete, show recommendations
    setIsGeneratingInsights(false);
    setShowRecommendations(true);
  };

  return (
    <ScrollView>
      <SafeAreaView className="bg-white">
        {/* ===== Page Header ===== */}
        <PageHeader title="Water Monitoring" />
        <View className="p-4">




          {/* ========================== Water Quality Card ============================ */}
          <Card className="mt-1 overflow-hidden rounded-2xl border-transparent bg-[#BCE7F0] p-4">
            <CardContent className="p-2">
            
              <Tabs value={tabValue} onValueChange={setTabValue}>
                <TabsList className="w-full">
                
                  <TabsTrigger value="dirty" className="flex-1">
                    <Text>Dirty</Text>
                  </TabsTrigger>

                    <TabsTrigger value="clean" className="flex-1">
                    <Text>Clean</Text>
                  </TabsTrigger>
                </TabsList>

              

                {/* =========== Dirty Water card ==================== */}
                <TabsContent value="dirty">
                  <CardContent className="p-2">
                    <View className="flex-row justify-between">
                      {/* Left Column: Details */}
                      <View className="justify-between">
                        <View className="flex-row items-start">
                          <View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-600">pH Level</Text>
                              <Button variant={'ghost'} className='bg-transparent p-0 h-auto' onPress={() => setIsPHLevelDetailsModalVisible(true)}>
                                <Icon as={Info} color="#059669" size={18} className="ml-2" />
                              </Button>
                            </View>
                            <Text className="text-xl font-medium text-gray-800">
                              {dirtyWater?.ph != null && !isNaN(dirtyWater.ph) ? dirtyWater.ph.toFixed(2) : '--'}
                            </Text>
                          </View>
                          <PHLevelDetailsModal
                            visible={isPHLevelDetailsModalVisible}
                            onClose={() => setIsPHLevelDetailsModalVisible(false)}
                          />
                        </View>

                        <View className="flex-row items-start">
                          <View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-600">TDS</Text>
                              <Button variant={'ghost'} className='bg-transparent p-0 h-auto' onPress={() => setIsTDSDetailsModalVisible(true)}>
                                <Icon as={Info} color="#059669" size={18} className="ml-2" />
                              </Button>
                            </View>
                            <Text className="text-xl font-medium text-gray-800">
                              {dirtyWater?.tds ? `${Math.round(dirtyWater.tds)} ppm` : '--'}
                            </Text>
                          </View>
                          <TDSDetailsModal
                            visible={isTDSDetailsModalVisible}
                            onClose={() => setIsTDSDetailsModalVisible(false)}
                          />
                        </View>

                        <View className="flex-row items-start">
                          <View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-600">Turbidity</Text>
                              <Button className='bg-transparent p-0 h-auto' onPress={() => setIsTurbidityDetailsModalVisible(true)}>
                                <Icon as={Info} color="#059669" size={18} className="ml-2" />
                              </Button>
                            </View>
                            <Text className="text-xl font-medium text-gray-800">
                              {dirtyWater?.turbidity != null && !isNaN(dirtyWater.turbidity) ? dirtyWater.turbidity.toFixed(2) : '--'}
                            </Text>
                          </View>
                          <TurbidityDetailsModal
                            visible={isTurbidityDetailsModalVisible}
                            onClose={() => setIsTurbidityDetailsModalVisible(false)}
                          />
                        </View>
                      </View>

                      {/* Right Column: WATER TANK LEVEL */}
                      <View className="items-center">
                        <View className="size-36 items-center justify-center rounded-full bg-white">
                          <Text className="text-4xl font-bold text-gray-800">
                            {dirtyWater?.water_level != null && !isNaN(dirtyWater.water_level) ? dirtyWater.water_level.toFixed(0) : '20'}%
                          </Text>
                          <Text className="text-sm text-gray-600">Water Tank Level</Text>
                        </View>

                        {/* Badge */}
                        <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
                          <Icon as={BadgeCheckIcon} className="text-white" />
                          <Text className="text-white">
                            {dirtyWater?.water_level ? (dirtyWater.water_level < 30 ? 'Low' : dirtyWater.water_level < 70 ? 'Medium' : 'High') : 'Low'}
                          </Text>
                        </Badge>
                      </View>
                    </View>

                    {/* Button */}
                    <Button
                      className="mt-4 rounded-lg bg-white/70 transition-all duration-200 hover:scale-105 hover:bg-muted-foreground/70 active:scale-95 active:bg-muted-foreground/80"
                      onPress={() => {
                        router.push('/(tabs)/filtration');
                      }}>
                      <Text className="font-semibold text-gray-800">Start Filtration</Text>
                    </Button>
                  </CardContent>
                </TabsContent>

                  {/* =========== Clean Water card ==================== */}
                <TabsContent value="clean">
                  <CardContent className="p-2">
                    <View className="flex-row justify-between">
                      {/* Left Column: Details */}
                      <View className="justify-between">
                        <View className="flex-row items-start">
                          <View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-600">pH Level</Text>
                              <Button variant={'ghost'} className='bg-transparent p-0 h-auto' onPress={() => setIsPHLevelDetailsModalVisible(true)}>
                                <Icon as={Info} color="#059669" size={18} className="ml-2" />
                              </Button>
                            </View>
                            <Text className="text-xl font-medium text-gray-800">
                              {cleanWater?.ph != null && !isNaN(cleanWater.ph) ? cleanWater.ph.toFixed(2) : '--'}
                            </Text>
                          </View>
                          <PHLevelDetailsModal
                            visible={isPHLevelDetailsModalVisible}
                            onClose={() => setIsPHLevelDetailsModalVisible(false)}
                          />
                        </View>

                        <View className="flex-row items-start">
                          <View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-600">TDS</Text>
                              <Button variant={'ghost'} className='bg-transparent p-0 h-auto' onPress={() => setIsTDSDetailsModalVisible(true)}>
                                <Icon as={Info} color="#059669" size={18} className="ml-2" />
                              </Button>
                            </View>
                            <Text className="text-xl font-medium text-gray-800">
                              {cleanWater?.tds ? `${Math.round(cleanWater.tds)} ppm` : '--'}
                            </Text>
                          </View>
                          <TDSDetailsModal
                            visible={isTDSDetailsModalVisible}
                            onClose={() => setIsTDSDetailsModalVisible(false)}
                          />
                        </View>

                        <View className="flex-row items-start">
                          <View>
                            <View className="flex-row items-center">
                              <Text className="text-gray-600">Turbidity</Text>
                              <Button className='bg-transparent p-0 h-auto' onPress={() => setIsTurbidityDetailsModalVisible(true)}>
                                <Icon as={Info} color="#059669" size={18} className="ml-2" />
                              </Button>
                            </View>
                            <Text className="text-xl font-medium text-gray-800">
                              {cleanWater?.turbidity != null && !isNaN(cleanWater.turbidity) ? cleanWater.turbidity.toFixed(2) : '--'}
                            </Text>
                          </View>
                          <TurbidityDetailsModal
                            visible={isTurbidityDetailsModalVisible}
                            onClose={() => setIsTurbidityDetailsModalVisible(false)}
                          />
                        </View>
                      </View>

                      {/* Right Column: WATER TANK LEVEL */}
                      <View className="items-center">
                        <View className="size-36 items-center justify-center rounded-full bg-white">
                          <Text className="text-4xl font-bold text-gray-800">
                            {cleanWater?.water_level != null && !isNaN(cleanWater.water_level) ? cleanWater.water_level.toFixed(0) : '75'}%
                          </Text>
                          <Text className="text-sm text-gray-600">Water Tank Level</Text>
                        </View>

                        {/* Badge */}
                        <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
                          <Icon as={BadgeCheckIcon} className="text-white" />
                          <Text className="text-white">
                            {cleanWater?.water_level ? (cleanWater.water_level < 30 ? 'Low' : cleanWater.water_level < 70 ? 'Good' : 'High') : 'Good'}
                          </Text>
                        </Badge>
                      </View>
                    </View>

                 

                    {/* Button */}
                    <Button
                      className="mt-4 rounded-lg bg-white/70 transition-all duration-200 hover:scale-105 hover:bg-muted-foreground/70 active:scale-95 active:bg-muted-foreground/80"
                      onPress={() => {
                        router.push('/(tabs)/filtration');
                      }}>
                      <Text className="font-semibold text-gray-800">Start Filtration</Text>
                    </Button>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* ===== Generate AI Insights Button ===== */}
          <Button
            className="mt-4 "
            style={{ borderColor: '#d4d4d4' }}
            variant={'outline'}
            disabled={isGeneratingInsights}
            onPress={handleGenerateInsights}>
            <Icon as={Sparkles} color="#6366f1" size={20} className="mr-2" />
            <Text className="font-semibold text-indigo-600">
              {isGeneratingInsights ? 'Generating...' : 'Generate AI Insights'}
            </Text>
          </Button>

          {/* ===== Loading State ===== */}
          {isGeneratingInsights && (
            <Card className="mt-4 border border-gray-300 p-5 shadow-sm">
              <CardContent className="p-0">
                <Loader
                  message="Generating AI insights..."
                  color="#6366f1"
                  size="lg"
                  className="py-8"
                />
              </CardContent>
            </Card>
          )}

          {/* ===== Smart Recommendations Card ===== */}
          {showRecommendations && !isGeneratingInsights && (
            <Card className="mt-4 border border-gray-300 p-5 shadow-sm">
              <CardContent className="p-0">
                <Text className="mb-4 text-lg font-light ">
                  Smart Recommendations
                </Text>

                <View className="gap-3">
                  {/* Card 1: The Diagnosis */}
                  <View className="flex-row items-center rounded-lg p-4">
                    <Icon as={AlertTriangle} color="#f59e0b" size={24} className="mr-3" />
                    <Text className="flex-1 text-base font-medium text-gray-900">
                      pH is too low.
                    </Text>
                  </View>

                  {/* Card 2: The Fix */}
                  <View className="flex-row items-center   p-4">
                    <Icon as={Beaker} color="#3b82f6" size={24} className="mr-3" />
                    <Text className="flex-1 text-base font-medium text-gray-900">
                      Add 5ml of pH Up solution.
                    </Text>
                  </View>

                 
                </View>
              </CardContent>
            </Card>
          )}

        
          {/* ===== pH Level Scale ===== */}
          <View className="mt-4 items-center gap-2">
            <View className="flex w-full flex-row items-center justify-between px-2">
              <Text className="text-lg font-semibold text-gray-900">Water pH Level ({tabValue === 'clean' ? 'Clean' : 'Dirty'})</Text>
              <Button
                variant="link"
                className="p-0"
                onPress={() => setIsPHLevelDetailsModalVisible(true)}>
                <Text className="text-sm font-medium text-secondary">See Details</Text>
              </Button>
              <PHLevelDetailsModal
                visible={isPHLevelDetailsModalVisible}
                onClose={() => setIsPHLevelDetailsModalVisible(false)}
              />
            </View>
            <PhScale phValue={tabValue === 'clean' ? (cleanWater?.ph ?? 0) : (dirtyWater?.ph ?? 0)} />
          </View>


          

          {/* ===== Need Help Card ===== */}
          <Pressable
            onPress={() => {
              router.push('/tips');
            }}>
            <View className="relative mt-4 w-full overflow-hidden">
              <Image
                source={require('@/assets/images/need-help-bg.png')}
                className="h-auto min-h-24 w-full sm:min-h-28 md:min-h-32"
                resizeMode="contain"
              />

              <View className="absolute inset-0 items-start justify-center px-6 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
                <View className="w-full flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
                  <View className="mt-2 flex-1 px-2 sm:mt-3 sm:px-3 md:mt-4 md:px-4">
                    <Text
                      className="text-xl font-medium sm:text-2xl md:text-3xl"
                      numberOfLines={1}
                      adjustsFontSizeToFit>
                      Need Help?
                    </Text>
                    <Text className="mt-2 text-base sm:text-lg md:text-xl" numberOfLines={2}>
                      Explore tips and suggestions tailored for you.
                    </Text>
                  </View>
                  <CircleArrowRight
                    color={'#445104'}
                    size={28}
                    className="sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10"
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}