import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

interface IntervalFilterProps {
  value: 'hourly' | 'daily' | 'weekly';
  onChange: (value: 'hourly' | 'daily' | 'weekly') => void;
}

export function IntervalFilter({ value, onChange }: IntervalFilterProps) {
  const options: Array<{ value: 'hourly' | 'daily' | 'weekly'; label: string }> = [
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-900 mb-3">Interval</Text>
      <View className="gap-2">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.7}
            onPress={() => onChange(option.value)}
            className={`p-3 rounded-lg border ${
              value === option.value 
                ? 'bg-primary border-primary' 
                : 'bg-white border-muted-foreground/20'
            }`}
          >
            <Text className={`text-sm font-medium ${
              value === option.value ? 'text-white' : 'text-gray-900'
            }`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

