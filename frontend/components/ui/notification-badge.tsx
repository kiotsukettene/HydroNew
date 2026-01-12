import React from 'react';
import { View } from 'react-native';
import { BellIcon } from 'lucide-react-native';
import { Text } from '@/components/ui/text';

interface NotificationBadgeProps {
  count?: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export function NotificationBadge({
  count = 0,
  size = 24,
  color = '#445104',
  strokeWidth = 3,
}: NotificationBadgeProps) {
  return (
    <View className="relative">
      <BellIcon size={size} color={color} strokeWidth={strokeWidth} />
      {count > 0 && (
        <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1">
          <Text className="text-white text-[10px] font-bold">
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </View>
  );
}

