import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';
import FolderBg from '@/components/ui/folder-bg';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Droplet } from 'lucide-react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function Hydroponics() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* =========== Page Header =========== */}
        <View className="relative z-10 bg-[#E7F5EA] dark:bg-[#1A3D1F]">
          <PageHeader title="Hydroponics Monitoring" />
        </View>

        {/* =========== Plant Section =========== */}
        <View
          className="bg-[#E7F5EA] dark:bg-[#1A3D1F]"
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <View className="items-center justify-center py-8">
            <Image source={require('@/assets/images/lettuce.png')} />
          </View>
        </View>

        {/* =========== Folder Section =========== */}
        <View className="flex-1 px-4 pt-5">
         <FolderBg>
  <View className="flex-1 justify-between p-4">
    <View>
      <Text className="mb-4 text-xl font-bold text-white">My Lettuce</Text>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">10 Days</Text>
          <Text className="text-xs text-lime-200">PLANT AGE</Text>

          <Text className="mt-1 text-xl font-bold text-white">41 %</Text>
          <Text className="text-xs text-lime-200">HUMIDITY</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xl font-bold text-white">18 Days</Text>
          <Text className="text-xs text-lime-200">ESTIMATED DAYS LEFT</Text>

          <Text className="mt-1 text-xl font-bold text-white">80 %</Text>
          <Text className="text-xs text-lime-200">WATER TANK AVAILABLE</Text>
        </View>
      </View>
    </View>

    <View className="items-center mt-7">
      <Button className="w-full rounded-xl bg-emerald-50 ">
        <Icon as={Droplet} className="text-primary" />
        <Text className="ml-2  text-primary">Start Pump</Text>
      </Button>
    </View>
  </View>
</FolderBg>
        </View>
      </View>
      
    </SafeAreaView>
  );
}
