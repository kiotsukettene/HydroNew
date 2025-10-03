import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Link } from 'expo-router'
import { Label } from '@/components/ui/label'

export default function Login() {
  return (
    <SafeAreaView className='bg-foreground justify-center items-center flex-1'>
           <View>
             <Text>Login</Text>
           </View>

           <Link href={'/(tabs)/home'}>
           <Text> Go to Home</Text>
           </Link>


         </SafeAreaView>
  )
}