import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (startDate: string, endDate: string) => void;
}

export function DateRangeFilter({ 
  startDate, 
  endDate, 
  onDateRangeChange 
}: DateRangeFilterProps) {
  const presets = [
    { label: 'Last 7 Days', days: 7 },
    { label: 'Last 30 Days', days: 30 },
    { label: 'Last 90 Days', days: 90 },
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

  const getCurrentPreset = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const preset = presets.find(p => Math.abs(p.days - diffDays) <= 1);
    return preset ? preset.days : null;
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const currentPreset = getCurrentPreset();

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-900 mb-3">Date Range</Text>
      <View className="gap-2">
        {presets.map((preset) => (
          <TouchableOpacity
            key={preset.days}
            activeOpacity={0.7}
            onPress={() => handlePresetSelect(preset.days)}
            className={`p-3 rounded-lg border ${
              currentPreset === preset.days 
                ? 'bg-primary border-primary' 
                : 'bg-white border-muted-foreground/20'
            }`}
          >
            <Text className={`text-sm font-medium ${
              currentPreset === preset.days ? 'text-white' : 'text-gray-900'
            }`}>
              {preset.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mt-3 p-2 bg-gray-50 rounded-lg">
        <Text className="text-xs text-muted-foreground text-center">
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </Text>
      </View>
    </View>
  );
}

