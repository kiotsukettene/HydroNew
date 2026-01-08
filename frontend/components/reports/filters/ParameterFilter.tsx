import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import type { WaterParameter } from '@/types/reports';

interface ParameterFilterProps {
  value: WaterParameter;
  onChange: (value: WaterParameter) => void;
  availableParameters?: WaterParameter[];
}

export function ParameterFilter({ 
  value, 
  onChange,
  availableParameters = ['ph', 'tds', 'ec', 'turbidity', 'temperature', 'humidity']
}: ParameterFilterProps) {
  const getParameterLabel = (param: WaterParameter): string => {
    const labels: Record<WaterParameter, string> = {
      ph: 'pH',
      tds: 'TDS',
      ec: 'EC',
      turbidity: 'Turbidity',
      temperature: 'Temperature',
      humidity: 'Humidity',
    };
    return labels[param];
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-900 mb-3">Parameter</Text>
      <View className="gap-2">
        {availableParameters.map((param) => (
          <TouchableOpacity
            key={param}
            activeOpacity={0.7}
            onPress={() => onChange(param)}
            className={`p-3 rounded-lg border ${
              value === param 
                ? 'bg-primary border-primary' 
                : 'bg-white border-muted-foreground/20'
            }`}
          >
            <Text className={`text-sm font-medium ${
              value === param ? 'text-white' : 'text-gray-900'
            }`}>
              {getParameterLabel(param)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

