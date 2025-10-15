import { View, Text, Image, Dimensions, useWindowDimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import LottieView from 'lottie-react-native';
import { Link } from 'expo-router';

export default function FirstOnboarding() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView className="flex-1 items-center bg-[#1D6143] ">
      {/* Hills Background */}
      <Image
        source={require('@/assets/images/onboarding-bg.png')}
        resizeMode="cover"
        className="absolute bottom-0 z-0 w-full"
        style={{
          bottom: -height * 0.17,
          height: Math.max(120, height * 0.9),
        }}
      />

      <Image
        source={require('@/assets/images/welcome-leaf-2.png')}
        className="absolute size-24"
        style={{
          left: width * 0.05,
          top: height * 0.12,  
          resizeMode: 'contain',
        }}
      />

     
      <Image
        source={require('@/assets/images/welcome-leaf-2.png')}
        className="absolute size-16"
        style={{
          right: width * 0.05,
          top: height * 0.2,
          resizeMode: 'contain',
        }}
      />

      {/*  Lottie Animation */}
      <View
        className="absolute w-full items-center "
         style={{
    bottom: height * 0.22, 
  }}
      >
        <LottieView
          source={require('@/assets/lotties/Growing Plant.json')}
          autoPlay
          style={{
            width: Math.min(width * 0.6, height * 0.35),
            height: Math.min(width * 0.6, height * 0.35),
          }}
        />
      </View>
      {/* 6. Text Content */}
      <View className="w-full items-center gap-8 mt-20 p-4" >
        <View className="gap-4">
          <Text className="text-center text-4xl font-bold text-muted dark:text-foreground">
            Welcome to HydroNew, Momo!
          </Text>
          <Label className="text-center text-lg font-normal text-yellow-50/40">
            Let’s start nurturing smarter and greener farming together.
          </Label>
        </View>
      </View>

      {/* 7. Button Wrapper */}
      <View className="absolute w-full p-8" style={{ bottom: height * 0.05 }}>
        <Link href={'/on-boarding/second-onboarding'} asChild>
        <Button className="w-full bg-muted dark:bg-foreground">
          <Label className="font-semibold text-primary">Next</Label>
          
        </Button>
        </Link>


      </View>

      
    </SafeAreaView>
  );
}
