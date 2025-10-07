import { View, Image } from 'react-native';
import { Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function SuccessScreen() {
  return (
    <SafeAreaView className="flex-1 bg-foreground justify-between">


      {/* MAIN CONTENT */}
      <View className="flex-1 justify-center items-center px-4">
        <View className="bg-secondary/10 rounded-full p-6">
          <Check size={64} color={'#1869DD'} />
        </View>


        <View className='items-center mt-4 gap-2'>
          <Label className='text-primary text-lg text-center'>Your account was successfully created!</Label>
          <Label className='text-center text-muted-foreground text-xs font-normal'>Welcome aboard! Your account has been created. We’re excited to have you join us.</Label>
        </View>

      
      <View className='w-full mt-4'>
        <Button >
          <Text className='items-center mx-auto   text-foreground'> Go to login</Text>
        </Button>
      </View>

       
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
