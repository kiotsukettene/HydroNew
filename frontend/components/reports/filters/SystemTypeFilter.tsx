import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import type { SystemType } from '@/types/reports';

interface SystemTypeFilterProps {
  value: SystemType;
  onChange: (value: SystemType) => void;
}

export function SystemTypeFilter({ value, onChange }: SystemTypeFilterProps) {
  const options: { value: SystemType; label: string }[] = [
    { value: 'dirty_water', label: 'Dirty Water' },
    { value: 'clean_water', label: 'Clean Water' },
    { value: 'hydroponics_water', label: 'Hydroponics Water' },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-900 mb-3">System Type</Text>
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

