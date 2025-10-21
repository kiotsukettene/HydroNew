import React from 'react';
import { View } from 'react-native';
import { ArrowLeft, BellIcon } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';

interface PageHeaderProps {
  title: string;
  onBackPress?: () => void;
  onNotificationPress?: () => void;
  showBackButton?: boolean;
  showNotificationButton?: boolean;
}

export function PageHeader({
  title,
  onBackPress,
  onNotificationPress,
  showBackButton = true,
  showNotificationButton = true,
}: PageHeaderProps) {
  const router = useRouter();

  const handleNotificationPress = () => {
    if (onNotificationPress) {
      onNotificationPress();
    } else {
      router.push('/notifications');
    }
  };

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };
  return (
    <View className="flex-row items-center justify-between px-4 py-3 ">
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

      {/* Right Side - Notification Button */}
      <View className="flex-1 items-end">
        {showNotificationButton ? (
          <Button
            variant="ghost"
            onPress={handleNotificationPress}
            className="w-10 h-10 p-0"
          >
            <BellIcon size={24} color="#445104" strokeWidth={3} />
          </Button>
        ) : (
          <View className="w-10" />
        )}
      </View>
    </View>
  );
}
