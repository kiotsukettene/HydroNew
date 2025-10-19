import {
  Image,
  View,
  Pressable,
} from 'react-native';
import {
  User,
  Camera,
  AtSign,
  Calendar,
} from 'lucide-react-native'
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function ManageAccount() {

  const [editable, isEditable] = useState(false);
  const [username, setUsername] = useState("juandelacruz");
  const [fullname, setFullname] = useState("Juan Dela Cruz");
  const [email, setEmail] = useState("juan.delacruz@example.com");
  const [contact, setContact] = useState("09000000000");
  const [birthdate, setBirthdate] = useState("2000-01-01");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if(!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <View className='px-4 flex-1 justify-between'>
        <View>
          <View className='items-center'>
            <Text className='text-3xl text-primary font-poppins-medium'>Manage Account</Text>
            <View className="relative items-center mt-3">
              <Image
                source={profileImage ? { uri: profileImage } : require('@/assets/images/welcome-bg.png')}
                resizeMode="cover"
                className="size-32 rounded-full"
              />
              <Pressable
                className="absolute bottom-0 right-2 bg-primary size-10 rounded-full items-center justify-center border-2 border-white shadow-md"
                onPress={openImagePicker}
                >
                <Camera size={24} color="white" />
              </Pressable>
            </View>
          </View>
          {/*username */}
          <View className='mt-6 gap-1'>
            <Label className="font-normal text-muted-foreground">Username</Label>
            <Input
              value={username}
              onChangeText={setUsername}
              editable={editable}
              placeholder='username'
              autoCapitalize='none'
              className="border-muted-foreground/50 text-base text-black"
            > 
            </Input> 
          </View>
          {/*fullname */}
          <View className='mt-2 gap-1'>
            <Label className="font-normal text-muted-foreground">Full Name</Label>
            <Input
              value={fullname}
              onChangeText={setFullname}
              editable={editable}
              placeholder='fullname'
              autoCapitalize='none'
              className="border-muted-foreground/50 text-base text-black"
            >
            </Input>
          </View>
          {/*email */}
          <View className='mt-2 gap-1'>
            <Label className="font-normal text-muted-foreground">Email</Label>
            <Input
              value={email}
              onChangeText={setEmail}
              editable={editable}
              placeholder='email' 
              autoCapitalize='none'
              className="border-muted-foreground/50 text-base text-black"
            >
            </Input>
          </View>
          {/*contact */}
          <View className='mt-2 gap-1'>
            <Label className="font-normal text-muted-foreground">Contact No.</Label>
            <Input
              value={contact}
              onChangeText={setContact}
              editable={editable}
              placeholder='contact no.' 
              autoCapitalize='none'
              className="border-muted-foreground/50 text-base text-black"
            >
            </Input>
          </View>
          {/*birthdate */}
          <View className='mt-2 gap-1'>
            <Label className="font-normal text-muted-foreground">Birthdate</Label>
            <Input
              value={birthdate}
              onChangeText={setBirthdate}
              editable={editable}
              placeholder='birthdate' 
              autoCapitalize='none'
              className="border-muted-foreground/50 text-base text-black"
            >
            </Input>
          </View>
      </View>
      <View className='mb-4'>
        <Button 
          onPress={() => isEditable(!editable)}
        >
          <Text className="">
            {editable ? 'Save Changes' : 'Edit Information'}
          </Text>
        </Button>
      </View>
      </View>
    </SafeAreaView>
  )
}