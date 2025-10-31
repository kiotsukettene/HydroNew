import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { ArrowLeft, BellIcon, MoreHorizontal, LogOut } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth/authStore';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  onEllipsisPress?: () => void;
  showBackButton?: boolean;
  showNotificationButton?: boolean;
  showEllipsisButton?: boolean;
}

export function PageHeader({
  title,
  onBackPress,
  onNotificationPress,
  onEllipsisPress,
  showBackButton = true,
  showNotificationButton = true,
  showEllipsisButton = false,
}: PageHeaderProps) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/notifications');
    }
  };

  const handleEllipsisPress = () => {
    if (onEllipsisPress) {
      onEllipsisPress();
      return;
    }
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setShowLogoutModal(false);
    await logout();
    router.replace('/(auth)/login');
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };
  return (
    <>
    <View className="flex-row items-center justify-between px-4 py-3">
      {/* Left Side - Back Button */}
      <View className="flex-1">
        {showBackButton ? (
          <Button
            variant="ghost"
            onPress={handleBackPress}
            className="w-10 h-10 p-0"
          >
            <ArrowLeft size={24} color="#000000" strokeWidth={2} />
          </Button>
        ) : (
          <View className="w-10" />
        )}
      </View>

      {/* Center - Title */}
      <View className="flex-2 items-center">
        <Text className="text-lg font-bold text-black">
          {title}
        </Text>
      </View>

      {/* Right Side - Notification and Ellipsis Buttons */}
      <View className="flex-1 flex-row items-center justify-end gap-2">
        {showNotificationButton && (
          <Button
            variant="ghost"
            onPress={handleNotificationPress}
            className="w-10 h-10 p-0"
          >
            <BellIcon size={24} color="#445104" strokeWidth={3} />
          </Button>
        )}
        {showEllipsisButton && (
          <Button
            variant="ghost"
            onPress={handleEllipsisPress}
            className="w-10 h-10 p-0"
          >
            <MoreHorizontal size={24} color="#000000" strokeWidth={2} />
          </Button>
        )}
        {!showNotificationButton && !showEllipsisButton && (
          <View className="w-10" />
        )}
      </View>
    </View>

    {/* Logout Confirmation Modal */}
    <ConfirmationModal
      visible={showLogoutModal}
      icon={<LogOut size={40} color="#fff" />}
      modalTitle="Logout"
      modalDescription="Are you sure you want to logout?"
      confirmText="Logout"
      iconBgColor="bg-red-500"
      confirmButtonColor="bg-red-500 active:bg-red-600"
      onCancel={() => setShowLogoutModal(false)}
      onConfirm={confirmLogout}
    />
    </>
  );
}
