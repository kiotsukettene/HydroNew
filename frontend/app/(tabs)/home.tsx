import { View, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import {
  ArrowRightIcon,
  BellIcon,
  ChartColumn,
  History,
  Leaf,

} from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

import type { HomeProps } from '@/types/home';
import { useRouter } from 'expo-router';

export default function Home({ waterQuality, growth }: HomeProps) {

  const router = useRouter()
  
  //  Temporary mock data 
  waterQuality = waterQuality || {
    pHLevel: 6.5,
    status: 'Good',
    level: 'Low',
  };

  growth = growth || {
    percentage: 45,
  };

  return (
    <ScrollView>
      <SafeAreaView>
        <View className="p-4">

          
          {/* ===== Page Header ===== */}
          <View className="flex-row items-center justify-between pt-2">
            <View>
              <Text className="text-base text-foreground/70">Hello,</Text>
              <Text className="text-2xl font-semibold text-foreground/80">Momo!</Text>
            </View>
            <Button variant={'ghost'} onPress={() => router.push('/notifications')}>
              <BellIcon size={22} strokeWidth={3} color={'#445104'} />
            </Button>
          </View>

          {/* ===== Main Content ===== */}
          <View className="mt-5">
            {/* ===== Water Quality Card ===== */}
            <Card className="relative h-60 overflow-hidden rounded-2xl border-0 p-0">
              <Image
                source={require('@/assets/images/home-bg.png')}
                className="absolute inset-0 h-full w-full"
                resizeMode="cover"
              />

              {/* pH Level */}
              <View className="absolute left-6 top-9 z-10">
                <Text className="text-5xl font-bold text-[#2D7D7D]">
                  {waterQuality.pHLevel}
                </Text>
                <Text className="text-lg font-semibold text-foreground/70">pH Level</Text>
              </View>

              {/* Water Info */}
              <CardContent className="absolute bottom-4 left-9 z-10 rounded-lg bg-primary/20 px-10 py-3">
                <View className="flex-row gap-16">
                  <View>
                    <Text className="mb-1 text-base font-medium text-[#2e470e]">
                      Water Status
                    </Text>
                    <View className="rounded-full bg-yellow-100 px-3 py-1">
                      <Text className="text-center text-sm font-medium">
                        {waterQuality.status}
                      </Text>
                    </View>
                  </View>

                  <View>
                    <Text className="mb-1 text-base font-medium text-[#2e470e]">
                      Water Level
                    </Text>
                    <View className="rounded-full bg-yellow-100 px-3 py-1">
                      <Text className="text-center text-sm font-medium">
                        {waterQuality.level}
                      </Text>
                    </View>
                  </View>
                </View>
              </CardContent>
            </Card>

            {/* ===== Growth Card ===== */}
            <View className="mt-5">
              <TouchableOpacity className="relative h-32 justify-between overflow-hidden rounded-2xl bg-primary p-6" onPress={() => router.push('/(tabs)/hydroponics')}>
                <Image
                  source={require('@/assets/images/growth-bg.png')}
                  className="absolute -right-16 -top-10 h-64 w-64 opacity-70"
                  resizeMode="contain"
                />

                <View>
                  <Text className="items-center text-lg text-lime-100">
                    Lettuce growth progress
                  </Text>
                  <Text className="mt-1 text-4xl font-bold text-muted">
                    {growth.percentage}% <ArrowRightIcon size={20} color="#D9F99D" />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* ===== Quick Actions ===== */}
            <View className="mt-6 sm:mt-7 md:mt-8">
              <Text className="px-2 text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Quick Actions</Text>

              <View className="mt-3 sm:mt-4 md:mt-5 flex-row gap-2 sm:gap-3 md:gap-4">
                <Pressable onPress={() => {router.push('/(tabs)/hydroponics')}} className='relative flex-1 justify-between overflow-hidden rounded-2xl bg-green-50 p-4 sm:p-5 md:p-6 min-h-24 sm:min-h-28 md:min-h-32'>
                  <Leaf color={'#15803D'} strokeWidth={2} size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  <View>
                    <Text className="text-lg sm:text-xl md:text-2xl font-semibold text-green-900">Plant</Text>
                    <Text className="text-lg sm:text-xl md:text-2xl font-semibold text-green-900">Status</Text>
                  </View>
                </Pressable>

                <View className="gap-2 sm:gap-3 md:gap-4">
                  <Pressable onPress={() => router.push('/history')} className="rounded-2xl bg-blue-50 p-4 sm:p-5 md:p-6 min-h-20 sm:min-h-24 md:min-h-28">
                    <History color={'#1E40AF'} strokeWidth={2} size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    <Text className="text-sm sm:text-base md:text-lg font-semibold text-blue-900">
                      History
                    </Text>
                  </Pressable>

                  <Pressable onPress={() => {router.push('/report-analytics')}}  className="flex-1 justify-between rounded-2xl bg-yellow-50 p-4 sm:p-5 md:p-6 min-h-20 sm:min-h-24 md:min-h-28">
                    <ChartColumn color={'#B45309'} strokeWidth={2} size={24} className="sm:w-7 sm:h-7 md:w-8 md:h-8" />
                    <View>
                      <Text className="text-sm sm:text-base md:text-lg font-semibold text-yellow-900">
                        Report and Analytics
                      </Text>
                    </View>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
