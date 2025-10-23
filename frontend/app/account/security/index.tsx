import {
  Image,
  View,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  ChevronRight,
  Share2,
  Leaf,
  Zap,
  UserRoundPen,
  ShieldCheck,
  Wrench,
  Scroll,
  Lock,
  MessageSquareMore,
} from 'lucide-react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';
import { PageHeader } from '@/components/ui/page-header';
 
export default function Index() {

const settings = [
  { icon: UserRoundPen, title: 'My Account', link: '/account/manage-account' },
  { icon: ShieldCheck, title: 'Security Settings', link: '/account/security-setting' },
  { icon: Scroll, title: 'Terms and Conditions', link: '/account/terms-and-conditions' },
  { icon: Lock, title: 'Privacy Policy', link: '/account/privacy-policy' },
  { icon: MessageSquareMore, title: 'FAQs', link: '/account/faq' },
];

  return (
    <SafeAreaView className='flex-1'>
      <View className='px-4 flex-1 '>
        <View className="flex-row items-center w-full">
          <PageHeader 
            title="Account" 
            showNotificationButton={false} 
            showEllipsisButton={true}
          />
        </View>
        <View className='items-center'>
          {/* ================= Title  ==================== */}
          <View className="relative items-center">
            <Image
              source={require('@/assets/images/welcome-bg.png')}
              resizeMode="cover"
              className="size-32 rounded-full"
            />
          </View>
          {/* ================= Main Body  ==================== */}
          <View className='mt-4 px-4'>
            <Text 
              className='text-2xl text-center text-gray-800 font-medium'
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
              <View className='flex-row items-center'>
                <Zap size={16} color="#166534" />
                <Text className="text-xl font-bold text-primary">100</Text>
              </View>
              <Text className="text-muted-foreground">mW/hr</Text>
            </View>
            <Separator
              orientation="vertical"
              className="text-muted-foreground"
            />
            <View className="items-center">
              <View className='flex-row items-center'>
                <Leaf size={16} color="#166534" />
                <Text className="text-xl font-bold text-primary">65</Text>
              </View>
              <Text className="text-muted-foreground">cm/day</Text>
            </View>
          </View>
        </View>

          {/* ads */}
        <View className="mt-2 gap-1">
          {/* div 1 */}
          <View className="flex-row items-center px-1 rounded-xl bg-[#F6FFEE] border border-[#BCF1C1]">
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
          <View className="flex-row items-center bg-[#EEF7FE] border border-[#C7E5F7] px-3 rounded-xl">
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
                          <item.icon size={22} color="#166534" />
                          <Text className="text-base text-foreground">
                            {item.title}
                          </Text>
                        </View>
                        <ChevronRight size={20} color="#166534" />
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
            {/* ================= end of main body  ==================== */}
      </View>
    </SafeAreaView>
  )
}