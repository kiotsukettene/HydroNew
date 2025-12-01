import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { BadgeCheckIcon, CircleArrowRight, Info } from 'lucide-react-native'; // Added Info icon
import React, { use, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PHLevelDetailsModal from '../water-monitor/ph-level-details';
import TDSDetailsModal from '../water-monitor/tds-details';
import PhScale from '@/components/ui/ph-meter';

import { db } from '@/src/firebase';
import { onValue, ref } from 'firebase/database';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SensorData {
  ph: number;
  tds: number;
  turbidity: number;
  timestamp: number;
}

export default function Monitor() {
  const router = useRouter();
  const [isTDSDetailsModalVisible, setIsTDSDetailsModalVisible] = useState(false);
  const [isPHLevelDetailsModalVisible, setIsPHLevelDetailsModalVisible] = useState(false);
  const [tabValue, setTabValue] = useState('clean');

  //firebase data fetching
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [latestKey, setLatestKey] = useState<string | null>(null);
  useEffect(() => {
    const sensorRef = ref(db, 'sensorData/');
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      // Get the latest entry (Firebase push key)
      const keys = Object.keys(data);
      const newKey = keys[keys.length - 1];
      const latestData = data[newKey];

      setLatestKey(newKey);
      setSensorData(latestData);
    });

    return () => unsubscribe();
  }, [latestKey]);

  const recentActivities = [
    { id: '1', description: 'Water pH adjusted', time: '8:00 AM' },
    { id: '2', description: 'Filtration completed', time: '9:15 AM' },
  ];
  return (
    <ScrollView>
      <SafeAreaView className="bg-white">
        {/* ===== Page Header ===== */}
        <PageHeader title="Water Monitoring" />
        <View className="p-4">




          {/* ========================== Water Quality Card ============================ */}
          <Card className="mt-1 overflow-hidden rounded-2xl border-transparent bg-[#BCE7F0] p-4">

            <Tabs value={tabValue} onValueChange={setTabValue} >
              <TabsList className="w-full">
                <TabsTrigger value="clean" className="flex-1">
                  <Text>Clean</Text>
                </TabsTrigger>
                <TabsTrigger value="dirty" className="flex-1">
                  <Text>Dirty</Text>
                </TabsTrigger>
              </TabsList>


               {/* =========== Clean Water card ==================== */}

              <TabsContent value="clean">
                <CardContent className="p-2">
                  <View className="flex-row justify-between">
                    {/* Left Column: Details */}
                    <View className="justify-between">
                      <View>
                        <Text className="text-gray-600">pH Level</Text>
                        <Text className="text-xl font-medium text-gray-800">
                          {sensorData ? sensorData.ph : '--'}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <View>
                          <Text className="text-gray-600">TDS</Text>
                          <Text className="text-xl font-medium text-gray-800">
                            {sensorData ? `${Math.round(sensorData.tds)} ppm` : '--'}
                          </Text>
                        </View>

                        <Button variant={'ghost'} onPress={() => setIsTDSDetailsModalVisible(true)}>
                          <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1" />
                        </Button>
                        <TDSDetailsModal
                          visible={isTDSDetailsModalVisible}
                          onClose={() => setIsTDSDetailsModalVisible(false)}
                        />
                      </View>

                      <View>
                        <Text className="text-gray-600">Turbidity</Text>
                        <Text className="text-xl font-medium text-gray-800">
                          {sensorData ? sensorData.turbidity.toFixed(2) : '--'}
                        </Text>
                      </View>
                    </View>

                    {/* Right Column: WATER TANK LEVEL */}
                    <View className="items-center">
                      <View className="size-36 items-center justify-center rounded-full bg-white">
                        <Text className="text-4xl font-bold text-gray-800">75%</Text>
                        <Text className="text-sm text-gray-600">Water Tank Level</Text>
                      </View>

                      {/* Badge */}
                      <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
                        <Icon as={BadgeCheckIcon} className="text-white" />
                        <Text className="text-white">Good</Text>
                      </Badge>
                    </View>
                  </View>

                  {/*  Button */}
                  <Button
                    className="mt-4 rounded-lg bg-white/70 transition-all duration-200 hover:scale-105 hover:bg-muted-foreground/70 active:scale-95 active:bg-muted-foreground/80"
                    onPress={() => {
                      router.push('/(tabs)/filtration');
                    }}>
                    <Text className="font-semibold text-gray-800">Start Filtration</Text>
                  </Button>
                </CardContent>
              </TabsContent>


              {/* =========== Dirty Water card ==================== */}
              <TabsContent value="dirty">
                <CardContent className="p-2">
                  <View className="flex-row justify-between">
                    {/* Left Column: Details */}
                    <View className="justify-between">
                      <View>
                        <Text className="text-gray-600">pH Level</Text>
                        <Text className="text-xl font-medium text-gray-800">
                          {sensorData ? sensorData.ph : '--'}
                        </Text>
                      </View>

                      <View className="flex-row items-center">
                        <View>
                          <Text className="text-gray-600">TDS</Text>
                          <Text className="text-xl font-medium text-gray-800">
                            {sensorData ? `${Math.round(sensorData.tds)} ppm` : '--'}
                          </Text>
                        </View>

                        <Button variant={'ghost'} onPress={() => setIsTDSDetailsModalVisible(true)}>
                          <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1" />
                        </Button>
                        <TDSDetailsModal
                          visible={isTDSDetailsModalVisible}
                          onClose={() => setIsTDSDetailsModalVisible(false)}
                        />
                      </View>

                      <View>
                        <Text className="text-gray-600">Turbidity</Text>
                        <Text className="text-xl font-medium text-gray-800">
                          {sensorData ? sensorData.turbidity.toFixed(2) : '--'}
                        </Text>
                      </View>
                    </View>

                    {/* Right Column: WATER TANK LEVEL */}
                    <View className="items-center">
                      <View className="size-36 items-center justify-center rounded-full bg-white">
                        <Text className="text-4xl font-bold text-gray-800">20%</Text>
                        <Text className="text-sm text-gray-600">Water Tank Level</Text>
                      </View>

                      {/* Badge */}
                      <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
                        <Icon as={BadgeCheckIcon} className="text-white" />
                        <Text className="text-white">Low</Text>
                      </Badge>
                    </View>
                  </View>

                  {/*  Button */}
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
          </Card>

          {/* ===== Recent Activity Card ===== */}

          <Card className="mt-4 rounded-2xl border border-gray-300 p-5 shadow-sm">
            <CardContent className="p-0">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">Recent Activity</Text>
                <Button
                  variant="link"
                  className="onPress p-0"
                  onPress={() => {
                    router.push('/water-monitor/recent-activity');
                  }}>
                  <Text className="text-sm font-medium text-secondary">See All</Text>
                </Button>
              </View>

              {/* List of Activities */}
              <View>
                {recentActivities.map((activity, index) => (
                  <View key={activity.id}>
                    {/* Activity Item */}
                    <View className="py-3">
                      <Text className="text-base text-gray-900">{activity.description}</Text>
                      <Text className="mt-1 text-sm text-gray-400">{activity.time}</Text>
                    </View>

                    {/* Separator */}
                    {index < recentActivities.length - 1 && <Separator className="bg-gray-200" />}
                  </View>
                ))}
              </View>
            </CardContent>
          </Card>

          {/* ===== Need Help Card ===== */}
          <Pressable
            onPress={() => {
              router.push('/tips');
            }}>
            <View className="relative mt-2 w-full overflow-hidden">
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

          <View className="mt-4 items-center gap-2">
            <View className="flex w-full flex-row items-center justify-between px-2">
              <Text className="text-lg font-semibold text-gray-900">Water pH Level</Text>
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
            <PhScale phValue={sensorData ? sensorData.ph : 0} />
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
