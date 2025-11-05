import { View, StyleSheet, BackHandler, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native'
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useRouter, useFocusEffect } from 'expo-router'
import { Stack } from 'expo-router'
import { toast } from 'sonner-native'

export default function PumpScreen() {
  const router = useRouter()
  

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
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success('Pumping completed successfully!')
      router.back()
    }, 7000) 

    return () => clearTimeout(timer)
  }, [router])

  const handleStopPump = () => {
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