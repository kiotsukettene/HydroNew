import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { ArrowUp, ArrowRight, ArrowDown } from 'lucide-react-native';
import type { TrendDirection } from '@/types/reports';

interface TrendIndicatorProps {
  trend: TrendDirection;
  value?: string | number;
  showLabel?: boolean;
}

export function TrendIndicator({ trend, value, showLabel = true }: TrendIndicatorProps) {
  const getTrendConfig = () => {
    switch (trend) {
      case 'improving':
        return {
          icon: ArrowUp,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          label: 'Improving',
        };
      case 'stable':
        return {
          icon: ArrowRight,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          label: 'Stable',
        };
      case 'declining':
        return {
          icon: ArrowDown,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          label: 'Declining',
        };
      case 'insufficient_data':
        return {
          icon: ArrowRight,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'Insufficient Data',
        };
      default:
        return {
          icon: ArrowRight,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          label: 'No Data',
        };
    }
  };

  const config = getTrendConfig();

  return (
    <View className="flex-row items-center gap-2">
      <View className={`${config.bgColor} rounded-full p-1.5`}>
        <Icon as={config.icon} size={16} className={config.color} />
      </View>
      {showLabel && (
        <View>
          <Text className={`text-sm font-semibold ${config.color}`}>
            {config.label}
          </Text>
          {value !== undefined && (
            <Text className="text-xs text-muted-foreground">{value}</Text>
          )}
        </View>
      )}
    </View>
  );
}

