import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

interface DaysFilterProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

export function DaysFilter({ 
  value, 
  onChange,
  options = [7, 14, 30, 60, 90]
}: DaysFilterProps) {
  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-900 mb-3">Time Period</Text>
      <View className="gap-2">
        {options.map((days) => (
          <TouchableOpacity
            key={days}
            activeOpacity={0.7}
            onPress={() => onChange(days)}
            className={`p-3 rounded-lg border ${
              value === days 
                ? 'bg-primary border-primary' 
                : 'bg-white border-muted-foreground/20'
            }`}
          >
            <Text className={`text-sm font-medium ${
              value === days ? 'text-white' : 'text-gray-900'
            }`}>
              {days} Days
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

