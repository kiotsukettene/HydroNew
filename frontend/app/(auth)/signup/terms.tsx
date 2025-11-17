import { View, Image, Dimensions, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Text } from '@/components/ui/text';

const { height } = Dimensions.get('window');

export default function Terms() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        {/* --- TOP IMAGE --- */}
        <Image
          source={require('@/assets/images/sign-up-bg.png')}
          resizeMode="cover"
          style={{
            height: (height * 1) / 3,
            width: '100%',
          }}
        />

        {/* --- BACK BUTTON --- */}
        <View className="absolute left-4 top-11">
         <Link href={"/signup"} asChild>
          <Button  size="icon" className='bg-secondary rounded-full' >
            <Icon as={ChevronLeft} size={16} className='text-muted'/>
          </Button>
          </Link>
        </View>

        {/* --- FORM SECTION --- */}
        <View className="mt-[-7rem] flex-1 items-center">
          <Card className="w-[90%] max-w-md rounded-lg border-muted-foreground/10 p-2 shadow-lg">
            <CardHeader className="items-center pt-4">
              <CardTitle className="text-2xl text-primary">Terms and Conditions</CardTitle>
              <CardDescription className="text-center">
                Please read to continue.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-4">
              <View className="flex flex-col gap-4">
                <View className="gap-1">
                  <Label className=" text-base font-bold ">Acceptance of Terms</Label>
                  <Text className=" text-muted-foreground" style={{ textAlign: 'justify' }}>
                    By creating an account and using this application, you acknowledge that you have
                    read, understood, and agreed to these Terms and Conditions. If you do not agree,
                    you must not proceed with account creation or use of the application.
                  </Text>
                </View>

                <View className="gap-1">
                  <Label className="text-base font-bold ">User Responsibilities</Label>
                  <Text className="text-muted-foreground" style={{ textAlign: 'justify' }}>
                    You agree to provide accurate information during registration and maintain the
                    confidentiality of your login credentials. Any unauthorized use of your account
                    or security breach must be reported immediately. Misuse of the application,
                    including fraudulent activities, may result in account suspension or
                    termination.{' '}
                  </Text>
                </View>

                <View className="gap-1">
                  <Label className="text-base font-bold ">Data Usage and Privacy</Label>
                  <Text className="text-sm text-muted-foreground" style={{ textAlign: 'justify' }}>
                    By using this application, you consent to the collection, storage, and use of
                    your data in accordance with our Privacy Policy. We ensure that your information
                    will not be shared with third parties without your consent, except where
                    required by law.{' '}
                  </Text>
                </View>

                <View className="gap-1">
                  <Label className="text-base font-bold ">Limitation of Liability</Label>
                  <Text className=" text-muted-foreground" style={{ textAlign: 'justify' }}>
                    The application is provided “as is,” without warranties of any kind. We are not
                    liable for any loss, damage, or inconvenience arising from the use or inability
                    to use the application. Continued use signifies your full acceptance of these
                    terms.{' '}
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
