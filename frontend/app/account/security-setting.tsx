import { View, Pressable} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'expo-router';
import { 
  ShieldCheck,
  LockOpen,
  LogIn,
  Trash,
  ChevronRight,
  ArrowLeft
} from 'lucide-react-native';


export default function SecuritySetting() {

  const settings =[
    {
      icon:LockOpen, title: 'Change Password', link: '/account/security/change-password'
    },
    {
      icon:ShieldCheck, title: 'Permissions', link: '/account/security/permissions'
    },
    {
      icon:LogIn, title: 'Login History', link: ''
    },
    {
      icon:Trash, title: 'Delete Account', link: '/account/security/delete-account'
    }
  ];

  return (
    <SafeAreaView className='flex-1'>
      <View className='px-4 flex-1 items-center'>
        <View className="flex-row items-center w-full px-4 relative">
          <View className="absolute">
            <View className="size-8 rounded-full bg-[#E8E8E9] items-center justify-center">
              <ArrowLeft size={22} color="#6C7278" />
            </View>
          </View>
          <Text className="text-2xl text-primary font-poppins-medium text-center flex-1">
            Security
          </Text>
        </View>
        <View className='size-24 bg-[#BFF1CC] rounded-full justify-center items-center mt-6'>
          <ShieldCheck size={60} color="#166534" />
        </View>
        <View className="w-full flex-1 mt-6">
          <Card className="py-2 rounded-lg border border-muted-foreground/10 bg-white shadow-lg">
            <CardContent>
              {settings.map((item, index) => {
                const isDestructive = item.title === 'Delete Account'; 
                const textClass = isDestructive ? 'text-destructive' : 'text-foreground';
                return (
                  <Link href={item.link as any} asChild key={index}>
                    <Pressable className="active:bg-muted/30">
                      <View className="flex-col">
                        <View className="flex-row items-center justify-between py-4">
                          <View className="flex-row items-center gap-3">
                            <item.icon size={22} color={isDestructive ? '#E36262' : '#166534'} />
                            <Text className={`text-base ${textClass}`}>
                              {item.title}
                            </Text>
                          </View>
                          <ChevronRight size={20} color={isDestructive ? '#E36262' : '#166534'} />
                        </View>
                        {index < settings.length - 1 && (
                          <Separator className="bg-muted-foreground/10" />
                        )}
                      </View>
                    </Pressable>
                  </Link>
                );
              })}
            </CardContent>
          </Card>
        </View> 
      </View>
    </SafeAreaView>
  )
}