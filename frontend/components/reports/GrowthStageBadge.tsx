import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import type { GrowthStage } from '@/types/reports';

interface GrowthStageBadgeProps {
  stage: GrowthStage;
  size?: 'sm' | 'md' | 'lg';
}

export function GrowthStageBadge({ stage, size = 'md' }: GrowthStageBadgeProps) {
  const getStageConfig = () => {
    switch (stage) {
      case 'seedling':
        return {
          bg: 'bg-green-100',
          textColor: 'text-green-700',
          text: 'Seedling',
        };
      case 'vegetative':
        return {
          bg: 'bg-blue-100',
          textColor: 'text-blue-700',
          text: 'Vegetative',
        };
      case 'flowering':
        return {
          bg: 'bg-purple-100',
          textColor: 'text-purple-700',
          text: 'Flowering',
        };
      case 'harvest-ready':
        return {
          bg: 'bg-orange-100',
          textColor: 'text-orange-700',
          text: 'Harvest Ready',
        };
      default:
        return {
          bg: 'bg-gray-100',
          textColor: 'text-gray-700',
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

  const config = getStageConfig();

  return (
    <View className={`${config.bg} rounded-full items-center justify-center ${getSizeClass()}`}>
      <Text className={`${config.textColor} font-semibold`}>{config.text}</Text>
    </View>
  );
}

