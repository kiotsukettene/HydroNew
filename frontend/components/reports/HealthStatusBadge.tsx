import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import type { HealthStatus } from '@/types/reports';

interface HealthStatusBadgeProps {
  status: HealthStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function HealthStatusBadge({ status, size = 'md' }: HealthStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'good':
        return {
          bg: 'bg-primary',
          text: 'Good',
        };
      case 'moderate':
        return {
          bg: 'bg-yellow-500',
          text: 'Moderate',
        };
      case 'poor':
        return {
          bg: 'bg-red-500',
          text: 'Poor',
        };
      default:
        return {
          bg: 'bg-gray-500',
          text: 'Unknown',
        };
    }
  };

  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1.5 text-sm';
    }
  };

  const config = getStatusConfig();

  return (
    <View className={`${config.bg} rounded-full items-center justify-center ${getSizeClass()}`}>
      <Text className="text-white font-semibold">{config.text}</Text>
    </View>
  );
}

