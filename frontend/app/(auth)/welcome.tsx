import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import { Link } from 'expo-router';

const { height } = Dimensions.get('window');

const WelcomeScreen = () => {
  return (
    <View className="flex-1 bg-foreground">
      {/* Top illustration */}
      <Image
        source={require('@/assets/images/welcome-bg.png')}
        resizeMode="cover"
        style={{ height: height * 3/5, width: '100%' }}
        className="rounded-b-3xl"
      />

      <SafeAreaView className="flex-1 justify-between items-center bg-foreground">
        {/* Text */}
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-3xl font-finger-paint text-center">
            Welcome to <Text className="text-primary">HydroNew</Text>
          </Text>
          <Text className="text-center text-muted text-xs my-1 font-light">
            Sustainable solutions start here — powered by nature and intelligence.
          </Text>
        </View>

        {/* Buttons */}
        <View className="w-full px-6 gap-3 mt-3 mb-6">
          <Link href="/signup" asChild>
            <Button className="bg-primary">
              <Text className="text-foreground text-sm">Get Started</Text>
            </Button>
          </Link>
          <Button variant="outline">
            <Text className="text-sm">Sign in</Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;
