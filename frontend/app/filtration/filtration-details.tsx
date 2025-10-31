import { View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'

export default function FiltrationDetails() {
    
    const stageDetails = [
        {
                stage:1,
                status:"Completed",
                description:"Water Process.",
        },
        {
                stage:2,
                status:"Completed", 
                description:"Good Water Clarity.",
        },
        {
                stage:3,
                status:"In Progress",
                description:"Water Disinfected.",
        },
        {
                stage:4,
                status:"Not Started",
                description:"Water Safe for Plants.",
        }
    ]
  return (
    <SafeAreaView>
        <View className=''>
            <PageHeader title="Filtration Details" showNotificationButton={false} />
        </View>

        <View className='p-4 mt-4'>
            <Text className='text-3xl text-secondary items-center text-center font-semibold'> Water is now ready for hydroponic use!</Text>
        </View>

        <View className='p-6 mt-4'>
            {stageDetails.map((item) => (
                <View key={item.stage} className='mb-6 p-4 border border-muted-foreground/20 rounded-xl shadow-sm'>
                    <Text className='text-lg font-medium mb-2'>Stage {item.stage}: {item.status}</Text>
                    <Text className='text-muted-foreground'>{item.description}</Text>
                </View>
            ))}
        </View>
    </SafeAreaView>
  )
}