import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function CreateNewPassword() {
  return (
    <SafeAreaView className='justify-center items-center flex-1'>
       <View>
         <Text>Create New Password</Text>
       </View>
     </SafeAreaView>
  )
}