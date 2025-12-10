import { View, ScrollView, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Minus, Plus } from 'lucide-react-native'

export default function Index() {
  const [expandedItems, setExpandedItems] = useState<number[]>([0]) 

  const faqData = [
    {
      question: "What types of plants can I grow in this system?",
answer: "This system is designed exclusively for growing lettuce. It is optimized for various fast-growing, leafy varieties such as Romaine, Butterhead, and Loose-leaf types, which perform best in this hydroponic setup."    },
    {
      question: "Does the UV filter need regular maintenance or replacement?",
      answer: "Yes, the UV filter requires regular maintenance. It should be cleaned monthly and replaced every 6-12 months depending on usage. Regular maintenance ensures optimal water purification and system efficiency."
    },
    {
      question: "What type of wastewater can I use?",
      answer: "The system is designed for greywater, which comes from household activities like showers, sinks, and laundry. Greywater is safer to recycle because it usually contains soaps, mild organic matter, and nutrients that can be treated and reused for hydroponics."
    },
    {
      question: "Can I monitor the system remotely if I'm away from home?",
      answer: "Yes, the system includes remote monitoring capabilities through our mobile app. You can check water quality, pH levels, nutrient concentrations, and system status from anywhere. You'll also receive notifications for any issues that require attention."
    }
  ]

  const toggleExpanded = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    )
  }

  return (
    <ScrollView>
      <SafeAreaView className=' bg-background'>
        <PageHeader title='Help Center'/>

        <View className='items-center'>
          <Text className='text-2xl text-primary mt-7'>How can we help you?</Text>

          <Input placeholder='Type your question here...' className='border-2 border-muted-foreground/30 mt-3'></Input>

        </View>

        <View className='flex flex-row items-center justify-between mt-4'>
            <Text className='font-semibold text-primary text-lg'>Top Questions</Text>
            <Button variant={'link'}>
              <Text className='text-primary'>View All</Text>
            </Button>
          </View>

          <View className='mt-4 space-y-3 gap-5'>
            {faqData.map((item, index) => {
              const isExpanded = expandedItems.includes(index)
              
              return (
                <Card key={index} className=' border border-gray-200 rounded-2xl'>
                  <Pressable onPress={() => toggleExpanded(index)}>
                    <CardContent className='p-4'>
                      <View className='flex-row items-center justify-between'>
                        <Text className='flex-1 font-semibold  text-base pr-3'>
                          {item.question}
                        </Text>
                        {isExpanded ? (
                          <Minus size={20} color='#445104' />
                        ) : (
                          <Plus size={20} color='#445104' />
                        )}
                      </View>
                      
                      {isExpanded && (
                        <View className='mt-3 pt-3 border-t border-muted-foreground/20'>
                          <Text className='text-gray-700 text-sm leading-5'>
                            {item.answer}
                          </Text>
                        </View>
                      )}
                    </CardContent>
                  </Pressable>
                </Card>
              )
            })}
          </View>
      </SafeAreaView>
    </ScrollView>
  )
}