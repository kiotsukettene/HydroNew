import { View, Image, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';

import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'expo-router';



const { height: screenHeight } = Dimensions.get('window');

export default function Hydroponics() {
  const router = useRouter()

  const lettuce = [
    {
    id: 'lettuce-1',
    name: 'Lettuce 1',
    setupDate: 'October 22, 2025'
  },
  {
    id: 'lettuce-2',
    name: 'Lettuce 2',
    setupDate: 'November 5, 2025'
  },
  {
    id: 'lettuce-3',
    name: 'Lettuce 3',
    setupDate: 'November 12, 2025'
  },
  {
    id: 'lettuce-4',
    name: 'Lettuce 4',
    setupDate: 'November 19, 2025'
  }
];

  // ==========  Show main hydroponics monitoring screen if setup exists =============
  return (
   <ScrollView className="">
     <SafeAreaView className="flex-1">
      <View className="flex-1  ">
        {/* =========== Page Header =========== */}
        <View className="">
          <PageHeader title="Hydroponics Monitoring" />
          
        </View>
          <View className="mb-2 mt-4 px-6 py-4">
                    <Text className="text-2xl font-bold ">New Crop Setup</Text>
                    <Text className="text-muted-foreground text-base mt-1">Fill in your crop's details to start monitoring</Text>
                  </View>

        

       <Pressable onPress={() => router.push('/hydroponics-monitoring/lettuce-view')}>
       <View className='p-4 sm:p-6 gap-3'>
        {lettuce.map((item) => (
          <View key={item.id} className=''>
             <Card className='border-muted-foreground/20 bg-muted/30 justify-center items-center overflow-hidden relative p-4 sm:p-6'>
         <View className='relative flex flex-row items-center justify-between w-full'>
          <View className='flex-1 pr-4'>
            <Text className='text-xl sm:text-xl font-semibold'>{item.name}</Text>
            <Label className='text-muted-foreground font-normal text-xs'>{item.setupDate}</Label>
          </View>
          <Image 
            source={require('@/assets/images/lettuce-2.png')} 
            className='size-12 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-55' 
            resizeMode="contain"
          />
         </View>
        </Card>
          </View>
        ))}
        
       </View>
       </Pressable>

      </View>
      
    </SafeAreaView>
   </ScrollView>
  );
}
