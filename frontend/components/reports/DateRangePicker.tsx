import { View, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Calendar } from 'lucide-react-native';
import { Icon } from '@/components/ui/icon';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
  label?: string;
}

export function DateRangePicker({ 
  startDate, 
  endDate, 
  onDateRangeChange,
  label = 'Date Range'
}: DateRangePickerProps) {
  const presets = [
    { label: '7 Days', days: 7 },
    { label: '30 Days', days: 30 },
    { label: '90 Days', days: 90 },
  ];

  const handlePresetSelect = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    
    onDateRangeChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    );
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      
      {/* Preset Buttons */}
      <View className="flex-row gap-2 mb-3">
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.days}
            activeOpacity={0.7}
            onPress={() => handlePresetSelect(preset.days)}
            className="flex-1"
          >
            <Card className="p-3 border border-primary/30 bg-primary/5 items-center">
              <Text className="text-sm font-semibold text-primary">{preset.label}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Selection Display */}
      <Card className="p-3 border border-muted-foreground/20">
        <View className="flex-row items-center gap-2">
          <Icon as={Calendar} size={16} className="text-muted-foreground" />
          <Text className="text-sm text-gray-700">
            {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
          </Text>
        </View>
      </Card>
    </View>
  );
}

