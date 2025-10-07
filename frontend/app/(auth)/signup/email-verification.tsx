import React from 'react';
import {
  View,
  Image,
  Dimensions,
  TextInput,
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

const { width, height } = Dimensions.get('window');

export default function EmailVerification() {
  const { countdown, restartCountdown } = useCountdown(30);
  const [code, setCode] = React.useState(['', '', '', '', '', '']);

  const onChangeDigit = (val: string, idx: number) => {
    const newCode = [...code];
    newCode[idx] = val.slice(-1);
    setCode(newCode);
  };

  const onSubmit = () => {
    // handle verification
  };

  
  return (
    <SafeAreaView className="items-center justify-center flex-1 bg-foreground">




        {/* Card Container */}
        <View className="items-center justify-center flex-1 px-4 mt-10">
      <Card className=" bg-foreground border-muted-foreground/20 sm:border-border  shadow-none sm:shadow-sm sm:shadow-black/5">
       
        <CardHeader>
          <View>
        <Image
          source={require('@/assets/images/Logo.png')}
          resizeMode="contain"
          className=' size-14 mx-auto'
        />
      </View>
          <CardTitle className="text-center text-primary text-base font-semibold sm:text-left">Email Verification</CardTitle>
          <CardDescription className="text-center text-xs sm:text-left">
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
                onSubmitEditing={onSubmit}
                className='items-center justify-center text-center text-lg tracking-widest font-medium space-x-2'
              />
              <Button
                variant="link"
                size="sm"
                disabled={countdown > 0}
                onPress={() => {
                  // TODO: Resend code
                  restartCountdown();
                }}>
                <Text className="text-center font-normal text-xs text-muted-foreground">
                  Didn&apos;t receive the code? <Text className="underline">Resend {""}</Text>
                  {countdown > 0 ? (
                    <Text className="text-xs" >
                      ({countdown})
                    </Text>
                  ) : null}
                </Text>
              </Button>
            </View>


            <View className="gap-2 pt-3">
              <Button className="w-full" onPress={onSubmit}>
                <Text>Continue</Text>
              </Button>
              <Button
                variant="outline"
                className="mx-auto w-full"
                onPress={() => {
                  // TODO: Navigate to sign up screen
                }}>
                <Text>Cancel</Text>
              </Button>
            </View>
          </View>
        </CardContent>
      </Card>
    </View>
    

      {/* Hills image */}
      <View
        style={{
          width: '100%',
          height: Math.max(140, height * 0.22),
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

// Countdown hook
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