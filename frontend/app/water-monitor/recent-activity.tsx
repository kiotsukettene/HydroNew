import { View, SafeAreaView, ScrollView } from 'react-native'
import React from 'react'
import { PageHeader } from '@/components/ui/page-header'
import { Card, CardContent } from '@/components/ui/card'
import { Text } from '@/components/ui/text'

export default function RecentActivity() {
  const activities = [
    {
      id: '1',
      type: 'ph',
      title: 'pH adjusted',
      time: '2 min ago',
      status: 'success',
    },
    {
      id: '2',
      type: 'tds',
      title: 'TDS check',
      time: '15 min ago',
      status: 'neutral',
    },
    {
      id: '3',
      type: 'flow',
      title: 'Flow warning',
      time: '42 min ago',
      status: 'warning',
    },
    {
      id: '4',
      type: 'harvest',
      title: 'Harvest reminder',
      time: 'Today, 08:10',
      status: 'neutral',
    },
  ]




  return (
    <SafeAreaView className='flex-1 bg-background'>
      <PageHeader title="Recent Activity" />
      <ScrollView className='p-4'>
        <View className='relative'>
          {/* Optional timeline connector */}
          <View className='absolute left-4 top-0 bottom-0 w-px bg-muted-foreground/20' />

          <View className='gap-4'>
            {activities.map((item, index) => (
              <View key={item.id} className='flex-row items-stretch'>

                {/* Timeline node */}
                <View className='w-8 items-center'>
                  <View className='h-2.5 w-2.5 rounded-full' />
                </View>

                <View className='flex-1'>
                  <Card className='rounded-2xl border border-gray-200/70 shadow-sm '>
                    <CardContent className='p-2'>
                      <View className='flex-row items-start gap-3'>
                       

                        <View className='flex-1'>
                          <View className='flex-row items-center justify-between'>
                            <Text className='font-semibold text-base'>{item.title}</Text>
                            <View className='flex-row items-center gap-1'>
                              <Text className='text-xs text-muted-foreground'>{item.time}</Text>
                            </View>
                          </View>
                          
                        </View>
                      </View>
                    </CardContent>
                  </Card>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}