import {
  Image,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  User,
  Camera,
  AtSign,
  Calendar,
  ArrowLeft,
} from 'lucide-react-native'
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useAccountStore } from '@/store/account/accountStore';

export default function ManageAccount() {

  const { account, updateAccount, updateProfilePicture } = useAccountStore();

  const [editable, isEditable] = useState(false);
  const [firstName, setFirstName] = useState(account?.first_name || "Juan");
  const [lastName, setLastName] = useState(account?.last_name || "Dela Cruz");
  const [email, setEmail] = useState(account?.email || "juan.delacruz@example.com");
  const [address, setAddress] = useState(account?.address || "123 Main St, Anytown, USA");
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

  const handleUpdateAccount = async () => {
    try {

      await updateAccount({
        first_name: firstName,
        last_name: lastName,
        address,
      });

      // if (profileImage) {
      //  await updateProfilePicture({ profile_image: profileImage });
      //  setProfileImage(profileImage);
      //}
      isEditable(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
             {/* ================= Title  ==================== */}
            <PageHeader title="Manage Account" showNotificationButton={false} />
          <View className='px-4 flex-1 justify-between'>
            <View>
              
              <View className='items-center'>
             
                {/* ================= Profile Image  ==================== */}
                <View className="relative items-center mt-3">
                  <Image
                    source={profileImage ? { uri: profileImage } : require('@/assets/images/no-profile.jpg')}
                    resizeMode="contain"
                    className="size-32 rounded-full"
                  />
                  {editable && (
                    <Pressable
                      className="absolute bottom-0 right-2 bg-primary size-10 rounded-full items-center justify-center border-2 border-white shadow-md"
                      onPress={openImagePicker}
                      >
                      <Camera size={24} color="white" />
                    </Pressable>
                  )}
                </View>
              </View>
              {/* ================= Main Body ==================== */}
              {/*first name */}
              <View className='mt-6 gap-1'>
                <Label className="font-normal text-muted-foreground">First Name</Label>
                <InputWithIcon
                  value={firstName}
                  onChangeText={setFirstName}
                  editable={editable}
                  rightIcon={<AtSign size={20} color="#6B7280" />}
                  placeholder='First Name'
                  autoCapitalize='none'
                  className="border-muted-foreground/50 text-base text-black"
                > 
                </InputWithIcon> 
              </View>
              {/*lastname */}
              <View className='mt-2 gap-1'>
                <Label className="font-normal text-muted-foreground">Last Name</Label>
                <InputWithIcon
                  value={lastName}
                  onChangeText={setLastName}
                  editable={editable}
                  placeholder='Last Name'
                  rightIcon={<User size={20} color="#6B7280" />}
                  autoCapitalize='none'
                  className="border-muted-foreground/50 text-base text-black"
                >
                </InputWithIcon>
              </View>
              {/*email */}
              <View className='mt-2 gap-1'>
                <Label className="font-normal text-muted-foreground">Email</Label>
                <InputWithIcon
                  value={email}
                  onChangeText={setEmail}
                  editable={false}
                  placeholder='email' 
                  autoCapitalize='none'
                  className="border-muted-foreground/50 text-base text-black"
                >
                </InputWithIcon>
              </View>
              {/*contact */}
              {/*birthdate */}
              <View className='mt-2 gap-1'>
                <Label className="font-normal text-muted-foreground">Address</Label>
                <InputWithIcon
                  value={address}
                  onChangeText={setAddress}
                  editable={editable}
                  placeholder='address'
                  autoCapitalize='none'
                  className="border-muted-foreground/50 text-base text-black"
                >
                </InputWithIcon>
              </View>
            </View>
            <View className='mb-4'>
            <Button
              onPress={ () => {
                if (editable) {
                  handleUpdateAccount(); 
                }
                isEditable(!editable);
              }}
            >
              <Text>
                {editable ? 'Save Changes' : 'Edit Information'}
              </Text>
            </Button>
            </View>
            {/* ================= end of main body  ==================== */}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}