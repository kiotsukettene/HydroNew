import { View, StyleSheet, BackHandler, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useRouter, useFocusEffect } from 'expo-router'
import { Stack } from 'expo-router'
import { toast } from 'sonner-native'
import { subscribeMessage } from '@/service/mqtt.client'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuthStore } from '@/store/auth/authStore'
import { useTreatmentStore } from '@/store/treatment/treatmentStore'


export default function PumpScreen() {
  const router = useRouter()
  const userId = useAuthStore((state) => state.user?.id);
  const { stopPump2: apiTogglePump2 } = useTreatmentStore();
  const [deviceSerial, setDeviceSerial] = useState('');
  const [isWaitingForStopAck, setIsWaitingForStopAck] = useState(false);

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

  // Subscribe to pump state - auto navigate back when pump stops (state = 0)
  useEffect(() => {
    if (!deviceSerial) return;
    
    const stateTopic = `hydroponics/${deviceSerial}/pump/2/state`;
    console.log(`[PumpScreen] Subscribing to state topic: ${stateTopic}`);
    
    const unsubscribe = subscribeMessage(stateTopic, (_t, payload) => {
      const value = payload.toString().trim();
      const isRunning = value === '1';
      console.log(`[PumpScreen] Pump 2 state: ${isRunning ? 'ON' : 'OFF'} (${value})`);
      
      // If pump stopped (automatic or manual), navigate back
      if (!isRunning) {
        console.log('[PumpScreen] Pump stopped - navigating back to lettuce view');
        setIsWaitingForStopAck(false);
        toast.success('Pumping completed successfully!');
        router.back();
      }
    }, 1);
    
    return () => {
      console.log('[PumpScreen] Cleaning up MQTT subscription');
      unsubscribe();
    };
  }, [deviceSerial, router]);

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

  const handleStopPump = async () => {
    if (!deviceSerial) {
      toast.error('Device not found');
      return;
    }
    
    console.log('[PumpScreen] Calling API to stop pump (toggle with 0 liters)');
    setIsWaitingForStopAck(true);
    
    // Call API to stop pump - send 0 liters to signal stop
    const success = await apiTogglePump2();
    
    if (!success) {
      setIsWaitingForStopAck(false);
      toast.error('Failed to stop pump');
      return;
    }
    
    console.log('[PumpScreen] API call successful, waiting for MQTT state = 0...');
    // Keep waiting state - MQTT subscription will handle navigation when state = 0
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
              className={`w-full border border-muted ${isWaitingForStopAck ? 'opacity-50' : ''}`}
              onPress={handleStopPump}
              disabled={isWaitingForStopAck}
            >
              <Text className="font-semibold text-muted text-base">
                {isWaitingForStopAck ? 'Stopping...' : 'Stop Pump'}
              </Text>
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