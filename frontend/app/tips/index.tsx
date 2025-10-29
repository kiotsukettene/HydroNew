import { ScrollView, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  return (
    <ScrollView>
    <SafeAreaView className='bg-white'>
      <View>
        <PageHeader title="Tips and Suggestions"></PageHeader>
      </View>
      <View className='p-4'>
      <View className='p-4 gap-1'>
      <Text className='font-semibold'>
        Grow Smart, Grow Strong!
      </Text>
      <Text className='text-3xl font-bold'>
        What we suggest
      </Text>
      <Text>
        A few smart habits to keep your plants healthy. Clean water, timely feeding, and regular checks. Starts here!
      </Text>
      </View>
    </View>
      <View className="m-4 gap-2 p-2">
        <Card className="border-transparent bg-blue-100 p-4">
          <Badge className="w-28 items-center justify-center rounded-full bg-blue-500 p-2">
            <Text className="text-md">Water Tips </Text>
          </Badge>
          <Text className="text-xl font-semibold">"Keep it clean!"</Text>
          <View className="gap-2 px-6">
            <Text>
              • Make sure to use water that has been used to wash fruits and vegetables, and ensure
              it is free of chemicals.
            </Text>
            <Text>
              • Always check the water tank level to keep everything running safe and smooth.
            </Text>
          </View>
        </Card>
      </View>

      <View className="m-4 gap-2 p-2">
        <Card className="border-transparent bg-green-100 p-4">
          <Badge className="w-28 items-center justify-center rounded-full bg-green-500 p-2">
            <Text className="text-md">Nutrient Tips </Text>
          </Badge>
          <Text className="text-xl font-semibold">"Feed Wisely!"</Text>
          <View className="gap-2 px-6">
            <Text>
              • Ensure your plants are getting enough nutrients. 
            </Text>
            <Text>
              • Avoid overfeeding to keep roots healthy and support steady growth.
          </Text>
          </View>
        </Card>
      </View>

      <View className="m-4 gap-2 p-2">
        <Card className="border-transparent bg-red-100 p-4">
          <Badge className="w-28 items-center justify-center rounded-full bg-red-500 p-2">
            <Text className="text-md">Trimming Tips </Text>
          </Badge>
          <Text className="text-xl font-semibold">"Trim to thrive!"</Text>
          <View className="gap-2 px-6">
            <Text>
              • Remove yellow or damaged leaves regularly to promote healthy growth. 
            </Text>
            <Text>
              • Trimming helps your plants focus energy on new, stronger leaves.
          </Text>
          </View>
        </Card>
      </View>

      <View className="m-4 gap-2 p-2">
        <Card className="border-transparent bg-gray-100 p-4">
          <Badge className="w-36 items-center justify-center rounded-full bg-gray-500 p-2">
            <Text className="text-md">Maintenance Tips </Text>
          </Badge>
          <Text className="text-xl font-semibold">"Check your setup!"</Text>
          <View className="gap-2 px-6">
            <Text>
              • Make sure the water level stays above the pump and that all parts are working properly.  
            </Text>
            <Text>
              • A quick daily check keeps your system running smoothly.
          </Text>
          </View>
        </Card>
      </View>

      <View className="m-4 gap-2 p-2">
        <Card className="border-transparent bg-yellow-100 p-4">
          <Badge className="w-36 items-center justify-center rounded-full bg-yellow-500 p-2">
            <Text className="text-md">Safety & Hygiene Tips</Text>
          </Badge>
          <Text className="text-xl font-semibold">“Safe to grow, safe to eat!”</Text>
          <View className="gap-2 px-6">
            <Text>
              • Wash hands before and after handling hydroponic plants.  
            </Text>
            <Text>
              • Keep tanks covered to prevent insects or dust from entering.
          </Text>
          </View>
        </Card>
      </View>
      
    </SafeAreaView>
    </ScrollView>
  );
}
