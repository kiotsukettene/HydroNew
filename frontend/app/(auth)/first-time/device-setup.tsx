import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DeviceSetup() {
  return (
    <SafeAreaView className=' bg-foreground justify-center items-center flex-1'>
       <View>
         <Text>Device Setup</Text>
       </View>
     </SafeAreaView>
  )
}