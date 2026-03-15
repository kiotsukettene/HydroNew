import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  const { countdown, restartCountdown } = useCountdown(30);
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
    try {
      await resendResetCode(email);
      restartCountdown();
    } catch (error) {
      console.error('Resend code failed:', error);
    }
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
                <View className="gap-1.5">
                  <Input
                    id="code"
                    value={code}
                    keyboardType="numeric"
                    maxLength={6}
                    onChangeText={onChangeCode}
                    autoCapitalize="none"
                    returnKeyType="send"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    onSubmitEditing={onSubmit}
                    className={`items-center h-14 justify-center text-center text-2xl tracking-widest font-medium space-x-2 ${
                      errorMessages ? 'border-red-500 text-red-600' : 'text-muted-foreground'
                    }`}
                  />
                  <Button
                    variant="link"
                    size="sm"
                    disabled={countdown > 0}
                    onPress={handleResendCode}
                  >
                    <Text className="text-center font-normal text-base text-muted-foreground">
                      Didn&apos;t receive the code?{' '}
                      <Text className="underline">Resend </Text>
                      {countdown > 0 ? (
                        <Text className="text-base">({countdown})</Text>
                      ) : null}
                    </Text>
                  </Button>
                </View>
                {errorMessages && (
                  <Text className="text-red-600 text-center text-sm">{error || errorMessages}</Text>
                )}
                <View className="gap-2 pt-1">
                  <Button 
                    onPress={onSubmit} 
                    disabled={!/^\d{6}$/.test(code) || loading}>
                    {loading ? <Text>Verifying...</Text> : <Text>Continue</Text>}
                  </Button>

                  <Button
                    variant="outline"
                    className="mx-auto w-full"
                    onPress={() => router.back()}>
                    <Text className="">Cancel</Text>
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

function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [seconds]);

  React.useEffect(() => {
    startCountdown();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCountdown]);

  return { countdown, restartCountdown: startCountdown };
}
