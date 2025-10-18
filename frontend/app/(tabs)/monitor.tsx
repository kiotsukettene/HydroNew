import { View, ScrollView, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BadgeCheckIcon, Info } from 'lucide-react-native'; // Added Info icon
import { Icon } from '@/components/ui/icon';

export default function Monitor() {
  return (
    <ScrollView>
      <SafeAreaView>
        <View className="p-4">
          {/* ===== Page Header ===== */}
          <PageHeader title="Water Monitoring" />

          {/* ===== Water Quality Card ===== */}
          <Card className="mt-4 overflow-hidden rounded-3xl border-transparent bg-[#E0F2F7] p-6">
            <CardContent className="p-2">
              {/* Top Section: Details and Gauge */}
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
                    <Icon as={Info} color="#059669" size={18} className="ml-2 mt-1" />
                  </View>

                  <View>
                    <Text className="text-gray-600">Turbidity</Text>
                    <Text className="text-xl font-medium text-gray-800">34.5</Text>
                  </View>
                </View>

                {/* Right Column: Gauge and Badge */}
                <View className="items-center">
                  {/* Image container for gauge and overlay text */}
                  <View className="h-44 w-44 items-center justify-center">
                    <Image
                      source={require('@/assets/images/water-level-bg.png')}
                      className="absolute h-full w-full"
                    />
                    {/* Overlay Text */}
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

              {/* Bottom Section: Button */}
              <Button className="mt-4 rounded-lg bg-muted/80">
                <Text className="font-semibold text-gray-800">Start Filtration</Text>
              </Button>
            </CardContent>
          </Card>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
