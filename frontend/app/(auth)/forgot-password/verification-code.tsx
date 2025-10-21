import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  const [code, setCode] = useState<string>('');

  const onChangeCode = () => {
    const digitsOnly = code.replace(/\D/g, '').slice(0, 5);
    setCode(digitsOnly);
  };

  const onSubmit = () => {
      router.push('/(auth)/forgot-password/create-new-password');
   
  };

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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="w-full flex-1 items-center justify-center px-4">
          <Card
            className="border-0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5"
            style={{ zIndex: 2, elevation: 5 }}>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-primary sm:text-left">
                Check your email
              </CardTitle>
              <CardDescription className="text-center text-base sm:text-left">
                Enter the 5-digit code that was mentioned in the email.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              <View className="gap-6">
                <View className="w-full flex-row items-center justify-center gap-1.5">
                  <Input
                    id={code}
                    keyboardType="numeric"
                    maxLength={5}
                    onChangeText={onChangeCode}
                    autoCapitalize="none"
                    returnKeyType="next"
                    className="h-12 items-center text-center text-2xl font-semibold tracking-widest text-primary"
                  />
                </View>

                <View className="gap-2 pt-1">
                  <Button onPress={onSubmit}>
                    <Text>Verify Code</Text>
                  </Button>

                  <Button
                    variant="outline"
                    className="mx-auto w-full"
                    onPress={() => router.back()}>
                    <Text className="">Cancel</Text>
                  </Button>

                  <Text className="text-center text-base font-normal mt-2 text-muted-foreground">
                    Didn&apos;t receive the code? <Text className="underline text-primary font-semibold">Resend </Text>
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
