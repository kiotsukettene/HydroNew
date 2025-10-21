import { View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Plus, Wifi, Smartphone } from 'lucide-react-native';
import { Card } from '@/components/ui/card';

interface NoSetupProps {
  onToggleSetup?: () => void;
}

export default function NoSetup({ onToggleSetup }: NoSetupProps) {
  const router = useRouter();
  
  const handleAddDevice = () => {
    // Navigate to hydroponics setup screen using Expo Router
    router.push('/hydroponics-monitoring/hydroponics-setup');
  };
  
  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1">
        {/* =========== Page Header =========== */}
        <View className="">
          <PageHeader title="Hydroponics Setup" />
        </View>

        {/* =========== Empty State Section =========== */}
        <View className="flex-1 px-4 md:px-8 py-4 md:py-6 rounded-b-3xl md:rounded-b-[40px]">
          <View className="items-center justify-center flex-1">
            {/* Responsive Image */}
            <View className="mb-6">
              <Image 
                source={require('@/assets/images/no-plants-icon.png')} 
                className="w-32 h-32 md:w-48 md:h-48 opacity-50"
                resizeMode="contain"
              />
            </View>

            {/* Responsive Text */}
            <Text className="text-2xl md:text-3xl font-bold text-primary mb-3 text-center leading-8 md:leading-10">
              No Hydroponics Setup
            </Text>
            
            <Text className="text-center text-gray-600 dark:text-gray-300 mb-6 text-base md:text-lg leading-6 md:leading-7 px-4 md:px-8 max-w-lg">
              Connect your hydroponics device to start monitoring your plants
            </Text>
            
            {/* Responsive Button */}
            <Button 
              className="w-full md:w-80 mb-6 py-3 md:py-4"
              onPress={handleAddDevice}
            >
              <Icon as={Plus} className="text-muted" />
              <Text className="ml-2 font-semibold text-base md:text-lg">
                Add Plants
              </Text>
            </Button>
          </View>
             
          {/* =========== Setup Instructions =========== */}
          <Card className="px-4 md:px-8 py-4 md:py-6 mx-0 md:mx-0 border-muted-foreground/50">
            <Text className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
              How to Get Started
            </Text>
            
            <View className="space-y-4">
              {/* Step 1 */}
              <View className="flex-row items-start">
                <View className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary items-center justify-center mr-3 mt-1">
                  <Text className="text-white font-bold text-xs md:text-sm">
                    1
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 dark:text-gray-200 font-medium mb-1 text-base md:text-lg">
                    Connect Your Device
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Make sure your hydroponics device is powered on and connected to WiFi
                  </Text>
                </View>
                <Icon 
                  as={Wifi} 
                  size={16} 
                  className="text-gray-500 mt-1 md:w-5 md:h-5" 
                />
              </View>

              {/* Step 2 */}
              <View className="flex-row items-start">
                <View className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary items-center justify-center mr-3 mt-1">
                  <Text className="text-white font-bold text-xs md:text-sm">
                    2
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-gray-800 dark:text-gray-200 font-medium mb-1 text-base md:text-lg">
                    Pair with App
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    Use the device's QR code or manual pairing to connect
                  </Text>
                </View>
                <Icon 
                  as={Smartphone} 
                  size={16} 
                  className="text-gray-500 mt-1 md:w-5 md:h-5" 
                />
              </View>
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
