import React from 'react';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-foreground">
      {/* Top illustration - full width, no top safe-area padding */}
      <Image
        source={require('@/assets/images/welcome-bg.png')}
        resizeMode="cover"
        className="h-[380px] w-full rounded-b-3xl"
      />

      {/* Rest of content respects bottom safe-area only */}
     <SafeAreaView className=' bg-foreground justify-center items-center flex-1 '>
        <View className="flex-[0.8] items-center px-9 justify-center">
          <Text className="mb-2 mt-1 text-center text-3xl font-finger-paint">
            Welcome to <Text className='font-finger-paint text-primary'>HydroNew</Text>
            </Text>
          <Text className="text-center text-muted text-xs font-light">
            Sustainable solutions start here — powered by nature and intelligence.
          </Text>
        </View>

        <View className="px-6 py-2 mt-4 w-full gap-2">
          <Button className="bg-primary">
            <Text className="text-foreground">Get Started</Text>
          </Button>

          <Button variant="outline">
            <Text>Sign in</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
