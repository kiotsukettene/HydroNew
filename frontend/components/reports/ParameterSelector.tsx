import { View, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import type { WaterParameter } from '@/types/reports';

interface ParameterSelectorProps {
  value: WaterParameter;
  onChange: (value: WaterParameter) => void;
  label?: string;
  availableParameters?: WaterParameter[];
}

export function ParameterSelector({ 
  value, 
  onChange,
  label = 'Parameter',
  availableParameters = ['ph', 'tds', 'ec', 'turbidity', 'temperature', 'humidity']
}: ParameterSelectorProps) {
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
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-2"
      >
        {availableParameters.map((param) => {
          const isSelected = value === param;
          return (
            <TouchableOpacity
              key={param}
              activeOpacity={0.7}
              onPress={() => onChange(param)}
            >
              <Card className={`px-4 py-2.5 border ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/20 bg-white'}`}>
                <Text className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                  {getParameterLabel(param)}
                </Text>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

