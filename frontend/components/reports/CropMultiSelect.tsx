import { View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Check } from 'lucide-react-native';

interface CropMultiSelectProps {
  selectedCrops: string[];
  onSelectionChange: (crops: string[]) => void;
  availableCrops?: string[];
  minSelection?: number;
  maxSelection?: number;
  label?: string;
}

export function CropMultiSelect({ 
  selectedCrops, 
  onSelectionChange,
  availableCrops = ['lettuce', 'tomato', 'cucumber', 'spinach', 'basil', 'kale'],
  minSelection = 2,
  maxSelection = 4,
  label = 'Select Crops to Compare'
}: CropMultiSelectProps) {
  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      // Don't allow removal if at minimum
      if (selectedCrops.length > minSelection) {
        onSelectionChange(selectedCrops.filter(c => c !== crop));
      }
    } else {
      // Don't allow adding if at maximum
      if (selectedCrops.length < maxSelection) {
        onSelectionChange([...selectedCrops, crop]);
      }
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-gray-700 mb-2">
        {label} ({selectedCrops.length}/{maxSelection} selected)
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="flex-row gap-2"
      >
        {availableCrops.map((crop) => {
          const isSelected = selectedCrops.includes(crop);
          return (
            <TouchableOpacity
              key={crop}
              activeOpacity={0.7}
              onPress={() => toggleCrop(crop)}
            >
              <Card className={`px-4 py-2.5 border ${isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/20 bg-white'}`}>
                <View className="flex-row items-center gap-2">
                  {isSelected && (
                    <Icon as={Check} size={16} className="text-white" />
                  )}
                  <Text className={`text-sm font-semibold capitalize ${isSelected ? 'text-white' : 'text-gray-700'}`}>
                    {crop}
                  </Text>
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {selectedCrops.length < minSelection && (
        <Text className="text-xs text-red-500 mt-2">
          Please select at least {minSelection} crops to compare
        </Text>
      )}
    </View>
  );
}

