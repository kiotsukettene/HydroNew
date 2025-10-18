import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SecuritySetting() {
  return (
     <SafeAreaView className=' justify-center items-center flex-1'>
              <View>
                <Text>Security Setting</Text>
              </View>
            </SafeAreaView>
  )
}