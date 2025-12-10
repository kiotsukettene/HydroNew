import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { PageHeader } from '@/components/ui/page-header';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { BadgeCheckIcon, CircleArrowRight, Info } from 'lucide-react-native'; // Added Info icon
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PHLevelDetailsModal from '../water-monitor/ph-level-details';
import TDSDetailsModal from '../water-monitor/tds-details';
import  PhScale from '@/components/ui/ph-meter';


import { db } from '@/src/firebase';
import { onValue, ref } from 'firebase/database';
import TurbidityDetailsModal from '../water-monitor/turbidity-details';

interface SensorData {
  ph: number;
  tds: number;
  status: string;
  turbidity: number;
  timestamp: number;
}

export default function Monitor() {


  const router = useRouter();
  const [isTDSDetailsModalVisible, setIsTDSDetailsModalVisible] = useState(false);
  const [isTurbidityDetailsModalVisible, setIsTurbidityDetailsModalVisible] = useState(false);
  const [isPHLevelDetailsModalVisible, setIsPHLevelDetailsModalVisible] = useState(false);


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
      <SafeAreaView className='bg-white'>
              
          {/* ===== Page Header ===== */}
          <PageHeader title="Water Monitoring" />
        <View className="p-4">
          {/* ===== Water Quality Card ===== */}
          <Card className="mt-1 overflow-hidden rounded-2xl border-transparent bg-[#BCE7F0] p-4">
            <CardContent className="p-2">
              <View className="flex-row justify-between">
                {/* Left Column: Details */}
                <View className="justify-between">
                  <View className="flex-row items-center">
                    <View>
                      <Text className="text-gray-600">pH Level</Text>
                      <Text className="text-xl font-medium text-gray-800">{sensorData ? sensorData.ph : '--'}</Text>
                    </View>

                    <Button variant={'ghost'} className='bg-transparent' onPress={() => setIsPHLevelDetailsModalVisible(true)}>
                      <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1" />
                    </Button>
                    <PHLevelDetailsModal
                      visible={isPHLevelDetailsModalVisible}
                      onClose={() => setIsPHLevelDetailsModalVisible(false)}
                    />
                  </View>

                  <View className="flex-row items-center">
                    <View>
                      <Text className="text-gray-600">TDS</Text>
                      <Text className="text-xl font-medium text-gray-800">{sensorData ? `${Math.round(sensorData.tds)} ppm` : '--'}</Text>
                    </View>

                    <Button className='bg-transparent' onPress={() => setIsTDSDetailsModalVisible(true)}>
                    <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1"  />
                    </Button>
                    <TDSDetailsModal
                    visible={isTDSDetailsModalVisible}
                    onClose={() => setIsTDSDetailsModalVisible(false)}
                    />
                  </View>

                  <View className='flex-row items-center'>
                    <View>
                    <Text className="text-gray-600">Turbidity</Text>
                    <Text className="text-xl font-medium text-gray-800">{sensorData ? `${Math.round(sensorData.turbidity)} ` : '--'}</Text>
                  </View>

                    <Button className='bg-transparent' onPress={() => setIsTurbidityDetailsModalVisible(true)}>
                    <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1"  />
                    </Button>
                    <TurbidityDetailsModal
                    visible={isTurbidityDetailsModalVisible}
                    onClose={() => setIsTurbidityDetailsModalVisible(false)}
                    />
                  </View>

                  
                </View>

                {/* Right Column: WATER TANK LEVEL */}
                <View className="items-center">
                  <View className="h-48 w-48 items-center justify-center">
                    <Image
                      source={require('@/assets/images/water-level-bg.png')}
                      className="absolute h-full w-full"
                    />
                    <Text className="text-4xl font-bold text-gray-800">75%</Text>
                    <Text className="text-sm text-gray-600">Water Tank Level</Text>
                  </View>

                  {/* "Safe for Plants" Badge */}
                  <Badge variant="secondary" className="bg-blue-500 dark:bg-blue-600">
                    <Icon as={BadgeCheckIcon} className="text-white" />
                    <Text className="text-white">  {sensorData?.status ?? '--'}</Text>
                  </Badge>
                </View>
              </View>

              {/*  Button */}
              <Button className="mt-4 rounded-lg bg-white/70 hover:bg-muted-foreground/70 active:bg-muted-foreground/80 hover:scale-105 active:scale-95 transition-all duration-200" onPress={() => {router.push('/(tabs)/filtration')}}>
                <Text className="font-semibold text-gray-800">Start Filtration</Text>
              </Button>
            </CardContent>
          </Card>

          {/* ===== Recent Activity Card ===== */}

          <Card className="mt-4 rounded-2xl border border-gray-300 p-5 shadow-sm">
            <CardContent className="p-0">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">Recent Activity</Text>
                <Button variant="link" className="p-0 onPress" onPress={() => {router.push('/water-monitor/recent-activity')}}>
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
         <Pressable onPress={() => {router.push('/tips')}}>
           <View className="relative mt-2 w-full overflow-hidden">
            <Image
              source={require('@/assets/images/need-help-bg.png')}
              className="w-full h-auto min-h-24 sm:min-h-28 md:min-h-32"
              resizeMode="contain"
            />

            <View className="absolute inset-0 items-start justify-center px-6  sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
              <View className="w-full flex-row items-center justify-between gap-2 sm:gap-3 md:gap-4">
                <View className="flex-1 mt-2 sm:mt-3 md:mt-4 px-2 sm:px-3 md:px-4">
                  <Text className="text-xl sm:text-2xl md:text-3xl font-medium" numberOfLines={1} adjustsFontSizeToFit>
                    Need Help?
                  </Text>
                  <Text className="text-base mt-2 sm:text-lg md:text-xl " numberOfLines={2}>
                    Explore tips and suggestions tailored for you.
                  </Text>
                </View>
                <CircleArrowRight color={'#445104'} size={28} className="sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10" />
              </View>
            </View>
          </View>
         </Pressable>

          <View className='mt-4 gap-2 items-center'>
            <View className="flex flex-row items-center justify-between w-full px-2">
                <Text className="text-lg font-semibold text-gray-900">Water pH Level</Text>
                <Button variant="link" className="p-0" onPress={() => setIsPHLevelDetailsModalVisible(true)}>
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
