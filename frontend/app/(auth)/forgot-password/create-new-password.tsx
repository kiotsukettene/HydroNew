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
import PasswordToggle from '@/app/hooks/password-toggle';
import { useResetPasswordStore } from '@/store/auth/resetPasswordStore';
import { createNewPasswordSchema } from '@/validators/forgotPassword';
import { ZodError } from 'zod';
import { toast } from 'sonner-native';

export default function CreateNewPassword() {
  const { resetPasswordWithToken, email, resetToken, loading } = useResetPasswordStore();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [visible, setVisible] = useState(false);


  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setErrors((prev) => ({ ...prev, password: undefined })); 
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);
    setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
  };

  const onSubmit = async () => {
    try {
      if (!email || !resetToken) {
        toast.error('Missing email or reset token. Please start the reset process again.');
        return;
      }
      setErrors({});

      const validatedData = createNewPasswordSchema.parse({
        password,
        confirm_password: confirmPassword,
      });

      await resetPasswordWithToken(email, validatedData.password, resetToken, validatedData.confirm_password);

      toast.success('Password reset successful');
      router.push('/(auth)/forgot-password/reset-success');

    } catch (err: any) {
      if (err instanceof ZodError) {
        const fieldErrors: { password?: string; confirmPassword?: string } = {};
        err.errors.forEach((e) => {
          if (e.path.includes('password')) fieldErrors.password = e.message;
          if (e.path.includes('confirm_password')) fieldErrors.confirmPassword = e.message;
        });
        setErrors(fieldErrors);
      }
      else if (err.response?.data?.errors) {
        setErrors(err.response.data.errors); 
      }
      else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="w-full flex-1 items-center justify-center px-4">
          <Card className="border-0 shadow-none sm:border-border sm:shadow-sm sm:shadow-black/5">
            <CardHeader>
              <CardTitle className="text-center text-2xl font-semibold text-primary sm:text-left">
                Create New Password
              </CardTitle>
              <CardDescription className="text-center text-base sm:text-left">
                Create a new secure password for your account.
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              {/* Password */}
              <View className="gap-1">
                <Label className="text-muted-foreground font-normal">Password</Label>
                <View>
                  <Input
                    placeholder="•••••••••"
                    secureTextEntry={!visible}
                    value={password}
                    onChangeText={handlePasswordChange}
                    className={`border-muted-foreground/50 text-primary text-xl h-12 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <PasswordToggle onToggle={setVisible} initialState={visible} />
                </View>
                {errors.password && <Text className="text-red-600 mt-1">{errors.password}</Text>}
              </View>

              {/* Confirm Password */}
              <View className="gap-1">
                <Label className="text-muted-foreground font-normal">Confirm Password</Label>
                <View className='mb-2'>
                  <Input
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    placeholder="•••••••••"
                    secureTextEntry={!visible}
                    className={`border-muted-foreground/50 text-primary text-xl h-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <PasswordToggle onToggle={setVisible} initialState={visible} />
                </View>
                {errors.confirmPassword && <Text className="text-red-600">{errors.confirmPassword}</Text>}
                <PasswordStrengthMeter password={password} />
              </View>
              <View className="gap-2 pt-1">
                <Button 
                  onPress={onSubmit}
                  disabled={loading}
                >
                  {loading ? <Text>Resetting...</Text> : <Text>Reset Password</Text>}
                </Button>

                <Button variant="outline" className="mx-auto w-full" onPress={() => router.back()}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            </CardContent>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
