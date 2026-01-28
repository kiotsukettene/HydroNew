import { View, StyleSheet, BackHandler, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useRouter, useFocusEffect } from 'expo-router'
import { Stack } from 'expo-router'
import { toast } from 'sonner-native'
import { publishMessage } from '@/service/mqtt.client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthStore } from '@/store/auth/authStore'


export default function PumpScreen() {
  const router = useRouter()
  const userId = useAuthStore((state) => state.user?.id);
  const [deviceSerial, setDeviceSerial] = useState('');

  useEffect(() => {
    const getDeviceSerial = async () => {
      if (!userId) return;

      try {
        const storageKey = `paired_device:${userId}`;
        const deviceData = await AsyncStorage.getItem(storageKey);
        if (deviceData) {
          const device = JSON.parse(deviceData);
          setDeviceSerial(device.serial_number);
        }
      } catch (error) {
        console.error("Failed to retrieve device serial:", error);
      }
    };
    getDeviceSerial();
  },[userId]);

  // Prevent back navigation
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        return true
      }

      if (Platform.OS === 'android') {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress)
        
        return () => backHandler.remove()
      }
    }, [])
  )

  // Auto navigate back after 7 seconds (for testing lang)

  const handleStopPump = () => {
    publishMessage(`hydroponics/${deviceSerial}/pump/1`, 'CLOSE', 1);
    console.log(`Published message to hydroponics/${deviceSerial}/pump/1`);
    // Navigate back to previous screen
    toast.success('Pumping completed successfully!')
    router.back()
  }

  return (
    <>
      <Stack.Screen 
        options={{ 
          gestureEnabled: false, // Disable swipe back gesture
          headerShown: false,
        }} 
      />
      <SafeAreaView className="flex-1 bg-primary">
        <View className="flex-1 items-center justify-center px-6">
        

          {/* Lottie Animation */}
          <View className="items-center justify-center ">
            <LottieView
              source={require('@/assets/lotties/Drop water.json')}
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>

          <Text className="text-3xl font-bold text-muted text-center items-center mb-3">Pumping Water...</Text>

          {/* Subtext */}
          <Text className="text-base text-muted mb-16 text-center">
            Delivering water to your lettuce...
          </Text>

          {/* Stop Pump Button */}
          <View className="absolute bottom-8 left-6 right-6">
            <Button
              className="w-full border border-muted"
              onPress={handleStopPump}
            >
              <Text className="font-semibold text-muted text-base">Stop Pump</Text>
            </Button>
          </View>
        </View>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
  },
})