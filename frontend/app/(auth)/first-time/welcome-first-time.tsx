import { View, Text, Image, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const { height } = Dimensions.get('window');

export default function WelcomeFirstTime() {
  return (
    <SafeAreaView className="flex-1 items-center  bg-[#1D6143]">


      {/* Hills image as background */}
      <Image
        source={require('@/assets/images/welcome-bg-2.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: Math.max(120, height * 0.3),

          zIndex: 0, // stays behind the card
        }}
      />

      <Image
        source={require('@/assets/images/welcome-bg-3.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 190,
          width: '100%',
          height: Math.max(140, height * 0.5),
        }}
      />

      <Image
        source={require('@/assets/images/welcome-leaf-2.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 100,
          left: 20,
          width: '20%',
          height: Math.max(90, height * 0.1),
        }}
      />

      <Image
        source={require('@/assets/images/welcome-leaf-2.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 170,
          right: 20,
          width: '10%',
          height: Math.max(50, height * 0.05),
        }}
      />

      <Image
        source={require('@/assets/images/welcome-leaf-icon.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          top: 272,
          width: '50%',
          height: Math.max(120, height * 0.4),
        }}
      />


<View className='p-4 mt-16 items-center gap-8 '>
  
      <View className="gap-4">
        <Text className="text-4xl text-center font-bold text-muted">Welcome to HydroNew, Momo!</Text>
        <Label className="font-normal text-lg text-center text-yellow-50/40">
          Let’s start nurturing smarter and greener farming together.
        </Label>
      </View>

    
 
</View>

 <View className='w-full p-8 absolute bottom-20 '>
       <Button className=' bg-muted'>
        <Label className=" text-primary font-semibold">Get Started</Label>
      </Button>
     </View>

    </SafeAreaView>
  );
}
