import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import type { SystemType } from '@/types/reports';

interface SystemTypeSelectorProps {
  value: SystemType;
  onChange: (value: SystemType) => void;
  label?: string;
}

export function SystemTypeSelector({ 
  value, 
  onChange,
  label = 'System Type'
}: SystemTypeSelectorProps) {
  const options: { value: SystemType; label: string }[] = [
    { value: 'dirty_water', label: 'Dirty Water' },
    { value: 'clean_water', label: 'Clean Water' },
    { value: 'hydroponics_water', label: 'Hydroponics Water' },
  ];

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <View className="flex-row bg-gray-100 rounded-xl p-1">
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.7}
            className={`flex-1 py-2.5 rounded-lg ${value === option.value ? 'bg-primary' : 'bg-transparent'}`}
            onPress={() => onChange(option.value)}
          >
            <Text className={`text-center text-xs font-semibold ${value === option.value ? 'text-white' : 'text-muted-foreground'}`}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

