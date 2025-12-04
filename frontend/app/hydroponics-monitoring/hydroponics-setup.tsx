import { View, TouchableOpacity, ScrollView, Switch, Animated, Modal } from 'react-native';
import React, { useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useRouter } from 'expo-router';
import { z } from 'zod';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Save, Calendar, CheckCircle, ChevronDown, Play, Plus, Minus, Leaf, Info, X, RotateCcw } from 'lucide-react-native';
import { useEffect } from 'react';
import { useHydroponicSetupStore } from "@/store/hydroponics/hydroponicSetupStore";
import { toast } from 'sonner-native';
import { hydroponicSchema } from '@/validators/hydoponicSchema';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { StatusModal } from '@/components/ui/status-modal';
import CropInfoModal from './crop-info-modal';
import { DatePicker } from '@/components/ui/date-picker';


interface HydroponicsSetupData {
  cropName: string;
  numberOfCrops: string;
  bedSize: string;
  nutrientSolution: string;
  targetPh: string;
  targetPhMax: string;
  targetTdsMin: string;
  targetTdsMax: string;
  waterAmount: string;
  setupDate: string;
  harvestDate: string;
  status: 'active';
}

interface HydroponicsSetupProps {
  onSetupComplete?: () => void;
}

// Crop harvest days mapping
const CROP_HARVEST_DAYS = {
  'olmetie': { min: 28, max: 35 },
  'green-rapid': { min: 25, max: 30 },
  'romaine': { min: 45, max: 55 },
  'butterhead': { min: 35, max: 45 },
  'loose-leaf': { min: 30, max: 40 },
} as const;

export default function HydroponicsSetup({ onSetupComplete }: HydroponicsSetupProps) {
  const router = useRouter();
  const { createHydroponicSetup, error, resetError } = useHydroponicSetupStore();
  
  const [formData, setFormData] = useState<HydroponicsSetupData>({
    cropName: '',
    numberOfCrops: '1',
    bedSize: '',
    nutrientSolution: '',
    targetPh: '6.5',
    targetPhMax: '7.0',
    targetTdsMin: '50',
    targetTdsMax: '150',
    waterAmount: '5',
    setupDate: new Date().toISOString().split('T')[0], 
    harvestDate: '',
    status: 'active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBedSizeDropdown, setShowBedSizeDropdown] = useState(false);
  const [showCropDropdown, setShowCropDropdown] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCropInfoModal, setShowCropInfoModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const buttonScale = useRef(new Animated.Value(1)).current;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetErrors = () => {
    setErrors({});
  };

  const initialFormData: HydroponicsSetupData = {
    cropName: '',
    numberOfCrops: '1',
    bedSize: '',
    nutrientSolution: '',
    targetPh: '6.5',
    targetPhMax: '7.0',
    targetTdsMin: '50',
    targetTdsMax: '150',
    waterAmount: '5',
    setupDate: new Date().toISOString().split('T')[0], 
    harvestDate: '',
    status: 'active',
  };

  const handleResetForm = () => {
    setFormData(initialFormData);
    resetErrors();
    setShowBedSizeDropdown(false);
    setShowCropDropdown(false);
    toast.success("Form reset successfully");
  };

  // Helper function to calculate recommended harvest date range
  const getRecommendedHarvestDateRange = (cropName: string, setupDate: string) => {
    const cropKey = cropName as keyof typeof CROP_HARVEST_DAYS;
    if (!cropKey || !CROP_HARVEST_DAYS[cropKey]) return null;
    
    const { min, max } = CROP_HARVEST_DAYS[cropKey];
    const setup = new Date(setupDate);
    
    const minDate = new Date(setup);
    minDate.setDate(minDate.getDate() + min);
    
    const maxDate = new Date(setup);
    maxDate.setDate(maxDate.getDate() + max);
    
    return {
      min,
      max,
      minDate: minDate.toISOString().split('T')[0],
      maxDate: maxDate.toISOString().split('T')[0],
    };
  };

  // Helper function to calculate suggested harvest date (using max days)
  const calculateSuggestedHarvestDate = (cropName: string, setupDate: string): string => {
    const cropKey = cropName as keyof typeof CROP_HARVEST_DAYS;
    if (!cropKey || !CROP_HARVEST_DAYS[cropKey]) return '';
    
    const { max } = CROP_HARVEST_DAYS[cropKey];
    const setup = new Date(setupDate);
    const harvest = new Date(setup);
    harvest.setDate(harvest.getDate() + max);
    
    return harvest.toISOString().split('T')[0];
  };

  // Helper function to get crop harvest range info
  const getCropHarvestInfo = (cropName: string) => {
    const cropKey = cropName as keyof typeof CROP_HARVEST_DAYS;
    if (!cropKey || !CROP_HARVEST_DAYS[cropKey]) return null;
    return CROP_HARVEST_DAYS[cropKey];
  };

  // Helper function to check if selected date is within recommended range
  const isDateInRecommendedRange = (selectedDate: string, cropName: string, setupDate: string): boolean | null => {
    if (!selectedDate || !cropName) return null;
    
    const range = getRecommendedHarvestDateRange(cropName, setupDate);
    if (!range) return null;
    
    const selected = new Date(selectedDate);
    const min = new Date(range.minDate);
    const max = new Date(range.maxDate);
    
    return selected >= min && selected <= max;
  };

  const handleInputChange = (field: keyof HydroponicsSetupData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    resetErrors();
  };

  const isSaveDisabled = !formData.cropName || !formData.bedSize || !formData.harvestDate || isSubmitting;

  const handleStepperChange = (field: 'numberOfCrops', delta: number) => {
    // gagana lang yung stepper kung custom bed size
    if(formData.bedSize !== 'custom') return
    
    const currentValue = parseInt(formData[field]) || 1;
    const newValue = Math.max(1, currentValue + delta);
    handleInputChange(field, newValue.toString());
  };

  const handleCropChange = (cropName: string) => {
    // Update crop name and suggest a harvest date
    setFormData(prev => {
      const suggestedDate = calculateSuggestedHarvestDate(cropName, prev.setupDate);
      return {
        ...prev,
        cropName,
        harvestDate: suggestedDate // Pre-fill with suggested date, but user can change
      };
    });
    resetErrors();
  };

  const handleHarvestDateChange = (date: string) => {
    handleInputChange('harvestDate', date);
  };

  const handleBedSizeChange = (value: string) => {
    handleInputChange('bedSize', value);
    
    //set number of crops based on bed size
    if (value === 'small') {
      handleInputChange('numberOfCrops', '3');
    } else if (value === 'medium') {
      handleInputChange('numberOfCrops', '9');
    } else if (value === 'large') {
      handleInputChange('numberOfCrops', '12');
    }
    
  };

const handleSaveClick = () => {
  setShowConfirmModal(true);
};

const onSubmit = async () => {
  setShowConfirmModal(false);
  setIsSubmitting(true);
  resetErrors();

  try {
    const setupData = {
      crop_name: formData.cropName,
      number_of_crops: parseInt(formData.numberOfCrops, 10),
      bed_size: formData.bedSize,
      nutrient_solution: formData.nutrientSolution,
      target_ph_min: parseFloat(formData.targetPh),
      target_ph_max: parseFloat(formData.targetPhMax),
      target_tds_min: parseInt(formData.targetTdsMin, 10),
      target_tds_max: parseInt(formData.targetTdsMax, 10),
      water_amount: `${formData.waterAmount}L`,
      harvest_date: formData.harvestDate,
      pump_config: null,
    };

    const validatedData = hydroponicSchema.parse(setupData);
    await createHydroponicSetup(validatedData);

    const currentError = useHydroponicSetupStore.getState().error;
    if (currentError) {
      toast.error(currentError);
    } else {
      setShowSuccessModal(true);
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      err.errors.forEach((e) => {
        if (e.path[0]) fieldErrors[e.path[0]] = e.message;
      });
      setErrors(fieldErrors);
    } else {
      toast.error("Failed to create setup. Please try again.");
    }
  } finally {
    setIsSubmitting(false);
  }
};

  const bedSizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'custom', label: 'Custom' },


  ];

  const cropOptions = [
    { value: 'olmetie', label: 'Olmetie', description: 'Fast-growing lettuce variety' },
    { value: 'green-rapid', label: 'Green rapid', description: 'Quick harvest lettuce type' },
    { value: 'romaine', label: 'Romaine', description: 'Crisp leaves, popular for salads' },
    { value: 'butterhead', label: 'Butterhead', description: 'Tender, buttery-textured leaves' },
    { value: 'loose-leaf', label: 'Loose-leaf', description: 'Easy to harvest, grows in loose heads' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* =========== Header Section =========== */}
        <View className=" pb-4 ">
          <PageHeader title="" />
          <View className="mb-2 mt-4 px-6">
            <Text className="text-2xl font-bold ">New Crop Setup</Text>
            <Text className="text-muted-foreground text-base mt-1">Fill in your crop's details to start monitoring</Text>
          </View>
        </View>

      

        {/* =========== Form Section =========== */}
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="pb-8">
            
            {/* Crop Details Card */}
            <Card className="p-6 mb-6 rounded-2xl shadow-sm border border-muted-foreground/20">
              <View className="mb-6">
                <Text className="text-lg font-semibold  mb-2">Crop Details</Text>
                <View className="w-full h-1 bg-[#4CAF50] rounded-full" />
              </View>
              
              <View className="gap-6">
              
                {/* Crop Dropdown */}
                <View>
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-base font-medium">Crop</Text>
                    <TouchableOpacity onPress={() => setShowCropInfoModal(true)}>
                      <Icon as={Info} size={16} className="text-[#7F8C8D]" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] flex-row items-center justify-between"
                    onPress={() => setShowCropDropdown(!showCropDropdown)}
                  >
                    <Text className={`text-[#2C3E50] capitalize text-base ${!formData.cropName ? 'text-muted-foreground' : ''}`}>
                      {formData.cropName || 'Select crop type'}
                    </Text>
                    <Icon as={ChevronDown} size={20} className="text-[#7F8C8D]" />
                  </TouchableOpacity>
                  {showCropDropdown && (
                    <View className="border border-[#E8F5E8] rounded-xl mt-2 bg-white shadow-lg">
                      {cropOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          className="px-3 py-4 border-b border-[#F0F8F0] last:border-b-0"
                          onPress={() => {
                            handleCropChange(option.value);
                            setShowCropDropdown(false);
                          }}
                        >
                          <Text className="text-[#2C3E50] capitalize text-base">{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  {/* Recommended Harvest Range Guidance */}
                  {formData.cropName && (
                    <View className="mt-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <View className="flex-row items-center gap-2 mb-2">
                        <Icon as={Info} size={16} className="text-blue-600" />
                        <Text className="text-sm font-semibold text-blue-800">Recommended Growth Period</Text>
                      </View>
                      <Text className="text-xs text-blue-700">
                        {getCropHarvestInfo(formData.cropName)?.min}-{getCropHarvestInfo(formData.cropName)?.max} days
                      </Text>
                      {getRecommendedHarvestDateRange(formData.cropName, formData.setupDate) && (
                        <Text className="text-xs text-blue-600 mt-1">
                          Ideal harvest: {new Date(getRecommendedHarvestDateRange(formData.cropName, formData.setupDate)!.minDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(getRecommendedHarvestDateRange(formData.cropName, formData.setupDate)!.maxDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                {/* Harvest Date Selection */}
                {formData.cropName && (
                  <View>
                    <View className="flex-row items-center gap-2 mb-2">
                      <Text className="text-base font-medium">Target Harvest Date</Text>
                      <TouchableOpacity onPress={() => {
                        const suggested = calculateSuggestedHarvestDate(formData.cropName, formData.setupDate);
                        handleHarvestDateChange(suggested);
                        toast.success("Date set to recommended");
                      }}>
                        <Icon as={RotateCcw} size={14} className="text-[#7F8C8D]" />
                      </TouchableOpacity>
                    </View>
                    <DatePicker
                      value={formData.harvestDate}
                      onDateChange={handleHarvestDateChange}
                      placeholder="Select harvest date"
                      minDate={formData.setupDate}
                      recommendedMinDate={getRecommendedHarvestDateRange(formData.cropName, formData.setupDate)?.minDate}
                      recommendedMaxDate={getRecommendedHarvestDateRange(formData.cropName, formData.setupDate)?.maxDate}
                    />
                    
                    {/* Date Validation Feedback */}
                    {formData.harvestDate && isDateInRecommendedRange(formData.harvestDate, formData.cropName, formData.setupDate) === false && (
                      <View className="mt-2 p-3 bg-amber-50 rounded-xl border border-amber-200">
                        <View className="flex-row items-center gap-2">
                          <Icon as={Info} size={14} className="text-amber-600" />
                          <Text className="text-xs text-amber-800 flex-1">
                            Note: Selected date is outside the recommended range. Your crop may be under or over-mature at harvest.
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {formData.harvestDate && isDateInRecommendedRange(formData.harvestDate, formData.cropName, formData.setupDate) === true && (
                      <View className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                        <View className="flex-row items-center gap-2">
                          <Icon as={CheckCircle} size={14} className="text-emerald-600" />
                          <Text className="text-xs text-emerald-800">
                            Perfect! This date is within the ideal harvest window.
                          </Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}


                {/* Bed Size Dropdown */}
                <View>
                  <Text className="text-base font-medium  mb-2">Bed Size</Text>
                  <TouchableOpacity
                    className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] flex-row items-center justify-between"
                    onPress={() => setShowBedSizeDropdown(!showBedSizeDropdown)}
                  >
                    <Text className={`text-[#2C3E50] capitalize text-base ${!formData.bedSize ? 'text-muted-foreground' : ''}`}>
                      {formData.bedSize || 'Select bed size'}
                    </Text>
                    <Icon as={ChevronDown} size={20} className="text-[#7F8C8D]" />
                  </TouchableOpacity>
                  
                  {showBedSizeDropdown && (
                    <View className="border border-[#E8F5E8] rounded-xl mt-2 bg-white shadow-lg">
                      {bedSizeOptions.map((option) => (
                        <TouchableOpacity
                          key={option.value}
                          className="px-3 py-4 border-b border-[#F0F8F0] last:border-b-0"
                          onPress={() => {
                            handleBedSizeChange(option.value);
                            setShowBedSizeDropdown(false);
                          }}
                        >
                          <Text className="text-[#2C3E50] capitalize text-base">{option.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                
                {/* Number of Crops with Stepper */}
                <View>
                  <Text className="text-base font-medium  mb-2">Number of Crops</Text>
                  <View className="flex-row items-center bg-[#FAFFFA] border border-[#E8F5E8] rounded-xl px-3 py-4">
                    <TouchableOpacity
                      onPress={() => handleStepperChange('numberOfCrops', -1)}
                      disabled={formData.bedSize !== 'custom'}
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        formData.bedSize !== 'custom' ? 'bg-gray-300 opacity-50' : 'bg-[#E8F5E8]'
                      }`}
                    >
                      <Icon as={Minus} size={16} className={formData.bedSize !== 'custom' ? 'text-gray-500' : 'text-primary'} />
                    </TouchableOpacity>
                    
                    <View className="flex-1 items-center">
                      {formData.bedSize === 'custom' ? (
                        <Input
                          value={formData.numberOfCrops}
                          onChangeText={(value) => handleInputChange('numberOfCrops', value)}
                          keyboardType="numeric"
                          className="text-center text-lg font-semibold border-0 bg-transparent"
                          placeholderTextColor="#95A5A6"
                        />
                      ) : (
                        <Text className="text-lg font-semibold">
                          {formData.numberOfCrops}
                        </Text>
                      )}
                    </View>
                    
                    <Button
                      onPress={() => handleStepperChange('numberOfCrops', 1)}
                      disabled={formData.bedSize !== 'custom'}
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        formData.bedSize !== 'custom' ? 'opacity-50' : ''
                      }`}
                    >
                      <Icon as={Plus} size={16} className="text-white" />
                    </Button>
                  </View>
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
                  <View className="flex-row items-center gap-2 mb-2">
                    <Text className="text-base font-medium">Nutrient Solution</Text>
                    <Text className="text-sm text-muted-foreground">(Optional)</Text>
                  </View>
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

            <Card className="p-6 mb-6  shadow-sm border-0">
              <View className="mb-6">
                <Text className="text-lg font-semibold  mb-2">Ideal Growing Range</Text>
                <View className="w-full h-1 bg-[#6ECF8B] rounded-full" />
              </View>
              
              <View className="space-y-5 gap-6">
                {/* pH Range */}
                <View>
                  <Text className="text-base font-medium  mb-3 bg-lime-50">Target pH Range</Text>
                  <View className="flex-row space-x-3 gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Minimum</Text>
                      <Text>{formData.targetPh}</Text>
                    </View>
                     <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Maximum</Text>
                      <Text>{formData.targetPhMax}</Text>
                    </View>
                  </View>
                </View>

                {/* TDS Range */}
                <View>
                  <Text className="text-base font-medium bg-lime-50 mb-3">Target TDS Range (ppm)</Text>
                  <View className="flex-row space-x-3 gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Minimum</Text>
                      <Text>{formData.targetTdsMin}</Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Maximum</Text>
                      <Text>{formData.targetTdsMax}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Card>
            {/* Save Button */}
            <Button 
              className="w-full"
              onPress={handleSaveClick}
              disabled={isSaveDisabled}
            >
              <Icon as={Save} size={18} className="text-muted mr-2" />
              <Text>
                {isSubmitting ? 'Creating Setup...' : 'Save Plant Setup'}
              </Text>
            </Button>

            {/* Reset Form Button */}
            <Button 
              variant="ghost"
              className="w-full mt-3 border border-muted-foreground/30"
              onPress={handleResetForm}
            >
              <Icon as={RotateCcw} size={18} className="text-muted-foreground mr-2" />
              <Text className="text-muted-foreground">
                Reset Form
              </Text>
            </Button>

          </View>
        </ScrollView>
      </View>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        icon={<Icon as={Save} size={32} className="text-white" />}
        modalTitle="Confirm Setup"
        modalDescription="Are you sure you want to save this crop?"
        confirmText="Save"
        iconBgColor="bg-[#4CAF50]"
        confirmButtonColor="bg-[#4CAF50]"
        onConfirm={onSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Crop Info Modal */}
      <CropInfoModal
        visible={showCropInfoModal}
        onClose={() => setShowCropInfoModal(false)}
        cropOptions={cropOptions}
      />

      {/* Setup Complete Success Modal */}
      <StatusModal
        visible={showSuccessModal}
        type="success"
        title="Setup Complete!"
        message="Your crop setup has been saved successfully."
        buttonText="View Hydroponics"
        onClose={() => {
          setShowSuccessModal(false);
          router.push("/(tabs)/hydroponics");
        }}
        onButtonPress={() => {
          setShowSuccessModal(false);
          router.push("/(tabs)/hydroponics");
        }}
      />
    </SafeAreaView>
  );
}
