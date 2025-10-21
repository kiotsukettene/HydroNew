import { View, Image, Dimensions, useWindowDimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/text';

export default function SecondOnboarding() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 items-center bg-primary/10 ">
      <View className="flex-1 w-full items-center justify-center gap-8 px-4">
        {/*  Lottie Animation */}
        <View className="w-full items-center">
          <LottieView
            source={require('@/assets/lotties/Car Battery Energy.json')}
            style={{
              width: Math.min(width * 0.6, height * 0.35),
              height: Math.min(width * 0.6, height * 0.35),
            }}
            autoPlay
          />
        </View>

        {/* Text Content */}
        <View className="w-full items-center gap-4 p-6">
          <View className="gap-4">
          <Text className="text-4xl text-foreground font-finger-paint text-center">
              Microbial Power in Action
            </Text>
            <Label className="text-center text-base font-normal font-poppins ">
              HydroNew uses Microbial Fuel Cells to purify grey wastewater while producing electricity for sustainable hydroponic growth.
            </Label>
          </View>
        </View>
      </View>


      
      
      {/* Hills Background */}
      {/* <Image
        source={require('@/assets/images/onboarding-bg.png')}
        resizeMode="cover"
        className="absolute bottom-0 z-0 w-full"
        style={{
          bottom: -height * 0.17,
          height: Math.max(120, height * 0.9),
        }}
      /> */}

  

    


      <View className="absolute w-full p-8" style={{ bottom: height * 0.05 }}>
        <Link href={'/on-boarding/third-onboarding'} asChild>
        <Button className="w-full ">
          <Text>Next</Text>
        </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
