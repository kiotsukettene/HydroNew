import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Scanning() {
  return (
     <SafeAreaView className=' bg-foreground justify-center items-center flex-1'>
        <View>
          <Text>Scanning</Text>
        </View>
      </SafeAreaView>
  )
}