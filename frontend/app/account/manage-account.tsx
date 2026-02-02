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
  UserRound,
  Pencil,
  Check,
  X,
} from 'lucide-react-native'
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useAccountStore } from '@/store/account/accountStore';
import { accountSchema } from '@/validators/accountSchema';
import { ZodError } from 'zod';
import { toast } from 'sonner-native';

export default function ManageAccount() {

  const { account, updateAccount, fetchAccount } = useAccountStore();

  const [editable, isEditable] = useState(false);
  const [firstName, setFirstName] = useState(account?.first_name || "Juan");
  const [lastName, setLastName] = useState(account?.last_name || "Dela Cruz");
  const [email, setEmail] = useState(account?.email || "juan.delacruz@example.com");
  const [address, setAddress] = useState(account?.address || "Bagong Silang, Caloocan City");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [initialEditValues, setInitialEditValues] = useState<{ firstName: string; lastName: string; address: string } | null>(null);

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

    useEffect(() => {
    if (!account) {
      fetchAccount();
    }
  }, []);

//handle button function
const handleUpdateAccount = async () => {
  try {
    setErrors({});

    const validatedData = accountSchema.parse({
      first_name: firstName,
      last_name: lastName,
      email: email,
      address: address,
    });

    await updateAccount(validatedData);
    toast.success('Account updated successfully!');
    return true;

  } catch (error) {
    if (error instanceof ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    } else {
      console.error(error);
      toast.error('Account update failed. Please try again.');
      return false;
    }
  }
};

  const hasChanges = editable && initialEditValues && (
    firstName !== initialEditValues.firstName ||
    lastName !== initialEditValues.lastName ||
    address !== initialEditValues.address
  );

  const handleCancelEdit = () => {
    if (initialEditValues) {
      setFirstName(initialEditValues.firstName);
      setLastName(initialEditValues.lastName);
      setAddress(initialEditValues.address);
    }
    setErrors({});
    setProfileImage(null);
    setInitialEditValues(null);
    isEditable(false);
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
                  {/* <Image
                    source={profileImage ? { uri: profileImage } : require('@/assets/images/no-profile.jpg')}
                    resizeMode="contain"
                    className="size-32 rounded-full"
                  /> */}

                  <UserRound size={96} color="#a1a1aa" />


                 
                </View>
              </View>
              {/* ================= Main Body ==================== */}
              {/*first name */}
              <View className='mt-6 gap-1'>
                <Label className="font-normal text-muted-foreground">First Name</Label>
                <InputWithIcon
                  value={firstName}
                    onChangeText={(value) => {
                      setFirstName(value);
                      if (errors.first_name) {
                        setErrors((prev) => ({ ...prev, first_name: "" }));
                      }
                    }}
                  editable={editable}
                  placeholder='First Name'
                  autoCapitalize='none'
                  className={`border text-base text-black ${
                    errors.first_name ? 'border-red-500' : 'border-muted-foreground/50'
                  }`}
                />
                {errors.first_name && (
                  <Text className="text-red-500 text-sm">{errors.first_name}</Text>
                )}
              </View>

              {/*lastname */}
              <View className='mt-2 gap-1'>
                <Label className="font-normal text-muted-foreground">Last Name</Label>
                <InputWithIcon
                  value={lastName}
                  onChangeText={(value) => {
                    setLastName(value);
                    if (errors.last_name) {
                      setErrors((prev) => ({ ...prev, last_name: "" }));
                    }
                  }}
                  editable={editable}
                  placeholder='Last Name'
                  autoCapitalize='none'
                  className={`border text-base text-black ${
                    errors.last_name ? 'border-red-500' : 'border-muted-foreground/50'
                  }`}
                />
                {errors.last_name && (
                  <Text className="text-red-500 text-sm">{errors.last_name}</Text>
                )}
              </View>

              {/*email */}
              <View className='mt-2 gap-1'>
                <Label className="font-normal text-muted-foreground">Email</Label>
                <InputWithIcon
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    if (errors.email) {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                  editable={false}
                  placeholder='email' 
                  autoCapitalize='none'
                  className={`border text-base text-black ${
                    errors.email ? 'border-red-500' : 'border-muted-foreground/50'
                  }`}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm">{errors.email}</Text>
                )}
              </View>

              {/*contact */}

              {/*Address */}
              <View className='mt-2 gap-1'>
                <Label className="font-normal text-muted-foreground">Address</Label>
                <InputWithIcon
                  value={address}
                  onChangeText={(value) => {
                    setAddress(value);
                    if (errors.address) {
                      setErrors((prev) => ({ ...prev, address: "" }));
                    }
                  }}
                  editable={editable}
                  placeholder='address'
                  autoCapitalize='none'
                  className={`border text-base text-black ${
                    errors.address ? 'border-red-500' : 'border-muted-foreground/50'
                  }`}
                />
                {errors.address && (
                  <Text className="text-red-500 text-sm">{errors.address}</Text>
                )}
              </View>


              {/* ================= Buttons ==================== */}
              <View className='mt-16 gap-3'>
              {editable ? (
                <View className="flex-col gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onPress={handleCancelEdit}
                  >
                    <X size={18} className="mr-2" />
                    <Text>Cancel</Text>
                  </Button>
                  <Button
                    className="flex-1"
                    disabled={!hasChanges}
                    onPress={async () => {
                      const result = await handleUpdateAccount();
                      if (!result) return;
                      isEditable(false);
                      setInitialEditValues(null);
                    }}
                  >
                    <Check size={18} color="white" className="mr-2" />
                    <Text>Save Changes</Text>
                  </Button>
                </View>
              ) : (
                <Button
                  onPress={() => {
                    setInitialEditValues({ firstName, lastName, address });
                    isEditable(true);
                  }}
                >
                  <Pencil size={18} color="white" className="mr-2" />
                  <Text>Edit Account Information</Text>
                </Button>
              )}
            </View>
            </View>
          
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}