import React from 'react';
import {
  View,
  Image,
  Dimensions,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function EmailVerification() {
  const router = useRouter();
  const { countdown, restartCountdown } = useCountdown(30);
  const [code, setCode] = React.useState(['', '', '', '', '', '']);

  const onChangeDigit = (val: string, idx: number) => {
    const newCode = [...code];
    newCode[idx] = val.slice(-1); // only keep 1 digit
    setCode(newCode);
  };

  const onSubmit = () => {
    // TODO: verify code
  };

  return (
    <SafeAreaView className="flex-1 bg-foreground">
     {/* --- BACK BUTTON --- */}
        <View className="absolute left-4 top-11">
         <Link href={"/signup"} asChild>
          <Button  size="icon" className='bg-secondary' >
            <Icon as={ChevronLeft} />
          </Button>
          </Link>
        </View>

      <View className="flex-1 justify-center px-6">
        {/* Card */}
        <Card className="bg-card rounded-2xl border border-muted-foreground/10 shadow-sm">
          <CardHeader className="items-center gap-2 pt-8">
            {/* Logo / icon */}
            <Image
              source={require('@/assets/images/leaf-logo.png')}
              style={{ width: 48, height: 48, resizeMode: 'contain' }}
            />
            <CardTitle className="text-primary text-lg font-semibold">
              Email Verification
            </CardTitle>
            <CardDescription className="text-center text-xs text-muted-foreground">
              We’ve sent a 6-digit verification code to ad***@gmail.com
            </CardDescription>
          </CardHeader>

          <CardContent className="items-center gap-5 py-4 px-6">
            {/* 6 digit code boxes */}
            <View className="flex-row justify-center gap-2">
              {code.map((digit, idx) => (
                <TextInput
                  key={idx}
                  value={digit}
                  keyboardType="number-pad"
                  maxLength={1}
                  onChangeText={(val) => onChangeDigit(val, idx)}
                  className="border border-primary rounded-md text-center text-lg"
                  style={{
                    width: 40,
                    height: 50,
                  }}
                />
              ))}
            </View>

            {/* Verify Button */}
            <Button
              onPress={onSubmit}
              className="w-full bg-primary rounded-full py-3 mt-2">
              <Text className="text-foreground font-medium text-sm">
                ✓ Verify Email
              </Text>
            </Button>

            {/* Resend link */}
            <Text className="text-xs text-muted-foreground">
              Didn’t receive the code?{' '}
              <Text
                className="text-primary"
                onPress={restartCountdown}
                style={{ opacity: countdown > 0 ? 0.5 : 1 }}>
                Resend
              </Text>{' '}
              {countdown > 0 && `(${countdown})`}
            </Text>
          </CardContent>
        </Card>
      </View>

      {/* Bottom hills image */}
      <View
        style={{
          width: '100%',
          height: Math.max(160, height * 0.22),
          overflow: 'hidden',
        }}>
        <Image
          source={require('@/assets/images/email-verify-bg.png')}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
        />
      </View>
    </SafeAreaView>
  );
}

 
// ========= Custom hook to manage countdown timer ==========
function useCountdown(seconds = 30) {
  const [countdown, setCountdown] = React.useState(seconds);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
 
  const startCountdown = React.useCallback(() => {
    setCountdown(seconds);
 
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
 
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown]);
 
  return { countdown, restartCountdown: startCountdown };
}