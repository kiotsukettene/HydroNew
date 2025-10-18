import { View, Image, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowRightIcon, BellIcon, ChartColumn, Leaf, Smartphone } from 'lucide-react-native';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';

export default function Home() {
  return (
   <ScrollView>
     <SafeAreaView>
      <View className="p-4">
        {/* ===== Custom Header ===== */}
        <View className="flex-row items-center justify-between pt-5">
          <View className="">
            <Text className="text-base text-foreground/70">Hello,</Text>
            <Text className="text-2xl font-semibold text-foreground/80">Momo!</Text>
          </View>
          {/* ===== Notifications ===== */}
          <Button variant={'ghost'} className="">
            <BellIcon size={22} strokeWidth={3} color={'#445104'} />
          </Button>
        </View>

        {/* ================================== Main Content ================================== */}
        <View className="mt-5">
          {/* ===== Main Water Quality Card ===== */}
          <Card className="relative h-60 overflow-hidden rounded-xl border-0 p-0">
            {/* Background Image */}
            <Image
              source={require('@/assets/images/home-bg.png')}
              className="absolute inset-0 h-full w-full"
              resizeMode="cover"
            />

            {/* pH Level  */}
            <View className="absolute left-6 top-9 z-10">
              <Text className="text-5xl font-bold text-[#2D7D7D]">6.5</Text>
              <Text className="text-lg font-semibold text-foreground/70">pH Level</Text>
            </View>

            {/* Water Info  */}
            <CardContent className="absolute bottom-4 left-9 z-10 rounded-lg bg-primary/20 p-0 px-10 py-3">
              <View className="flex-row gap-16 space-x-3">
                <View>
                  <Text className="mb-1 text-base font-medium text-[#2e470e]">Water Status</Text>
                  <View className="rounded-full bg-yellow-100 px-3 py-1">
                    <Text className="text-center text-sm font-medium">Good</Text>
                  </View>
                </View>

                <View>
                  <Text className="mb-1 text-base font-medium text-[#2e470e]">Water Level</Text>
                  <View className="rounded-full bg-yellow-100 px-3 py-1">
                    <Text className="text-center text-sm font-medium">Low</Text>
                  </View>
                </View>
              </View>
            </CardContent>
          </Card>

          {/* ===== Lettuce Growth Card ===== */}
          <View className="mt-5">
            <TouchableOpacity className="relative h-32 justify-between overflow-hidden rounded-2xl bg-primary p-6">
              <Image
                source={require('@/assets/images/growth-bg.png')}
                className="absolute -right-16 -top-10 h-64 w-64 opacity-70"
                resizeMode="contain"
              />

              <View>
                <Text className="items-center text-lg text-lime-100">Lettuce growth progress</Text>
                <Text className="mt-1 text-4xl font-bold text-muted">
                  45% <ArrowRightIcon size={20} color="#D9F99D" />{' '}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* ===== Quick Actions ===== */}
          <View className="mt-5">
  <Text className="text-xl font-bold text-gray-800 mb-1">Quick Actions</Text>

  <View className="mt-3 flex-row gap-3">

    {/* Left Card - Plant Status */}
    <View className="flex-1 bg-green-50 rounded-3xl p-4 justify-between  relative overflow-hidden">
     
      <Leaf color={'#15803D'} strokeWidth={2} size={28} />
      <View>
        <Text className="text-green-900 font-semibold text-xl">Plant</Text>
        <Text className="text-green-900 font-semibold text-xl">Status</Text>
      </View>
    </View>

    {/* Right Column */}
    <View className=" gap-3">

      {/* Connected Devices */}
      <View className=" bg-blue-50 rounded-3xl p-4 ">
        <Smartphone color={'#1E40AF'} strokeWidth={2} size={28} />
        <Text className="text-blue-900 font-semibold text-base">Connected Devices</Text>
      </View>

      {/* Report and Analytics */}
      <View className="flex-1 bg-yellow-50 rounded-3xl p-4 justify-between">
        <ChartColumn color={'#B45309'} strokeWidth={2} size={28} />
        <View>
          <Text className="text-yellow-900 font-semibold text-base">Report and Analytics</Text>
        </View>
      </View>

    </View>
  </View>
</View>
        </View>
      </View>
    </SafeAreaView>
   </ScrollView>
  );
}
