import { View, Image, Dimensions, useWindowDimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/text';

export default function ThirdOnboarding() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 items-center bg-primary/10">
      <View className="w-full flex-1 items-center justify-center gap-8 px-4">
        {/*  Lottie Animation */}
        <View className="w-full items-center">
          <LottieView
            source={require('@/assets/lotties/Sync Data.json')}
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
            <Text className="text-center font-finger-paint text-4xl">Real-Time Monitoring</Text>
            <Label className="text-center font-poppins text-base font-normal">
              Stay connected to your hydroponic system — monitor pH, water quality, and energy
              output anytime, anywhere
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
        <Link href={'/on-boarding/fourth-onboarding'} asChild>
          <Button className="w-full">
            <Text>Next</Text>
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}
