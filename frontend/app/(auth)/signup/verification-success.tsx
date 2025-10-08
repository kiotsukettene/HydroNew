import { View, Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Link } from 'expo-router';

export default function SuccessScreen() {
  return (
    <SafeAreaView className="flex-1 justify-between bg-foreground">
      {/* MAIN CONTENT */}
      <View className="flex-1 items-center gap-3 justify-center px-4">
        <View className="rounded-full bg-secondary/10 p-6">
          <Check size={64} color={'#1869DD'} />
        </View>

        <View className="mt-4 items-center gap-2">
          <Label className="text-center text-3xl text-primary">
            Your account was successfully created!
          </Label>
          <Label className="text-center text-base font-normal text-muted-foreground">
            Welcome aboard! Your account has been created. We’re excited to have you join us.
          </Label>
        </View>

        <Link href="/(auth)/login" className="mt-4" asChild>
          <Button className="w-full">
            <Text className="mx-auto items-center text-foreground"> Go to login</Text>
          </Button>
        </Link>
      </View>

      {/* HILLS IMAGE AT BOTTOM */}
      <View
        style={{
          width: '100%',
          height: Math.max(140, 160), // adjust as needed
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
