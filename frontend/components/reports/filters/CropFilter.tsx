import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { Check } from 'lucide-react-native';

interface CropFilterProps {
  selectedCrops: string[];
  onSelectionChange: (crops: string[]) => void;
  availableCrops?: string[];
  minSelection?: number;
  maxSelection?: number;
}

export function CropFilter({ 
  selectedCrops, 
  onSelectionChange,
  availableCrops = ['lettuce', 'tomato', 'cucumber', 'spinach', 'basil', 'kale'],
  minSelection = 2,
  maxSelection = 4,
}: CropFilterProps) {
  const toggleCrop = (crop: string) => {
    if (selectedCrops.includes(crop)) {
      // Remove crop if not at minimum
      if (selectedCrops.length > minSelection) {
        onSelectionChange(selectedCrops.filter(c => c !== crop));
      }
    } else {
      // Add crop if not at maximum
      if (selectedCrops.length < maxSelection) {
        onSelectionChange([...selectedCrops, crop]);
      }
    }
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-900 mb-3">
        Select Crops ({selectedCrops.length}/{maxSelection})
      </Text>
      <View className="gap-2">
        {availableCrops.map((crop) => {
          const isSelected = selectedCrops.includes(crop);
          const isDisabled = !isSelected && selectedCrops.length >= maxSelection;
          
          return (
            <TouchableOpacity
              key={crop}
              activeOpacity={0.7}
              onPress={() => !isDisabled && toggleCrop(crop)}
              className={`p-3 rounded-lg border flex-row items-center justify-between ${
                isSelected 
                  ? 'bg-primary border-primary' 
                  : 'bg-white border-muted-foreground/20'
              } ${isDisabled ? 'opacity-50' : ''}`}
              disabled={isDisabled}
            >
              <Text className={`text-sm font-medium capitalize ${
                isSelected ? 'text-white' : 'text-gray-900'
              }`}>
                {crop}
              </Text>
              {isSelected && (
                <Icon as={Check} size={18} className="text-white" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
      {selectedCrops.length < minSelection && (
        <Text className="text-xs text-red-500 mt-2">
          Select at least {minSelection} crops
        </Text>
      )}
    </View>
  );
}

