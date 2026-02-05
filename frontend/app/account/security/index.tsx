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
  FileClock,
  UserRoundCheck,
  Pencil,
  LogOut,
} from 'lucide-react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Link, useRouter } from 'expo-router';
import { PageHeader } from '@/components/ui/page-header';
import { useAccountStore } from '@/store/account/accountStore';
import { useAuthStore } from '@/store/auth/authStore';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
export default function Index() {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { account, fetchAccount } = useAccountStore();

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace('/(auth)/login');
  };

const settings = [
  { icon: UserRoundPen, title: 'My Account', link: '/account/manage-account' },
  { icon: ShieldCheck, title: 'Security Settings', link: '/account/security-setting' },
  { icon: Scroll, title: 'Terms and Conditions', link: '/account/terms-and-conditions' },
  { icon: Lock, title: 'Privacy Policy', link: '/account/privacy-policy' },
  { icon: MessageSquareMore, title: 'FAQs', link: '/account/faq' },
  { icon: FileClock, title: 'Activity Log', link: '/account/login-history' },
];

  useEffect(() => {
    if (!account) {
      fetchAccount();
    }
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-background '>
      
        <View className="flex-row items-center w-full">
          <PageHeader 
            title="Account" 
            showNotificationButton={false} 
            showEllipsisButton={true}
          />
        </View>
        <View className='flex-1 px-4'>
          <View className='items-center'>
          {/* ================= Title  ==================== */}
          <View className="relative items-center">
         {/*  <Image
              source={require('@/assets/images/welcome-bg.png')}
              resizeMode="cover"
              className="size-32 rounded-full"
            /> */}
          </View>


          {/* ================= Main Body  ==================== */}
          <View className='flex-row items-start mt-6 mb-4 w-full gap-5 px-1'>
            {/* Profile picture – squircle with edit badge */}
            <View className='relative'>
              <View className='rounded-full items-center  p-3 bg-muted border border-green-100 justify-center overflow-hidden'>
                <UserRoundCheck size={55} color="#71717a" />
              </View>
              <Link href="/account/manage-account" asChild>
                <Pressable className='absolute -top-1 -right-1 w-8 h-8 rounded-full bg-[#E91E63] items-center justify-center shadow-sm'>
                  <Pencil size={14} color="#fff" strokeWidth={2.5} />
                </Pressable>
              </Link>
            </View>
            {/* Name and details */}
            <View className='flex-1 justify-center min-w-0 '>
              <Text
                className='text-3xl font-bold text-gray-900 leading-tight'
                numberOfLines={2}
              >
                {account?.first_name + ' '  + account?.last_name || 'Jhon Doe'}
              </Text>
              <View className='mt-1  rounded-lg w-auto'>
                <Text className='text-base text-gray-800'>
                  {account?.email || 'user.example@gmail.com'}
                </Text>
                <Text className='text-sm uppercase tracking-wider text-gray-400 mt-0.5'>
                  Email
                </Text>
              </View>
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
          {/* <View className="flex-row items-center bg-[#EEF7FE] border border-[#C7E5F7] px-3 rounded-xl">
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
          </View> */}
        </View>

        <View className="mt-2 flex-1">
          <Card className="flex-1 rounded-lg border border-muted-foreground/20  shadow-lg">
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
              <Pressable
                className="active:bg-muted/30"
                onPress={() => setShowLogoutModal(true)}
              >
                <View className="flex-col">
                  <Separator className="bg-muted-foreground/10" />
                  <View className="flex-row items-center justify-between py-4 px-5">
                    <View className="flex-row items-center gap-3">
                      <LogOut size={22} color="#166534" />
                      <Text className="text-base text-foreground">Log Out</Text>
                    </View>
                    <ChevronRight size={20} color="#166534" />
                  </View>
                </View>
              </Pressable>

              </ScrollView>
            </CardContent>
          </Card>
        </View>
            {/* ================= end of main body  ==================== */}
        </View>

        <ConfirmationModal
          visible={showLogoutModal}
          icon={<LogOut size={40} color="#fff" />}
          modalTitle="Logout"
          modalDescription="Are you sure you want to logout?"
          confirmText="Logout"
          iconBgColor="bg-destructive"
          confirmButtonColor="bg-destructive"
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={confirmLogout}
        />
    
    </SafeAreaView>
  )
}