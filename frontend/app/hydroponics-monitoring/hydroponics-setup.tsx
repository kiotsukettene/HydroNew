import { View, Image, TouchableOpacity, ScrollView, Alert, Switch, Animated } from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useRouter } from 'expo-router';

import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar, CheckCircle, ChevronDown, Play, Plus, Minus, Leaf } from 'lucide-react-native';
import { Badge } from '@/components/ui/badge';


interface HydroponicsSetupData {
  cropName: string;
  numberOfCrops: string;
  bedSize: 'small' | 'medium' | 'large';
  nutrientSolution: string;
  targetPh: string;
  targetPhMax: string;
  targetTdsMin: string;
  targetTdsMax: string;
  waterAmount: string;
  setupDate: string;
  status: 'active';
}

interface HydroponicsSetupProps {
  onSetupComplete?: () => void;
}

export default function HydroponicsSetup({ onSetupComplete }: HydroponicsSetupProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<HydroponicsSetupData>({
    cropName: '',
    numberOfCrops: '',
    bedSize: 'medium',
    nutrientSolution: '',
    targetPh: '6.5',
    targetPhMax: '7.0',
    targetTdsMin: '800',
    targetTdsMax: '1200',
    waterAmount: '5',
    setupDate: new Date().toISOString().split('T')[0], // Today's date
    status: 'active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBedSizeDropdown, setShowBedSizeDropdown] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handleInputChange = (field: keyof HydroponicsSetupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStepperChange = (field: 'numberOfCrops', delta: number) => {
    const currentValue = parseInt(formData[field]) || 0;
    const newValue = Math.max(1, currentValue + delta);
    handleInputChange(field, newValue.toString());
  };

 
  const validateForm = () => {
    const requiredFields = [
      'cropName', 'numberOfCrops', 'nutrientSolution', 
      'targetPh', 'targetPhMax', 'targetTdsMin', 'targetTdsMax', 'waterAmount'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof HydroponicsSetupData]) {
        Alert.alert('Validation Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Validate numeric fields
    const numericFields = ['numberOfCrops', 'targetPh', 'targetPhMax', 'targetTdsMin', 'targetTdsMax', 'waterAmount'];
    for (const field of numericFields) {
      const value = formData[field as keyof HydroponicsSetupData];
      if (isNaN(Number(value)) || Number(value) <= 0) {
        Alert.alert('Validation Error', `${field.replace(/([A-Z])/g, ' $1').toLowerCase()} must be a valid positive number`);
        return false;
      }
    }
    
    return true;
  };



  const bedSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ];

  return (
    <SafeAreaView className="flex-1 ">
      <View className="flex-1">
        {/* =========== Header Section =========== */}
        <View className="px-6 pt-6 pb-4 ">
       

           <PageHeader title="" />
          <View className="mb-2 mt-4">
            <Text className="text-2xl font-bold ">New Crop Setup</Text>
            <Text className="text-muted-foreground text-base mt-1">Fill in your crop's details to start monitoring</Text>
          </View>
        </View>

        {/* =========== Background Elements =========== */}
        <View className="absolute top-20 right-0 opacity-5">
          <View className="w-32 h-32 bg-[#4CAF50] rounded-full" />
        </View>
        <View className="absolute top-40 left-0 opacity-5">
          <View className="w-24 h-24 bg-[#6ECF8B] rounded-full" />
        </View>

        {/* =========== Form Section =========== */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="pb-8">
            
            {/* Crop Details Card */}
            <Card className="p-6 mb-6 rounded-2xl shadow-sm border-0">
              <View className="mb-6">
                <Text className="text-lg font-semibold  mb-2">Crop Details</Text>
                <View className="w-full h-1 bg-[#4CAF50] rounded-full" />
              </View>
              
              <View className="gap-6">
                {/* Crop Name */}
                <View>
                  <Text className="text-base font-medium  mb-2">Crop Name</Text>
                  <Input
                    placeholder="e.g., Lettuce, Tomatoes, Basil"
                    value={formData.cropName}
                    onChangeText={(value) => handleInputChange('cropName', value)}
                    className="border border-muted-foreground/50 bg-[#FAFFFA]  focus:border-[#4CAF50] text-base"
                    placeholderTextColor="#95A5A6"
                  />
                </View>

                {/* Number of Crops with Stepper */}
                <View>
                  <Text className="text-base font-medium  mb-2">Number of Crops</Text>
                  <View className="flex-row items-center bg-[#FAFFFA] border border-[#E8F5E8] rounded-xl px-3 py-4">
                    <TouchableOpacity
                      onPress={() => handleStepperChange('numberOfCrops', -1)}
                      className="w-8 h-8 rounded-full bg-[#E8F5E8] items-center justify-center"
                    >
                      <Icon as={Minus} size={16} className="text-primary" />
                    </TouchableOpacity>
                    
                    <View className="flex-1 items-center">
                      <Text className="text-lg font-semibold ">
                        {formData.numberOfCrops || '0'}
                      </Text>
                    </View>
                    
                    <Button
                      onPress={() => handleStepperChange('numberOfCrops', 1)}
                      className="w-8 h-8 rounded-full items-center justify-center"
                    >
                      <Icon as={Plus} size={16} className="text-white" />
                    </Button>
                  </View>
                </View>

                {/* Bed Size Dropdown */}
                <View>
                  <Text className="text-base font-medium  mb-2">Bed Size</Text>
                  <TouchableOpacity
                    className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] flex-row items-center justify-between"
                    onPress={() => setShowBedSizeDropdown(!showBedSizeDropdown)}
                  >
                    <Text className="text-[#2C3E50] capitalize text-base">{formData.bedSize}</Text>
                    <Icon as={ChevronDown} size={20} className="text-[#7F8C8D]" />
                  </TouchableOpacity>
                  
                  {showBedSizeDropdown && (
                    <View className="border border-[#E8F5E8] rounded-xl mt-2 bg-white shadow-lg">
                      {bedSizeOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          className="px-3 py-4 border-b border-[#F0F8F0] last:border-b-0"
                          onPress={() => {
                            handleInputChange('bedSize', option.value as 'small' | 'medium' | 'large');
                            setShowBedSizeDropdown(false);
                          }}
                        >
                          <Text className="text-[#2C3E50] capitalize text-base">{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                 {/* Water Amount */}
                <View>
                  <Text className="text-base font-medium text-[#34495E] mb-2">Water Amount (Liters)</Text>
                  <Input
                    value={formData.waterAmount}
                    editable={false}
                    keyboardType="numeric"
                    className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-gray-100 text-[#2C3E50] text-base"
                    placeholderTextColor="#95A5A6"
                  />
                </View>

                {/* Nutrient Solution */}
                <View>
                  <Text className="text-base font-medium  mb-2">Nutrient Solution</Text>
                  <Input
                    placeholder="e.g., General Hydroponics Flora Series"
                    value={formData.nutrientSolution}
                    onChangeText={(value) => handleInputChange('nutrientSolution', value)}
                    className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] text-[#2C3E50] focus:border-[#4CAF50] text-base"
                    placeholderTextColor="#95A5A6"
                  />
                </View>
              </View>
            </Card>

            {/* Target Parameters Card */} 
            {/*  Nutrient and Water Settings */}

            <Card className="p-6 mb-6  shadow-sm border-0">
              <View className="mb-6">
                <Text className="text-lg font-semibold  mb-2">Ideal Growing Range</Text>
                <View className="w-full h-1 bg-[#6ECF8B] rounded-full" />
              </View>
              
              <View className="space-y-5 gap-6">
                {/* pH Range */}
                <View>
                  <Text className="text-base font-medium  mb-3">Target pH Range</Text>
                  <View className="flex-row space-x-3 gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Minimum</Text>
                      <Input
                        placeholder="6.5"
                        value={formData.targetPh}
                        onChangeText={(value) => handleInputChange('targetPh', value)}
                        keyboardType="numeric"
                        className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] text-[#2C3E50] focus:border-[#4CAF50] text-base text-center"
                        placeholderTextColor="#95A5A6"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Maximum</Text>
                      <Input
                        placeholder="7.0"
                        value={formData.targetPhMax}
                        onChangeText={(value) => handleInputChange('targetPhMax', value)}
                        keyboardType="numeric"
                        className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] text-[#2C3E50] focus:border-[#4CAF50] text-base text-center"
                        placeholderTextColor="#95A5A6"
                      />
                    </View>
                  </View>
                </View>

                {/* TDS Range */}
                <View>
                  <Text className="text-base font-medium text-[#34495E] mb-3">Target TDS Range (ppm)</Text>
                  <View className="flex-row space-x-3 gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Minimum</Text>
                      <Input
                        placeholder="800"
                        value={formData.targetTdsMin}
                        onChangeText={(value) => handleInputChange('targetTdsMin', value)}
                        keyboardType="numeric"
                        className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] text-[#2C3E50] focus:border-[#4CAF50] text-base text-center"
                        placeholderTextColor="#95A5A6"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Maximum</Text>
                      <Input
                        placeholder="1200"
                        value={formData.targetTdsMax}
                        onChangeText={(value) => handleInputChange('targetTdsMax', value)}
                        keyboardType="numeric"
                        className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] text-[#2C3E50] focus:border-[#4CAF50] text-base text-center"
                        placeholderTextColor="#95A5A6"
                      />
                    </View>
                  </View>
                </View>

               
              </View>
            </Card>

           

            {/* Save Button */}
            <Button 
              className="w-full"
              onPress={async () => {
                if (!validateForm()) {
                  return;
                }
                
                setIsSubmitting(true);
                
                try {
                  // TODO: Replace with actual API call to save setup
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                  // Navigate to hydroponics page after successful save
                  router.push('/(tabs)/hydroponics');
                } catch (error) {
                  console.error('Error saving setup:', error);
                  Alert.alert('Error', 'Failed to save setup. Please try again.');
                } finally {
                  setIsSubmitting(false);
                }
              }}
              disabled={isSubmitting}
            >
              <Icon as={Save} size={18} className="text-muted mr-2" />
              <Text className=" ">
                {isSubmitting ? 'Creating Setup...' : 'Save Plant Setup'}
              </Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
