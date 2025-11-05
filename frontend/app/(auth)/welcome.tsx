import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Link, router } from 'expo-router';
import { Text } from '@/components/ui/text';

const { height } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <View className="flex-1">
      {/* Top illustration */}
      <Image
        source={require('@/assets/images/welcome-bg.png')}
        resizeMode="cover"
        style={{ height: height * 3/5, width: '100%' }}
        className="rounded-b-3xl"
      />

      <SafeAreaView className="flex-1 justify-between items-center ">
        {/* Text */}
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-5xl  font-finger-paint text-center">
            Welcome to <Text className=" text-5xl text-primary">HydroNew</Text>
          </Text>
          <Text className="text-center text-muted-foreground text-base my-2 ">
            Sustainable solutions start here — powered by nature and intelligence.
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full px-6 gap-3 mt-3 mb-6">
          <Link href="/signup" asChild>
            <Button className="bg-primary">
              <Text className=" text-base">Get Started</Text>
            </Button>
          </Link>

          <Button
            variant="outline"
            onPress={() => router.replace("/login")}
          >
            <Text className="text-base">Sign in</Text>
          </Button>

        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
