import React from 'react';
import {
  View,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function EmailVerification() {
  const { countdown, restartCountdown } = useCountdown(30);
  const [code, setCode] = React.useState('');

  const onChangeCode = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setCode(digitsOnly);
  };

  const onSubmit = () => {
    if (/^\d{6}$/.test(code)) {
      router.push('/(auth)/signup/verification-success');
    } else {
      console.warn('Please enter a valid 6-digit code');
    }
  };

  return (
    <SafeAreaView className="flex-1">
      {/* Hills image as background */}
      <Image
        source={require('@/assets/images/email-verify-bg.png')}
        resizeMode="cover"
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: Math.max(140, height * 0.22),
          zIndex: 0, // stays behind the card
        }}
      />

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
        <View className="flex-1 justify-center items-center px-4  w-full">
          <Card
            className="border-muted-foreground/20 sm:border-border shadow-none sm:shadow-sm sm:shadow-black/5"
            style={{ zIndex: 2, elevation: 5 }}
          >
            <CardHeader>
              <View>
                <Image
                  source={require('@/assets/images/Logo.png')}
                  resizeMode="contain"
                  className="size-14 mx-auto"
                />
              </View>
              <CardTitle className="text-center text-primary text-2xl font-semibold sm:text-left">
                Email Verification
              </CardTitle>
              <CardDescription className="text-center text-base sm:text-left">
                Enter the verification code sent to m@example.com
              </CardDescription>
            </CardHeader>

            <CardContent className="gap-6">
              <View className="gap-6">
                <View className="gap-1.5">
                  <Input
                    id="code"
                    autoCapitalize="none"
                    returnKeyType="send"
                    keyboardType="numeric"
                    autoComplete="sms-otp"
                    textContentType="oneTimeCode"
                    value={code}
                    onChangeText={onChangeCode}
                    maxLength={6}
                    onSubmitEditing={onSubmit}
                    className="items-center text-muted-foreground justify-center text-center text-xl tracking-widest font-medium space-x-2"
                  />
                  <Button
                    variant="link"
                    size="sm"
                    disabled={countdown > 0}
                    onPress={restartCountdown}
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

                <View className="gap-2 pt-1">
                  <Button
                    className="w-full"
                    onPress={onSubmit}
                    disabled={!/^\d{6}$/.test(code)}
                  >
                    <Text className=''>Continue</Text>
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

// Countdown hook stays unchanged
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
