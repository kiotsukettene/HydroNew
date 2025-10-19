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
  ChevronRight
} from 'lucide-react-native';


export default function SecuritySetting() {

  const settings =[
    {
      icon:LockOpen, title: 'Change Password', link: ''
    },
    {
      icon:ShieldCheck, title: 'Permissions', link: ''
    },
    {
      icon:LogIn, title: 'Login History', link: ''
    },
    {
      icon:Trash, title: 'Delete Account', link: ''
    }
  ];

  return (
    <SafeAreaView className='flex-1'>
      <View className='px-4 flex-1 items-center'>
        <Text className='text-2xl text-primary font-poppins-medium'>Security Settings</Text>
        <View className='size-24 bg-[#BFF1CC] rounded-full justify-center items-center mt-6'>
          <ShieldCheck size={60} color="#166534" />
        </View>
        <View className="w-full flex-1 mt-6">
          <Card className="py-2 rounded-lg border border-muted-foreground/10 bg-white shadow-lg">
            <CardContent>
              {settings.map((item, index)=>(
                <Link href={item.link as any} asChild key={index}>
                  <Pressable className="active:bg-muted/30">
                    <View className="flex-col">
                      <View className="flex-row items-center justify-between py-4">
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
            </CardContent>
          </Card>
        </View> 
      </View>
    </SafeAreaView>
  )
}