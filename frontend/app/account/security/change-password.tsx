import {
  Image,
  View,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Eye,
  EyeClosed,
  ArrowLeft,
  Trash
} from 'lucide-react-native'
import { Input } from '@/components/ui/input';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header';
import { useAccountStore } from '@/store/account/accountStore';
import { PasswordStrengthMeter } from '@/components/ui/password-stength-meter';

export default function SecuritySettings() {
  const { updatePassword } = useAccountStore();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      return;
    }
    try {
      await updatePassword({
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      setShowModal(false);
    } catch (error) {
    }
  };

  return (
    <SafeAreaView className='flex-1'>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <View className='px-4 flex-1 items-center justify-between'>
          {/* ================= Title page  ==================== */}
          <View>
            <PageHeader title="Change Password" showNotificationButton={false} />
            <Text className="text-muted-foreground font-poppins-medium text-center mt-4">
              Create a new password for your account
            </Text>
            {/* ================= Main Body  ==================== */}
            <View className='w-full mt-8 px-4 gap-3'>
              <View>
                <Label className="font-normal text-muted-foreground mb-2">Old Password</Label>
                <InputWithIcon
                  placeholder="●●●●●●●●●"
                  value={oldPassword}
                  onChangeText={setOldPassword}
                  secureTextEntry={!showOld}
                  className='border-muted-foreground/50 text-base text-black'
                  onIconPress={() => setShowOld(!showOld)}
                  rightIcon={
                      !showOld ? (
                        <EyeClosed size={20} color="#6C7278" />
                      ) : (
                        <Eye size={20} color="#6C7278" />
                      )}
                  />
              </View>
              <View>
              <Label className="font-normal text-muted-foreground mb-2">New Password</Label>
                <InputWithIcon
                  placeholder="●●●●●●●●●"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNew}
                  className='border-muted-foreground/50 text-base text-black'
                  onIconPress={()=> setShowNew(!showNew)}
                  rightIcon={
                    !showNew ? (
                      <EyeClosed size={20} color="#6C7278" />
                    ) : (
                      <Eye size={20} color="#6C7278" />
                    )
                  }
                  />
            </View>
            <View>
              <Label className="font-normal text-muted-foreground mb-2">Confirm Password</Label>
                <InputWithIcon
                  placeholder="●●●●●●●●●"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirm}
                  className='border-muted-foreground/50 text-base text-black'
                  onIconPress={() => setShowConfirm(!showConfirm)}
                  rightIcon={
                    !showConfirm ? (
                      <EyeClosed size={20} color="#6C7278" />
                    ) : (
                      <Eye size={20} color="#6C7278" />
                    )
                  }
                />
              </View>
              <PasswordStrengthMeter password={newPassword} />
            </View>
          </View>
          <View className='w-full px-4 mb-4'>
            <Button 
              className='bg-primary py-3 rounded-full'
              onPress={() => setShowModal(true)}
            >
              <Text className='text-white text-center font-poppins-medium'>
                Change Password
              </Text>
            </Button>
          </View>

          {/* ================= Confirmation Modal ==================== */}
          <ConfirmationModal
            visible={showModal}
            icon={<Trash size={40} color="#ffff"/>} 
            iconBgColor="bg-primary"
            modalTitle="Change Password?"
            modalDescription="Are you sure you want to update your password?"
            confirmText="Confirm"
            confirmButtonColor="bg-primary"
            onConfirm={handleUpdatePassword}
            onCancel={() => setShowModal(false)}
          />

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}