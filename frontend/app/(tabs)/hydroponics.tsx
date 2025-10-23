import { View, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import NoSetup from '@/app/hydroponics-monitoring/no-setup';

const { height: screenHeight } = Dimensions.get('window');

interface LettuceItem {
  id: string;
  name: string;
  setupDate: string;
}

export default function Hydroponics() {
  const router = useRouter();

  const lettuce: LettuceItem[] = [
 
    {
      id: 'lettuce-1',
      name: 'Lettuce 1',
      setupDate: 'October 22, 2025',
    },
    {
      id: 'lettuce-2',
      name: 'Lettuce 2',
      setupDate: 'November 5, 2025',
    },
    {
      id: 'lettuce-3',
      name: 'Lettuce 3',
      setupDate: 'November 12, 2025',
    },
    {
      id: 'lettuce-4',
      name: 'Lettuce 4',
      setupDate: 'November 19, 2025',
    },
  ];

  // ==========  Show NoSetup component if no lettuce added =============
  
  // If walang lettuce naka add, show the NoSetup component
  if (lettuce.length === 0) {
    return <NoSetup />;
  }

  // ================ Main Render ==================
  return (
    <SafeAreaView className="relative flex-1">
      <Image
        source={require('@/assets/images/list-bg.png')}
        className="absolute w-full"
        style={{ top: 0, height: 300 }}
      />

      {/* ===== Page Header ===== */}

      <View className="relative z-10">
        <PageHeader title="Hydroponics Monitoring" />
      </View>

      {/* ===== Main Content ===== */}
      <View className="relative flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="relative z-10 mt-36">
            <Card className="rounded-t-3xl border-transparent sm:p-6">
              <View className="mb-2 mt-4 px-6">
                <Text className="text-2xl font-bold">My Plants</Text>
                <Text className="mt-1 text-base text-muted-foreground">
                  Add and Select your hydroponic plants to monitor their growth and health.
                </Text>

                <Button className='mt-4 ' onPress={() => router.push('/hydroponics-monitoring/hydroponics-setup')}>
                  <Text>Add New Plant</Text>
                </Button>

                   <Pressable onPress={() => router.push('/hydroponics-monitoring/lettuce-view')} className="mt-4">
            <View className="gap-3 sm:p-6">
              {lettuce.map((item) => (
                <View key={item.id} className="">
                  <Card className="relative items-center justify-center overflow-hidden border-muted-foreground/50 bg-muted/30 py-8 px-6 sm:p-6">
                    <View className="relative flex w-full flex-row items-center justify-between">
                      <View className="flex-1 pr-4">
                        <Text className="text-xl font-semibold sm:text-xl">{item.name}</Text>
                        <Label className="text-xs font-normal text-muted-foreground">
                          {item.setupDate}
                        </Label>
                      </View>
                      <Image
                        source={require('@/assets/images/lettuce-2.png')}
                        className="size-12 opacity-55 sm:h-20 sm:w-20 md:h-24 md:w-24"
                        resizeMode="contain"
                      />
                    </View>
                  </Card>
                </View>
              ))}
            </View>
          </Pressable>
              </View>
            </Card>
          </View>

       
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
