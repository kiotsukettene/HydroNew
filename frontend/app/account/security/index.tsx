import {
  Image,
  View,
  ScrollView,
  Text,
  Pressable,
} from 'react-native';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'expo-router';

export default function Index() {

const icons = {
  account: require('@/assets/images/Logo.png'),
  security: require('@/assets/images/Logo.png'),
  preferences: require('@/assets/images/Logo.png'),
  terms: require('@/assets/images/Logo.png'),
  privacy: require('@/assets/images/Logo.png'),
  faq: require('@/assets/images/Logo.png'),
};

const settings = [
  { icon: 'account', title: 'My Account', link: '/account/manage-account' },
  { icon: 'security', title: 'Security Settings', link: '/account/security-setting' },
  { icon: 'preferences', title: 'Preferences', link: '/account/preferences' },
  { icon: 'terms', title: 'Terms and Conditions', link: '/account/terms-and-conditions' },
  { icon: 'privacy', title: 'Privacy Policy', link: '/account/privacy-policy' },
  { icon: 'faq', title: 'FAQs', link: '/account/faq' },
];

  return (
    <SafeAreaView className='flex-1'>
      <View className='px-4 flex-1'>
        <View className='items-center'>
          <Text className='text-3xl text-primary font-poppins-medium'>Account</Text>
          <Image
            source={require('@/assets/images/welcome-bg.png')}
            resizeMode="cover"
            className="mx-auto mt-3 size-32 rounded-full"
          />
          <View className='mt-4 px-4'>
            <Text 
              className='text-2xl text-center text-foreground'
              >
                Juan Dela Cruz
              </Text>
            <Text 
              className='text-md text-center text-muted-foreground italic'
              >
                user.example@gmail.com
            </Text>
          </View>
          <View className="flex-row justify-between mt-4 gap-5">
            <View className="items-center">
              <Text className="text-xl font-bold text-primary">65</Text>
              <Text className="text-muted-foreground">Devices</Text>
            </View>
            <Separator
              orientation="vertical"
              className='text-muted-foreground'
            />
            <View className="items-center">
              <Text className="text-xl font-bold text-primary">34</Text>
              <Text className="text-muted-foreground">mW/hr</Text>
            </View>
            <Separator
              orientation="vertical"
              className='text-muted-foreground'
            />
            <View className="items-center">
              <Text className="text-xl font-bold text-primary">12</Text>
              <Text className="text-muted-foreground">cm/day</Text>
            </View>
          </View>
        </View>

          {/* ads */}
        <View className="mt-4 gap-1">
          {/* div 1 */}
          <View className="flex-row items-center px-1 py-1 rounded-xl bg-[#F6FFEE] border border-[#BCF1C1]">
            <Image
              source={require('@/assets/images/urban-farming.png')}
              resizeMode="contain"
              className="size-25 mr-3"
            />
            <View className="flex-1">
              <Text className="text-md font-semibold text-foreground">
                Discover Urban Farming
              </Text>
              <Text className="text-muted-foreground italic">
                Hydroponics Farming
              </Text>
            </View>
          </View>

          {/* div 2 */}
          <View className="flex-row items-center bg-[#EEF7FE] border border-[#C7E5F7] px-3 py-0.5 rounded-xl">
            <View className="flex-1">
              <Text className="text-md font-semibold text-foreground">
                Microbial Fuel Cell
              </Text>
              <Text className="text-muted-foreground italic">
                The key to sustainability
              </Text>
            </View>
            <Image
              source={require('@/assets/images/microbial-fuel.png')}
              resizeMode="contain"
              className="size-25 ml-1"
            />
          </View>
        </View>

        <View className="mt-2 flex-1">
          <Card className="flex-1 rounded-lg border border-muted-foreground/10 bg-white shadow-lg">
            <CardContent className="flex-1 px-4 -m-5">
              <ScrollView
                showsVerticalScrollIndicator={true}
                contentContainerStyle={{ flexGrow: 1 }}
              >
              {settings.map((item, index) => (
                <Link href={item.link as any} asChild key={index}>
                  <Pressable className="active:bg-muted/30">
                    <View className="flex-col">
                      <View className="flex-row items-center justify-between py-4  px-5">
                        <View className="flex-row items-center gap-3">
                          <Image
                            source={icons[item.icon as keyof typeof icons]}
                            resizeMode="contain"
                            style={{ width: 22, height: 22, tintColor: '#166534' }}
                          />
                          <Text className="text-base text-foreground">
                            {item.title}
                          </Text>
                        </View>
                        <Text className="text-muted-foreground">{'>'}</Text>
                      </View>
                      {index < settings.length - 1 && (
                        <Separator className="bg-muted-foreground/10" />
                      )}
                    </View>
                  </Pressable>
                </Link>
              ))}

              </ScrollView>
            </CardContent>
          </Card>
        </View>

      </View>
    </SafeAreaView>
  )
}