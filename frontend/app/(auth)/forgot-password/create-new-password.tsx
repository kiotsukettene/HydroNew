import { View, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { router } from 'expo-router';
import { Text } from '@/components/ui/text';
import { PasswordStrengthMeter } from '@/components/ui/password-stength-meter';

export default function CreateNewPassword() {

  const [password, setPassword] = useState('');

  const onSubmit = () => {
      router.push('/(auth)/forgot-password/reset-success');
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
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="w-full flex-1 items-center justify-center px-4">
          <Card
            className="border-0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5"
            style={{ zIndex: 2, elevation: 5 }}>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-primary sm:text-left">
                Create New Password
              </CardTitle>
              <CardDescription className="text-center text-base sm:text-left">
                Create a new secure password for your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              <View className="gap-6">
                 {/* Password */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Password
                  </Label>
                  <Input
                    placeholder="•••••••••"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    // ref={passwordInputRef}
                    returnKeyType="send"
                    // onSubmitEditing={onSubmit}
                    className="border-muted-foreground/50 text-primary text-xl h-12"
                  />
                 
                </View>

                {/* Confirm Password */}
                <View className="gap-1">
                  <Label className="text-muted-foreground font-normal">
                    Confirm Password
                  </Label>
                  <Input
                    placeholder="•••••••••"
                    secureTextEntry
                    returnKeyType="send"
                    // onSubmitEditing={onSubmit}
                    className="border-muted-foreground/50 text-primary text-xl h-12 mb-6"

                  />
                   <PasswordStrengthMeter password={password} />
                </View>


                <View className="gap-2 pt-1">
                  <Button onPress={onSubmit}>
                    <Text>Reset Password</Text>
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
