import { View, TouchableOpacity, ScrollView, Animated, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { z } from 'zod';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save, CheckCircle, ChevronDown, Plus, Minus, Info, RotateCcw } from 'lucide-react-native';
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

// Crop harvest days mapping
const CROP_HARVEST_DAYS = {
  'olmetie': { min: 28, max: 35 },
  'green-rapid': { min: 25, max: 30 },
  'romaine': { min: 45, max: 55 },
  'butterhead': { min: 35, max: 45 },
  'loose-leaf': { min: 30, max: 40 },
} as const;

// Crop ideal growing range (pH and TDS)
const CROP_IDEAL_RANGES = {
  'olmetie': { 
    ph: { min: 5.5, max: 6.5 }, 
    tds: { min: 560, max: 840 } 
  },
  'green-rapid': { 
    ph: { min: 5.5, max: 6.5 }, 
    tds: { min: 560, max: 840 } 
  },
  'romaine': { 
    ph: { min: 6.0, max: 7.0 }, 
    tds: { min: 1050, max: 1400 } 
  },
  'butterhead': { 
    ph: { min: 6.0, max: 7.0 }, 
    tds: { min: 700, max: 1050 } 
  },
  'loose-leaf': { 
    ph: { min: 6.0, max: 6.8 }, 
    tds: { min: 560, max: 980 } 
  },
} as const;

export default function HydroponicsSetupEdit() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setupId = params.id;
  const { currentSetup, fetchSetupById, updateHydroponicSetup, loading, error, resetError } = useHydroponicSetupStore();
  
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalFormData, setOriginalFormData] = useState<HydroponicsSetupData | null>(null);

  // Load existing setup data
  useEffect(() => {
    if (setupId) {
      fetchSetupById(Number(setupId));
    }
  }, [setupId]);

  // Populate form with existing data
  useEffect(() => {
    if (currentSetup) {
      const loadedData: HydroponicsSetupData = {
        cropName: currentSetup.crop_name || '',
        numberOfCrops: currentSetup.number_of_crops?.toString() || '1',
        bedSize: currentSetup.bed_size || '',
        nutrientSolution: currentSetup.nutrient_solution || '',
        targetPh: currentSetup.target_ph_min?.toString() || '6.5',
        targetPhMax: currentSetup.target_ph_max?.toString() || '7.0',
        targetTdsMin: currentSetup.target_tds_min?.toString() || '50',
        targetTdsMax: currentSetup.target_tds_max?.toString() || '150',
        waterAmount: currentSetup.water_amount?.toString() || '5',
        setupDate: currentSetup.setup_date || new Date().toISOString().split('T')[0],
        harvestDate: currentSetup.harvest_date || '',
        status: 'active',
      };
      setFormData(loadedData);
      setOriginalFormData(loadedData);
    }
  }, [currentSetup]);

  const resetErrors = () => {
    setErrors({});
  };

  // Check if form data has changed from original
  const hasFormChanged = (): boolean => {
    if (!originalFormData) return false;
    
    return (
      formData.cropName !== originalFormData.cropName ||
      formData.numberOfCrops !== originalFormData.numberOfCrops ||
      formData.bedSize !== originalFormData.bedSize ||
      formData.nutrientSolution !== originalFormData.nutrientSolution ||
      formData.targetPh !== originalFormData.targetPh ||
      formData.targetPhMax !== originalFormData.targetPhMax ||
      formData.targetTdsMin !== originalFormData.targetTdsMin ||
      formData.targetTdsMax !== originalFormData.targetTdsMax ||
      formData.waterAmount !== originalFormData.waterAmount ||
      formData.setupDate !== originalFormData.setupDate ||
      formData.harvestDate !== originalFormData.harvestDate
    );
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

  const isSaveDisabled = !formData.cropName || !formData.bedSize || !formData.harvestDate || isSubmitting || !hasFormChanged();

  const handleStepperChange = (field: 'numberOfCrops', delta: number) => {
    if(formData.bedSize !== 'custom') return
    
    const currentValue = parseInt(formData[field]) || 1;
    const newValue = Math.max(1, currentValue + delta);
    handleInputChange(field, newValue.toString());
  };

  const handleCropChange = (cropName: string) => {
    setFormData(prev => {
      const cropKey = cropName as keyof typeof CROP_IDEAL_RANGES;
      const idealRange = CROP_IDEAL_RANGES[cropKey];
      
      return {
        ...prev,
        cropName,
        // Keep existing harvest date when editing
        // Set recommended pH and TDS ranges
        targetPh: idealRange?.ph.min.toString() || prev.targetPh,
        targetPhMax: idealRange?.ph.max.toString() || prev.targetPhMax,
        targetTdsMin: idealRange?.tds.min.toString() || prev.targetTdsMin,
        targetTdsMax: idealRange?.tds.max.toString() || prev.targetTdsMax,
      };
    });
    resetErrors();
  };

  const handleHarvestDateChange = (date: string) => {
    handleInputChange('harvestDate', date);
  };

  const handleWaterAmountChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    const sanitizedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : numericValue;
    
    handleInputChange('waterAmount', sanitizedValue);
  };

  const handleNumberOfCropsChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange('numberOfCrops', numericValue);
  };

  const handleNumericInput = (field: keyof HydroponicsSetupData, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    const sanitizedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : numericValue;
    
    handleInputChange(field, sanitizedValue);
  };

  const handleBedSizeChange = (value: string) => {
    setFormData(prev => {
      let numberOfCrops = prev.numberOfCrops;
      let waterAmount = prev.waterAmount;
      
      if (value === 'small') {
        numberOfCrops = '3';
        waterAmount = '5';
      } else if (value === 'medium') {
        numberOfCrops = '9';
        waterAmount = '10';
      } else if (value === 'large') {
        numberOfCrops = '12';
        waterAmount = '15';
      }
      
      return {
        ...prev,
        bedSize: value,
        numberOfCrops,
        waterAmount,
      };
    });
    resetErrors();
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
        water_amount: parseInt(formData.waterAmount, 10),
        harvest_date: formData.harvestDate,
        pump_config: null,
      };

      const validatedData = hydroponicSchema.parse(setupData);
      await updateHydroponicSetup(Number(setupId), validatedData);

      const currentError = useHydroponicSetupStore.getState().error;
      if (currentError) {
        if (typeof currentError === 'object' && currentError !== null) {
          const backendErrors: Record<string, string> = {};
          Object.entries(currentError).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              backendErrors[key] = value[0];
            } else if (typeof value === 'string') {
              backendErrors[key] = value;
            }
          });
          setErrors(backendErrors);
        } else {
          toast.error(currentError);
        }
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
        toast.error("Failed to update setup. Please try again.");
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

  if (loading && !currentSetup) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#2D7D7D" />
        <Text className="mt-2 text-lg text-gray-600">Loading setup...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <View className="flex-1">
          {/* =========== Header Section =========== */}
          <View className=" pb-4 ">
            <PageHeader title="" />
            <View className="mb-2 mt-4 px-6">
              <Text className="text-2xl font-bold ">Edit Crop Setup</Text>
              <Text className="text-muted-foreground text-base mt-1">Update your crop's details</Text>
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
                    className={`border rounded-xl px-3 py-4 bg-[#FAFFFA] flex-row items-center justify-between ${
                      errors.crop_name ? 'border-red-500' : 'border-muted-foreground/50'
                    }`}
                    onPress={() => setShowCropDropdown(!showCropDropdown)}
                  >
                    <Text className={`text-[#2C3E50] capitalize text-base ${!formData.cropName ? 'text-muted-foreground' : ''}`}>
                      {formData.cropName || 'Select crop type'}
                    </Text>
                    <Icon as={ChevronDown} size={20} className="text-[#7F8C8D]" />
                  </TouchableOpacity>
                  {errors.crop_name && (
                    <Text className="text-red-500 text-xs mt-1">{errors.crop_name}</Text>
                  )}
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
                    <View className="mt-5 p-4 bg-muted-foreground/15 rounded-xl">
                      <View className="flex-row items-center gap-2 mb-2">
                        <Icon as={Info} size={16} className="text-primary" />
                        <Text className="text-sm font-semibold text-primary">Recommended Growth Period</Text>
                      </View>
                      <Text className="text-sm text-foreground">
                        {getCropHarvestInfo(formData.cropName)?.min}-{getCropHarvestInfo(formData.cropName)?.max} days
                      </Text>
                      {getRecommendedHarvestDateRange(formData.cropName, formData.setupDate) && (
                        <Text className="text-sm text-foreground mt-1">
                          Ideal harvest: {new Date(getRecommendedHarvestDateRange(formData.cropName, formData.setupDate)!.minDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(getRecommendedHarvestDateRange(formData.cropName, formData.setupDate)!.maxDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Text>
                      )}
                    </View>
                  )}
                </View>

                {/* Harvest Date Selection */}
                {formData.cropName && (
                  <View className='mt-4'>
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
                    {errors.harvest_date && (
                      <Text className="text-red-500 text-xs mt-1">{errors.harvest_date}</Text>
                    )}
                    
                    {/* Date Validation Feedback */}
                    {formData.harvestDate && isDateInRecommendedRange(formData.harvestDate, formData.cropName, formData.setupDate) === false && (
                      <View className="mt-2 p-3 bg-red-100 rounded-xl">
                        <View className="flex-row items-center gap-2">
                          <Icon as={Info} size={16} className="text-red-600" />
                          <Text className="text-xs text-foreground flex-1">
                            Note: Selected date is outside the recommended range. Your crop may be under or over-mature at harvest.
                          </Text>
                        </View>
                      </View>
                    )}
                    
                    {formData.harvestDate && isDateInRecommendedRange(formData.harvestDate, formData.cropName, formData.setupDate) === true && (
                      <View className="mt-3 p-3  bg-muted-foreground/15 rounded-xl">
                        <View className="flex-row items-center gap-2">
                          <Icon as={CheckCircle} size={14} className="text-primary" />
                          <Text className="text-sm text-foreground">
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
                    className={`border rounded-xl px-3 py-4 bg-[#FAFFFA] flex-row items-center justify-between ${
                      errors.bed_size ? 'border-red-500' : 'border-muted-foreground/50'
                    }`}
                    onPress={() => setShowBedSizeDropdown(!showBedSizeDropdown)}
                  >
                    <Text className={`text-[#2C3E50] capitalize text-base ${!formData.bedSize ? 'text-muted-foreground' : ''}`}>
                      {formData.bedSize || 'Select bed size'}
                    </Text>
                    <Icon as={ChevronDown} size={20} className="text-[#7F8C8D]" />
                  </TouchableOpacity>
                  {errors.bed_size && (
                    <Text className="text-red-500 text-xs mt-1">{errors.bed_size}</Text>
                  )}
                  
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
                  <View className={`flex-row items-center bg-[#FAFFFA] border rounded-xl px-3 py-4 ${
                    errors.number_of_crops ? 'border-red-500' : 'border-[#E8F5E8]'
                  }`}>
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
                          onChangeText={handleNumberOfCropsChange}
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
                  {errors.number_of_crops && (
                    <Text className="text-red-500 text-xs mt-1">{errors.number_of_crops}</Text>
                  )}
                </View>

                 {/* Water Amount */}
                <View>
                  <Text className="text-base font-medium text-[#34495E] mb-2">Water Amount (Liters)</Text>
                  <Input
                    value={formData.waterAmount}
                    onChangeText={handleWaterAmountChange}
                    editable={formData.bedSize === 'custom'}
                    keyboardType="numeric"
                    className={`border rounded-xl px-3 py-4 text-[#2C3E50] text-base ${
                      errors.water_amount ? 'border-red-500' : 'border-muted-foreground/50'
                    } ${formData.bedSize === 'custom' ? 'bg-[#FAFFFA]' : 'bg-gray-100'}`}
                    placeholderTextColor="#95A5A6"
                  />
                  {errors.water_amount && (
                    <Text className="text-red-500 text-xs mt-1">{errors.water_amount}</Text>
                  )}
                  {formData.bedSize !== 'custom' && !errors.water_amount && (
                    <Text className="text-xs text-muted-foreground mt-1">
                      Water amount is set based on bed size. Select "Custom" to edit.
                    </Text>
                  )}
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
                    className={`border rounded-xl px-3 py-4 bg-[#FAFFFA] text-[#2C3E50] focus:border-[#4CAF50] text-base ${
                      errors.nutrient_solution ? 'border-red-500' : 'border-muted-foreground/50'
                    }`}
                    placeholderTextColor="#95A5A6"
                  />
                  {errors.nutrient_solution && (
                    <Text className="text-red-500 text-xs mt-1">{errors.nutrient_solution}</Text>
                  )}
                </View>
              </View>
            </Card>

            {/* Target Parameters Card */} 

            <Card className="p-6 mb-6  shadow-sm border-0">
              <View className="mb-4">
                <Text className="text-lg font-semibold  mb-2">Ideal Growing Range</Text>
                <View className="w-full h-1 bg-[#6ECF8B] rounded-full" />
              </View>
              
              {/* Recommended Range Info */}
              {formData.cropName && CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES] && (
                <View className="mb-4 p-4 bg-muted-foreground/15 rounded-xl">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Icon as={Info} size={16} className="text-primary" />
                    <Text className="text-sm font-semibold text-primary">Recommended for {formData.cropName.charAt(0).toUpperCase() + formData.cropName.slice(1)}</Text>
                  </View>
                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-foreground">pH Range</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES].ph.min} - {CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES].ph.max}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-foreground">TDS Range (ppm)</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES].tds.min} - {CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES].tds.max}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              
              <View className="space-y-5 gap-6">
                {/* pH Range */}
                <View>
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-medium">Target pH Range</Text>
                    <TouchableOpacity onPress={() => {
                      if (formData.cropName && CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES]) {
                        const range = CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES];
                        setFormData(prev => ({
                          ...prev,
                          targetPh: range.ph.min.toString(),
                          targetPhMax: range.ph.max.toString(),
                        }));
                        toast.success("pH set to recommended");
                      }
                    }}>
                      <Icon as={RotateCcw} size={14} className="text-[#7F8C8D]" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row space-x-3 gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Minimum</Text>
                      <Input
                        value={formData.targetPh}
                        onChangeText={(value) => handleNumericInput('targetPh', value)}
                        keyboardType="numeric"
                        className={`border rounded-xl px-3 py-3 bg-[#FAFFFA] text-[#2C3E50] ${
                          errors.target_ph_min ? 'border-red-500' : 'border-muted-foreground/50'
                        }`}
                        placeholderTextColor="#95A5A6"
                      />
                      {errors.target_ph_min && (
                        <Text className="text-red-500 text-xs mt-1">{errors.target_ph_min}</Text>
                      )}
                    </View>
                     <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Maximum</Text>
                      <Input
                        value={formData.targetPhMax}
                        onChangeText={(value) => handleNumericInput('targetPhMax', value)}
                        keyboardType="numeric"
                        className={`border rounded-xl px-3 py-3 bg-[#FAFFFA] text-[#2C3E50] ${
                          errors.target_ph_max ? 'border-red-500' : 'border-muted-foreground/50'
                        }`}
                        placeholderTextColor="#95A5A6"
                      />
                      {errors.target_ph_max && (
                        <Text className="text-red-500 text-xs mt-1">{errors.target_ph_max}</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* TDS Range */}
                <View>
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-base font-medium">Target TDS Range (ppm)</Text>
                    <TouchableOpacity onPress={() => {
                      if (formData.cropName && CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES]) {
                        const range = CROP_IDEAL_RANGES[formData.cropName as keyof typeof CROP_IDEAL_RANGES];
                        setFormData(prev => ({
                          ...prev,
                          targetTdsMin: range.tds.min.toString(),
                          targetTdsMax: range.tds.max.toString(),
                        }));
                        toast.success("TDS set to recommended");
                      }
                    }}>
                      <Icon as={RotateCcw} size={14} className="text-[#7F8C8D]" />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-row space-x-3 gap-4">
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Minimum</Text>
                      <Input
                        value={formData.targetTdsMin}
                        onChangeText={(value) => handleNumericInput('targetTdsMin', value)}
                        keyboardType="numeric"
                        className={`border rounded-xl px-3 py-3 bg-[#FAFFFA] text-[#2C3E50] ${
                          errors.target_tds_min ? 'border-red-500' : 'border-muted-foreground/50'
                        }`}
                        placeholderTextColor="#95A5A6"
                      />
                      {errors.target_tds_min && (
                        <Text className="text-red-500 text-xs mt-1">{errors.target_tds_min}</Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text className="text-xs text-[#7F8C8D] mb-2">Maximum</Text>
                      <Input
                        value={formData.targetTdsMax}
                        onChangeText={(value) => handleNumericInput('targetTdsMax', value)}
                        keyboardType="numeric"
                        className={`border rounded-xl px-3 py-3 bg-[#FAFFFA] text-[#2C3E50] ${
                          errors.target_tds_max ? 'border-red-500' : 'border-muted-foreground/50'
                        }`}
                        placeholderTextColor="#95A5A6"
                      />
                      {errors.target_tds_max && (
                        <Text className="text-red-500 text-xs mt-1">{errors.target_tds_max}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </Card>
            
            {/* Update Button */}
            <Button 
              className="w-full"
              onPress={handleSaveClick}
              disabled={isSaveDisabled}
            >
              <Icon as={Save} size={18} className="text-muted mr-2" />
              <Text>
                {isSubmitting ? 'Updating Setup...' : 'Update Plant Setup'}
              </Text>
            </Button>

          </View>
        </ScrollView>
        </View>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        icon={<Icon as={Save} size={32} className="text-white" />}
        modalTitle="Confirm Update"
        modalDescription="Are you sure you want to update this crop setup?"
        confirmText="Update"
        iconBgColor="bg-[#66814b]"
        confirmButtonColor="bg-[#66814b]"
        onConfirm={onSubmit}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Crop Info Modal */}
      <CropInfoModal
        visible={showCropInfoModal}
        onClose={() => setShowCropInfoModal(false)}
        cropOptions={cropOptions}
      />

      {/* Update Success Modal */}
      <StatusModal
        visible={showSuccessModal}
        type="success"
        title="Update Complete!"
        message="Your crop setup has been updated successfully."
        buttonText="Back to Details"
        onClose={() => {
          setShowSuccessModal(false);
          router.back();
        }}
        onButtonPress={() => {
          setShowSuccessModal(false);
          router.back();
        }}
      />
    </SafeAreaView>
  );
}

