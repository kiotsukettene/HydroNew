import { View, ScrollView, Image, Pressable } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowUpIcon, BadgeCheckIcon, CircleArrowRight, Info } from 'lucide-react-native'; // Added Info icon
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import TDSDetailsModal from '../water-monitor/tds-details';
import PHLevelDetailsModal from '../water-monitor/ph-level-details';
import { router } from 'expo-router';

export default function Monitor() {

  const [isTDSDetailsModalVisible, setIsTDSDetailsModalVisible] = useState(false);
  const [isPHLevelDetailsModalVisible, setIsPHLevelDetailsModalVisible] = useState(false);


  const recentActivities = [
    { id: '1', description: 'Water pH adjusted', time: '8:00 AM' },
    { id: '2', description: 'Filtration completed', time: '9:15 AM' },
  ];
  return (
    <ScrollView>
      <SafeAreaView className='p-4'>
        <View className="">
          
          {/* ===== Page Header ===== */}
          <PageHeader title="Water Monitoring" />

          {/* ===== Water Quality Card ===== */}
          <Card className="mt-4 overflow-hidden rounded-2xl border-transparent bg-[#BCE7F0] p-4">
            <CardContent className="p-2">
              <View className="flex-row justify-between">
                {/* Left Column: Details */}
                <View className="justify-between">
                  <View>
                    <Text className="text-gray-600">pH Level</Text>
                    <Text className="text-xl font-medium text-gray-800">5.5</Text>
                  </View>

                  <View className="flex-row items-center">
                    <View>
                      <Text className="text-gray-600">TDS</Text>
                      <Text className="text-xl font-medium text-gray-800">600 ppm</Text>
                    </View>

                    <Button variant={'ghost'} onPress={() => setIsTDSDetailsModalVisible(true)}>
                    <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1"  />
                    </Button>
                    <TDSDetailsModal
                    visible={isTDSDetailsModalVisible}
                    onClose={() => setIsTDSDetailsModalVisible(false)}
                    />
                  </View>

                  <View>
                    <Text className="text-gray-600">Turbidity</Text>
                    <Text className="text-xl font-medium text-gray-800">34.5</Text>
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
                    <Text className="text-white">Safe for plants</Text>
                  </Badge>
                </View>
              </View>

              {/*  Button */}
              <Button className="mt-4 rounded-lg bg-muted/70">
                <Text className="font-semibold text-gray-800">Start Filtration</Text>
              </Button>
            </CardContent>
          </Card>

          {/* ===== Recent Activity Card ===== */}

          <Card className="mt-4 rounded-2xl border border-gray-300 p-5 shadow-sm">
            <CardContent className="p-0">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-semibold text-gray-900">Recent Activity</Text>
                <Button variant="link" className="p-0">
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
         <Pressable onPress={() => {router.push('/help-center')}}>
           <View className="relative mt-3 w-full overflow-hidden">
            <Image
              source={require('@/assets/images/need-help-bg.png')}
              className="w-full"
              resizeMode="contain"
            />

            <View className="absolute inset-0 items-start justify-center px-6 py-8">
              <View className="w-full flex-row items-center justify-between gap-3">
                <View className="flex-1 mt-4">
                  <Text className="text-xl font-medium" numberOfLines={1} adjustsFontSizeToFit>
                    Need Help?
                  </Text>
                  <Text className=" text-foreground/50" numberOfLines={2}>
                    Explore tips and suggestions tailored for you.
                  </Text>
                </View>
                <CircleArrowRight color={'#445104'} size={36} />
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
              <Image
              source={require('@/assets/images/ph-level-indicator.png')} 
                className="w-full"
                resizeMode="contain"
              />
            </View>

        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
