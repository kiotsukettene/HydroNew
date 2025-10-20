import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ArrowLeft } from 'lucide-react-native'

export default function FAQ() {
  return (
     <SafeAreaView className='flex-1'>
      <View className='px-4 pt-4 flex-1'>
        <View className="flex-row items-center w-full px-4 relative">
          <View className="absolute">
            <View className="size-8 rounded-full bg-[#E8E8E9] items-center justify-center">
              <ArrowLeft size={22} color="#6C7278" />
            </View>
          </View>
          <Text className="text-2xl text-primary font-poppins-medium text-center flex-1">
            FAQs
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={true}
          contentContainerStyle={{ paddingBottom: 32 }}
        >

          <Text className="text-lg font-poppins-semibold text-primary mt-4 mb-1">
            1. How does a Microbial Fuel Cell work?
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            A Microbial Fuel Cell (MFC) uses microorganisms to break down organic matter in wastewater.
            During this process, the microbes release electrons, which are captured by electrodes to
            generate electricity. This allows simultaneous wastewater treatment and energy recovery.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            2. Why combine MFC with hydroponics?
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            Hydroponics requires a continuous supply of clean water and often depends on external energy
            sources for monitoring systems. By integrating MFC-treated wastewater, we aim to provide a
            sustainable water source for hydroponics and a low-power energy supply for sensors or small
            devices.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            3. What type of wastewater did you use?
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            For the study, we used [specify if domestic, agricultural, or synthetic wastewater], as it is
            commonly available and contains organic matter suitable for microbial activity.
          </Text>

          <Text className="text-lg font-poppins-semibold text-primary mb-1">
            4. What is the expected energy output?
          </Text>
          <Text className="text-base font-poppins text-muted-foreground leading-relaxed mb-3 text-justify">
            The energy output of MFCs is relatively low, usually in the range of milliwatts, which is not
            enough for large-scale power but sufficient for low-power devices such as sensors, LED
            indicators, or monitoring equipment in hydroponics systems.
          </Text>

        </ScrollView>
      </View> 

      </SafeAreaView>
  )
}