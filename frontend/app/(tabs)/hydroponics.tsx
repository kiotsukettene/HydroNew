import { View, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';
import FolderBg from '@/components/ui/folder-bg';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Droplet } from 'lucide-react-native';

// Import the no-setup component
import NoSetup from '@/app/hydroponics-monitoring/no-setup';

const { height: screenHeight } = Dimensions.get('window');

export default function Hydroponics() {
  // State to track if hydroponics setup exists
  const [hasHydroponicsSetup, setHasHydroponicsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate checking for hydroponics setup
  useEffect(() => {
    // TODO: Replace this with actual API call to check if user has hydroponics setup
    // For now, we'll simulate a check that returns false (no setup)
    const checkHydroponicsSetup = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // TODO: Replace with actual API call
        // const response = await fetch('/api/hydroponics-setup');
        // const data = await response.json();
        // setHasHydroponicsSetup(data.hasSetup);
        
        // For demonstration, set to false to show no-setup screen
        // Change this to true to test the main hydroponics screen
        setHasHydroponicsSetup(false);
      } catch (error) {
        console.error('Error checking hydroponics setup:', error);
        setHasHydroponicsSetup(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkHydroponicsSetup();
  }, []);

  // Function to toggle setup state (for testing purposes)
  const toggleSetupState = () => {
    setHasHydroponicsSetup(!hasHydroponicsSetup);
  };

  // Show loading state while checking setup
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show no-setup screen if no hydroponics setup exists
  if (!hasHydroponicsSetup) {
    return <NoSetup onToggleSetup={toggleSetupState} />;
  }

  // Show main hydroponics monitoring screen if setup exists
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
      
      {/* Debug button - remove this in production */}
      <Button 
        variant="outline" 
        className="w-full rounded-xl border-red-200 mt-2"
        onPress={toggleSetupState}
      >
        <Text className="text-red-200">Debug: Toggle Setup State</Text>
      </Button>
    </View>
  </View>
</FolderBg>
        </View>
      </View>
      
    </SafeAreaView>
  );
}
