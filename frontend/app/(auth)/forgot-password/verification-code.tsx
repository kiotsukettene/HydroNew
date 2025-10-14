import { View,KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';


interface VerificationCodeProps {
  code: string;
  setCode: (code: string) => void;
}

export default function VerificationCode() {

  const [code, setCode] = useState<string>('')

  const onChangeCode = () => {
    const digitsOnly = code.replace(/\D/g, '').slice(0, 5);
    setCode(digitsOnly)
  }
 
  // const onSubmit = () => {
  //   if (/^\d{6}$/.test(code)) {
  //     router.push('/(auth)/signup/verification-success');
  //   } else {
  //     console.warn('Please enter a valid 6-digit code');
  //   }
  // };

  return (
    <SafeAreaView className="flex-1">
      {/* Hills image as background */}
      

      {/* Card overlay that moves up with keyboard */}
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1, // above the image
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 px-4  justify-center items-center w-full  ">

          <Card
            className="border-0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5"
            style={{ zIndex: 2, elevation: 5 }}
          >
            <CardHeader>
             
              <CardTitle className="text-center text-primary text-2xl font-semibold sm:text-left">
               Check your email

              </CardTitle>
              <CardDescription className="text-center text-base sm:text-left">
               Enter the 5-digit code that was mentioned in the email.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              <View className="gap-6">
                <View className="gap-1.5 flex-row justify-center items-center w-full">

                  <Input
                  id={code}
                  keyboardType="numeric"
                  maxLength={5}
                  onChangeText={onChangeCode}
                    autoCapitalize="none"
                    returnKeyType="next"
                    className=" h-12  items-center text-2xl tracking-widest text-center text-primary font-semibold"
                  />
                  
                </View>

                <View className="gap-2 pt-1">
                  <Button >
                    <Text>Verify Code</Text>
                  </Button>
                 
                  <Button
                    variant="outline"
                    className="mx-auto w-full"
                    onPress={() => router.back()}
                  >
                    <Text className=''>Cancel</Text>
                  </Button> 
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}