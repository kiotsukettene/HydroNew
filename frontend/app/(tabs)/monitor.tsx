import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Monitor() {
  return (
     <SafeAreaView className=' justify-center items-center flex-1'>
              <View>
                <Text>Monitor</Text>
              </View>
            </SafeAreaView>
  )
}