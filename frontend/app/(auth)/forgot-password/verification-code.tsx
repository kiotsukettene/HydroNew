import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useResetPasswordStore } from '@/store/auth/resetPasswordStore';
import { ZodError } from 'zod';
import { verifyResetCodeSchema } from '@/validators/forgotPassword';

interface VerificationCodeProps {
  code: string;
  setCode: (code: string) => void;
}

export default function VerificationCode() {
  const { verifyResetCode, email, error, loading, resendResetCode } = useResetPasswordStore();
  const [code, setCode] = useState<string>('');
  const [errorMessages, setErrorMessages] = useState<string | null>(null);


  const onChangeCode = (text: string) => {
    const digitsOnly = text.replace(/\D/g, '').slice(0, 6);
    setCode(digitsOnly);
    setErrorMessages(null);
  };

  async function onSubmit() {

    try {
      const validatedData = verifyResetCodeSchema.parse({ code });

      if (!email) {
      console.warn('Email not found — please go back and enter it again.');
      return;
      }
      
      await verifyResetCode(email, validatedData.code);
      router.push('/(auth)/forgot-password/create-new-password');
    } catch (err:any) {
      if (err instanceof ZodError) {
        setErrorMessages(err.errors[0].message);
      } else if (err.response?.data?.message) {
        setErrorMessages(err.response.data.message);
      } else {
        console.error('Verification failed:', err);
      }
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      console.warn('Email not found — please go back and enter it again.');
      return;
    }
    await resendResetCode(email);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
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
                Enter the 6-digit code that was mentioned in the email.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              <View className="gap-6">
                <View>
                  <View className="w-full flex-row items-center justify-center gap-1.5">
                    <Input
                      id={code}
                      value={code}
                      keyboardType="numeric"
                      maxLength={6}
                      onChangeText={onChangeCode}
                      autoCapitalize="none"
                      returnKeyType="next"
                      className={`h-12 items-center text-center text-2xl font-semibold tracking-widest ${
                        errorMessages ? 'border-red-500' : 'border-gray-200'
                      } text-primary`}
                    />
                  </View>
                    {(errorMessages) && (
                      <Text className="text-red-700 justify-end">{error || errorMessages}</Text>
                    )}
                </View>
                <View className="gap-2 pt-1">
                  <Button 
                    onPress={onSubmit} 
                    disabled={loading}>
                    {loading ? <Text>Verifying...</Text> : <Text>Verify Code</Text>}
                  </Button>

                  <Button
                    variant="outline"
                    className="mx-auto w-full"
                    onPress={() => router.back()}>
                    <Text className="">Cancel</Text>
                  </Button>

                  <Text className="text-center text-base font-normal mt-2 text-muted-foreground">
                    Didn&apos;t receive the code? <Text onPress={handleResendCode} className="underline text-primary font-semibold">Resend </Text>
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
