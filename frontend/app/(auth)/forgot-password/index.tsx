import { View,KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { useResetPasswordStore } from '@/store/auth/resetPasswordStore';
import { forgotPasswordSchema } from '@/validators/forgotPassword';
import { ZodError } from 'zod';

export default function Index() {
  const { resetPassword, error, loading,  } = useResetPasswordStore();
  const [email, setEmailInput] = React.useState('');
  const { setEmail } = useResetPasswordStore();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onChangeEmail = (text : string) => {
    setEmailInput(text);
    setErrorMessage(null);
  }

  async function onSubmit() {
    setErrorMessage(null);
    try {
      const validatedData = forgotPasswordSchema.parse({ email });
      await resetPassword(validatedData.email);
      setEmail(validatedData.email);
      router.push('/(auth)/forgot-password/verification-code');
    } catch (err : any) {
      if (err instanceof ZodError) {
        const firstError = err.errors[0]?.message;
        setErrorMessage(firstError);
      } else if (err.response?.data?.message) {
        setErrorMessage(err.response.data.message);
      }
    }
  }

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
        <View className="flex-1 px-4 justify-center items-center w-full  ">

          <Card
            className="border-0 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5"
            style={{ zIndex: 2, elevation: 5 }}
          >

            <CardHeader>
             
              <CardTitle className="text-center text-primary text-2xl font-semibold sm:text-left">
               Forgot password
              </CardTitle>
              <CardDescription className="text-center text-base sm:text-left">
               Please enter your email and we'll send you a verification code.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">

              <View className="gap-6">
                <View>

                  <Label className="font-normal text-muted-foreground">Email</Label>
                  <Input
                    value={email}
                    onChangeText={onChangeEmail}
                    placeholder="m@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    // onSubmitEditing={onEmailSubmitEditing}
                    className={`h-12 text-base ${errorMessage ? 'border-red-500' : ''}`}
                  />
                  {(errorMessage) && (
                  <Text className="text-red-700 justify-end">{errorMessage}</Text>
                  )}
                </View>
                <View className="gap-2 pt-1">
                  <Button onPress={onSubmit} disabled={loading}>
                    {loading ? <Text>Sending...</Text> : <Text>Send Verification Code</Text>}
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