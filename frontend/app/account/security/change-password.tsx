import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Eye,
  EyeClosed,
  Trash
} from 'lucide-react-native';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { InputWithIcon } from '@/components/ui/input-with-icon';
import { Text } from '@/components/ui/text';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useAccountStore } from '@/store/account/accountStore';
import { PasswordStrengthMeter } from '@/components/ui/password-stength-meter';
import { changePasswordSchema } from '@/validators/accountSchema';
import { ZodError } from 'zod';
import { toast } from 'sonner-native'; // ✅ or your own toast library

export default function SecuritySettings() {
  const { updatePassword } = useAccountStore();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleUpdatePassword = async () => {
    try {
      setErrors({}); // reset old errors

      const validatedData = changePasswordSchema.parse({
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      await updatePassword(validatedData);

      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowModal(false);

      toast.success('Password updated successfully');
      } catch (error: any) {
        if (error instanceof ZodError) {
          const fieldErrors: Record<string, string> = {};
          error.errors.forEach((err) => {
            if (err.path[0]) fieldErrors[err.path[0]] = err.message;
          });
          setErrors(fieldErrors);
        } else if (error.message === 'Current password is incorrect.') {
          setErrors({ current_password: 'Current password is incorrect.' });
        } else {
          toast.error('Failed to update password. Please try again.');
        }
      }
      finally {
        setShowModal(false);
      }
  };

  const handleChange = (field: string, value: string, setter: (v: string) => void) => {
    setter(value);
    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          className="px-4 flex-1 justify-between"
        >
          {/* ================= Title page  ==================== */}
          <PageHeader title="Change Password" showNotificationButton={false} />
          <Text className="text-muted-foreground font-poppins-medium text-center mt-4">
            Create a new password for your account
          </Text>

          {/* ================= Main Body  ==================== */}
          <View className="w-full mt-8 px-4 gap-3">
            {/* Old Password */}
            <View>
              <Label className="font-normal text-muted-foreground mb-2">Old Password</Label>
              <InputWithIcon
                placeholder="●●●●●●●●●"
                value={oldPassword}
                onChangeText={(v) => handleChange('current_password', v, setOldPassword)}
                secureTextEntry={!showOld}
                className={`text-base text-black ${
                  errors.current_password ? 'border-red-500' : 'border-muted-foreground/50'
                }`}
                onIconPress={() => setShowOld(!showOld)}
                rightIcon={
                  !showOld ? (
                    <EyeClosed size={20} color="#6C7278" />
                  ) : (
                    <Eye size={20} color="#6C7278" />
                  )
                }
              />
              {errors.current_password && (
                <Text className="text-red-500 text-xs mt-1">{errors.current_password}</Text>
              )}
            </View>

            {/* New Password */}
            <View>
              <Label className="font-normal text-muted-foreground mb-2">New Password</Label>
              <InputWithIcon
                placeholder="●●●●●●●●●"
                value={newPassword}
                onChangeText={(v) => handleChange('new_password', v, setNewPassword)}
                secureTextEntry={!showNew}
                className={`text-base text-black ${
                  errors.new_password ? 'border-red-500' : 'border-muted-foreground/50'
                }`}
                onIconPress={() => setShowNew(!showNew)}
                rightIcon={
                  !showNew ? (
                    <EyeClosed size={20} color="#6C7278" />
                  ) : (
                    <Eye size={20} color="#6C7278" />
                  )
                }
              />
              {errors.new_password && (
                <Text className="text-red-500 text-xs mt-1">{errors.new_password}</Text>
              )}
            </View>

            {/* Confirm Password */}
            <View>
              <Label className="font-normal text-muted-foreground mb-2">Confirm Password</Label>
              <InputWithIcon
                placeholder="●●●●●●●●●"
                value={confirmPassword}
                onChangeText={(v) =>
                  handleChange('new_password_confirmation', v, setConfirmPassword)
                }
                secureTextEntry={!showConfirm}
                className={`text-base text-black ${
                  errors.new_password_confirmation ? 'border-red-500' : 'border-muted-foreground/50'
                }`}
                onIconPress={() => setShowConfirm(!showConfirm)}
                rightIcon={
                  !showConfirm ? (
                    <EyeClosed size={20} color="#6C7278" />
                  ) : (
                    <Eye size={20} color="#6C7278" />
                  )
                }
              />
              {errors.new_password_confirmation && (
                <Text className="text-red-500 text-xs mt-1">
                  {errors.new_password_confirmation}
                </Text>
              )}
            </View>

            <PasswordStrengthMeter password={newPassword} />
          </View>

          <View className="w-full px-4 mb-4">
            <Button
              className="bg-primary py-3 rounded-full"
              onPress={() => setShowModal(true)}
            >
              <Text className="text-white text-center font-poppins-medium">
                Change Password
              </Text>
            </Button>
          </View>

          {/* ================= Confirmation Modal ==================== */}
          <ConfirmationModal
            visible={showModal}
            icon={<Trash size={40} color="#ffff" />}
            iconBgColor="bg-primary"
            modalTitle="Change Password?"
            modalDescription="Are you sure you want to update your password?"
            confirmText="Confirm"
            confirmButtonColor="bg-primary"
            onConfirm={handleUpdatePassword}
            onCancel={() => setShowModal(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
