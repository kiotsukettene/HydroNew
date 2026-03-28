import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save, CheckCircle, Leaf, AlertCircle } from 'lucide-react-native';
import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore';
import { useYieldStore } from '@/store/hydroponics/yieldStore';
import { toast } from 'sonner-native';
import { yieldSchema, mapBackendErrors, getBackendErrorMessage, isBackendValidationError } from '@/validators/yieldSchema';
import { z } from 'zod';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';
import { StatusModal } from '@/components/ui/status-modal';

export default function HarvestForm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setupId = Number(params.id);

  const { currentSetup, fetchSetupById, loading: setupLoading } = useHydroponicSetupStore();
  const { storeYield, markAsHarvested, fetchYield, yieldSaved, loading, error, resetYieldState } = useYieldStore();

  const [formData, setFormData] = useState({
    totalCount: '',
    totalWeight: '',
    sellingCount: '',
    sellingWeight: '',
    consumptionCount: '',
    consumptionWeight: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [manuallyEditedWeights, setManuallyEditedWeights] = useState<Set<string>>(new Set());
  const [originalFormData, setOriginalFormData] = useState<typeof formData | null>(null);

  useEffect(() => {
    if (setupId) {
      // Reset yield state and form data when setupId changes
      resetYieldState();
      setFormData({
        totalCount: '',
        totalWeight: '',
        sellingCount: '',
        sellingWeight: '',
        consumptionCount: '',
        consumptionWeight: '',
        notes: '',
      });
      setManuallyEditedWeights(new Set());
      setOriginalFormData(null);
      setErrors({});
      fetchSetupById(setupId);
    }
    return () => {
      resetYieldState();
    };
  }, [setupId, fetchSetupById, resetYieldState]);

  useEffect(() => {
    const loadExistingYield = async () => {
      if (setupId && currentSetup) {
        const existingYield = await fetchYield(setupId);
        
        if (existingYield) {
          const sellingGrade = existingYield.grades.find(g => g.grade === 'selling');
          const consumptionGrade = existingYield.grades.find(g => g.grade === 'consumption');
          
          const loadedData = {
            totalCount: existingYield.total_count?.toString() || '',
            totalWeight: existingYield.total_weight?.toString() || '',
            sellingCount: sellingGrade?.count?.toString() || '',
            sellingWeight: sellingGrade?.weight?.toString() || '',
            consumptionCount: consumptionGrade?.count?.toString() || '',
            consumptionWeight: consumptionGrade?.weight?.toString() || '',
            notes: existingYield.notes || '',
          };
          
          setFormData(loadedData);
          setOriginalFormData(loadedData);
        } else {
          setOriginalFormData(null);
        }
      }
    };
    
    loadExistingYield();
  }, [currentSetup, setupId, fetchYield]);

  // Auto-distribute weights when total weight or counts change
  useEffect(() => {
    const totalWeight = parseFloat(formData.totalWeight) || 0;
    const sellingCount = parseInt(formData.sellingCount) || 0;
    const consumptionCount = parseInt(formData.consumptionCount) || 0;
    const totalCount = parseInt(formData.totalCount) || 0;
    const gradesSum = sellingCount + consumptionCount;

    // Only distribute if:
    // 1. Total weight is provided
    // 2. Total count matches the sum of grades
    // 3. Total count is greater than or equal to 0
    // 4. Weights haven't been manually edited (or total weight changed, which should redistribute)
    if (totalWeight > 0 && gradesSum === totalCount && totalCount >= 0) {
      const sellingWeight = (sellingCount / totalCount) * totalWeight;
      const consumptionWeight = (consumptionCount / totalCount) * totalWeight;

      setFormData(prev => {
        const updates: any = {};
        
        // Only update weights that weren't manually edited
        if (!manuallyEditedWeights.has('sellingWeight')) {
          updates.sellingWeight = sellingWeight.toFixed(2);
        }
        if (!manuallyEditedWeights.has('consumptionWeight')) {
          updates.consumptionWeight = consumptionWeight.toFixed(2);
        }
        
        return { ...prev, ...updates };
      });
    } else if (totalWeight === 0 || gradesSum !== totalCount) {
      // Clear weights if total weight is cleared or counts don't match
      // But only if they weren't manually edited
      setFormData(prev => {
        const updates: any = {};
        if (!manuallyEditedWeights.has('sellingWeight')) {
          updates.sellingWeight = '';
        }
        if (!manuallyEditedWeights.has('consumptionWeight')) {
          updates.consumptionWeight = '';
        }
        return { ...prev, ...updates };
      });
    }
  }, [formData.totalWeight, formData.sellingCount, formData.consumptionCount, formData.totalCount, manuallyEditedWeights]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleNumericInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    const parts = numericValue.split('.');
    const sanitizedValue = parts.length > 2 
      ? parts[0] + '.' + parts.slice(1).join('') 
      : numericValue;
    
    // Track manual edits to weight fields
    if (field === 'sellingWeight' || field === 'consumptionWeight') {
      setManuallyEditedWeights(prev => new Set(prev).add(field));
    }
    
    // If total weight is being edited, clear manual edit flags to allow redistribution
    if (field === 'totalWeight') {
      setManuallyEditedWeights(new Set());
    }
    
    handleInputChange(field, sanitizedValue);
  };

  const handleWholeNumberInput = (field: string, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    handleInputChange(field, numericValue);
  };

  const calculateGradesSum = () => {
    const selling = parseInt(formData.sellingCount) || 0;
    const consumption = parseInt(formData.consumptionCount) || 0;
    return selling + consumption;
  };

  const calculateDisposal = () => {
    const totalCrops = currentSetup?.number_of_crops || 0;
    const totalCount = parseInt(formData.totalCount) || 0;
    return Math.max(0, totalCrops - totalCount);
  };

  const isSumValid = () => {
    // Return false if totalCount field is empty
    if (formData.totalCount === '') return false;
    
    const totalCount = parseInt(formData.totalCount) || 0;
    const gradesSum = calculateGradesSum();
    return totalCount >= 0 && gradesSum === totalCount;
  };

  const hasFormChanged = () => {
    if (!originalFormData) return false;
    
    return (
      formData.totalCount !== originalFormData.totalCount ||
      formData.totalWeight !== originalFormData.totalWeight ||
      formData.sellingCount !== originalFormData.sellingCount ||
      formData.sellingWeight !== originalFormData.sellingWeight ||
      formData.consumptionCount !== originalFormData.consumptionCount ||
      formData.consumptionWeight !== originalFormData.consumptionWeight ||
      formData.notes !== originalFormData.notes
    );
  };

  const handleSaveYield = async () => {
    setErrors({});

    try {
      const sellingCount = parseInt(formData.sellingCount) || 0;
      const consumptionCount = parseInt(formData.consumptionCount) || 0;
      
      const payload = {
        total_count: parseInt(formData.totalCount),
        total_weight: formData.totalWeight ? parseFloat(formData.totalWeight) : null,
        notes: formData.notes || null,
        grades: [
          {
            grade: 'selling' as const,
            count: sellingCount,
            weight: sellingCount > 0 && formData.sellingWeight ? parseFloat(formData.sellingWeight) : null,
          },
          {
            grade: 'consumption' as const,
            count: consumptionCount,
            weight: consumptionCount > 0 && formData.consumptionWeight ? parseFloat(formData.consumptionWeight) : null,
          },
        ],
      };

      // Use Zod for type safety and data transformation, but don't block on validation
      // Backend will handle the actual validation
      let validatedData;
      try {
        validatedData = yieldSchema.parse(payload) as YieldPayload;
      } catch (zodErr) {
        // If Zod validation fails, still send to backend for proper error messages
        validatedData = payload as YieldPayload;
      }

      await storeYield(setupId, validatedData);
      setOriginalFormData({ ...formData });
      toast.success('Yield data saved successfully!');
    } catch (err) {
      // Handle backend validation errors using utility functions
      if (isBackendValidationError(err)) {
        const backendErrors = mapBackendErrors(err);
        setErrors(backendErrors);
      } else {
        const errorMessage = getBackendErrorMessage(err);
        if (errorMessage) {
          toast.error(errorMessage);
        }
      }
    }
  };

  const handleMarkAsHarvested = async () => {
    try {
      await markAsHarvested(setupId);
      setShowConfirmModal(false);
      setShowSuccessModal(true);
      resetYieldState();
    } catch (err) {
      setShowConfirmModal(false);
      if (err instanceof Error) {
        toast.error(err.message || 'Failed to mark as harvested');
      } else {
        toast.error(error || 'Failed to mark as harvested');
      }
    }
  };

  const gradesSum = calculateGradesSum();
  const totalCount = parseInt(formData.totalCount) || 0;
  const disposal = calculateDisposal();
  const maxCrops = currentSetup?.number_of_crops || 0;

  if (setupLoading && !currentSetup) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text>Loading setup details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 50}
      >
        <PageHeader title="" />
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <View className="pb-8">
          {/* Header */}
          <View className="mb-2 mt-4">
            <View className="flex-row items-center gap-2 mb-2">
              <Icon as={Leaf} size={24} className="text-primary" />
              <Text className="text-2xl font-bold">Harvest: {currentSetup?.crop_name ? currentSetup?.crop_name.charAt(0).toUpperCase() + currentSetup?.crop_name.slice(1) : ''}</Text>
            </View>
            <Text className="text-muted-foreground">
              Setup #{setupId} | Total Crops: {maxCrops}
            </Text>
          </View>

          {/* Total Harvested Count */}
          <Card className="p-6">
            <View>
              <Text className="text-base font-medium mb-2">
                Total Crop Harvested <Text className="text-red-500">*</Text>
              </Text>
              <Input
                placeholder="Enter total harvested count per cup"
                value={formData.totalCount}
                onChangeText={(value) => handleWholeNumberInput('totalCount', value)}
                keyboardType="numeric"
              />
              
              <Text className="text-xs text-muted-foreground mt-1">
                Max: {maxCrops} crops
              </Text>
              {errors.total_count && (
                <Text className="text-xs text-red-500 mt-1">{errors.total_count}</Text>
              )}
            </View>

            <View>
              <Text className="text-base font-medium mb-2">Total Weight (grams) <Text className='italic font-normal text-muted-foreground'>(optional)</Text></Text>
              <View className="flex-row items-center">
                <Input
                  placeholder="e.g., 1500.50"
                  value={formData.totalWeight}
                  onChangeText={(value) => handleNumericInput('totalWeight', value)}
                  keyboardType="numeric"
                />
              </View>
              {formData.totalWeight && isSumValid() && !errors.total_weight && (
                <Text className="text-xs text-primary mt-1">
                  Weight will be automatically distributed based on grade counts
                </Text>
              )}
              {errors.total_weight && (
                <Text className="text-xs text-red-500 mt-1">{errors.total_weight}</Text>
              )}
            </View>
          </Card>

          {/* Quality Grade Breakdown */}
          <Card className="p-6 mb-2">
            <View className="mb-2">
              <Text className="text-xl font-bold mb-1">Quality Grade Breakdown  <Text className="text-red-500">*</Text></Text> 
              <Text className="text-base text-muted-foreground">
                Distribute your {totalCount} harvested crops across quality grades below:
              </Text>
            </View>

            {/* Selling Grade */}
            <View className="mb-2">
              <Text className="text-base font-medium mb-2">Selling</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground mb-1">Count</Text>
                  <Input
                    placeholder="0"
                    value={formData.sellingCount}
                    onChangeText={(value) => handleWholeNumberInput('sellingCount', value)}
                    keyboardType="numeric"
                  />
                  {errors['grades.0.count'] && (
                    <Text className="text-xs text-red-500 mt-1">{errors['grades.0.count']}</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground mb-1">
                    Weight (g){formData.totalWeight && isSumValid() && !manuallyEditedWeights.has('sellingWeight')}
                  </Text>
                  <Input
                    placeholder="0"
                    value={formData.sellingWeight}
                    onChangeText={(value) => handleNumericInput('sellingWeight', value)}
                    keyboardType="numeric"
                  />
                  {errors['grades.0.weight'] && (
                    <Text className="text-xs text-red-500 mt-1">{errors['grades.0.weight']}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Consumption Grade */}
            <View className="mb-2">
              <Text className="text-base font-medium mb-2">Consumption</Text>
              <View className="flex-row gap-3">
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground mb-1">Count</Text>
                  <Input
                    placeholder="0"
                    value={formData.consumptionCount}
                    onChangeText={(value) => handleWholeNumberInput('consumptionCount', value)}
                    keyboardType="numeric"
                  />
                  {errors['grades.1.count'] && (
                    <Text className="text-xs text-red-500 mt-1">{errors['grades.1.count']}</Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-muted-foreground mb-1">
                    Weight (g){formData.totalWeight && isSumValid() && !manuallyEditedWeights.has('consumptionWeight')}
                  </Text>
                  <Input
                    placeholder="0"
                    value={formData.consumptionWeight}
                    onChangeText={(value) => handleNumericInput('consumptionWeight', value)}
                    keyboardType="numeric"
                  />
                  {errors['grades.1.weight'] && (
                    <Text className="text-xs text-red-500 mt-1">{errors['grades.1.weight']}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Disposal (Auto-calculated) */}
            <View className="border-t border-muted-foreground/20 pt-4">
              <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-xl">
                <Text className="text-sm text-muted-foreground">Discarded/Unusable Crops</Text>
                <Text className="text-base font-semibold">{disposal} crops</Text>
              </View>
            </View>

            {/* Sum Validation */}
            <View className={`mt-4 p-3 rounded-xl ${isSumValid() ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <View className="flex-row items-center gap-2">
                <Icon 
                  as={isSumValid() ? CheckCircle : AlertCircle} 
                  size={16} 
                  className={isSumValid() ? 'text-emerald-600' : 'text-amber-600'} 
                />
                <Text className={`text-sm font-medium ${isSumValid() ? 'text-emerald-800' : 'text-amber-800'}`}>
                  Total: {gradesSum}/{totalCount} {isSumValid() ? '✓' : ''}
                </Text>
              </View>
            </View>
            {errors.grades && (
              <Text className="text-xs text-red-500 mt-2">{errors.grades}</Text>
            )}
          </Card>


          {/* Notes */}
          <Card className="p-6">
            <Text className="text-base font-medium ">Notes (optional)</Text>
            <Input
              placeholder="Enter any additional notes..."
              value={formData.notes}
              onChangeText={(value) => handleInputChange('notes', value)}
              multiline
              numberOfLines={4}
              maxLength={1000}
              className="border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] min-h-[100px]"
              textAlignVertical="top"
            />
            <Text className="text-xs text-muted-foreground mt-1">
              {formData.notes.length}/1000 characters
            </Text>
            {errors.notes && (
              <Text className="text-xs text-red-500 mt-1">{errors.notes}</Text>
            )}
          </Card>

          {/* Action Buttons */}
          <Button 
            className="w-full mb-3 mt-12"
            onPress={handleSaveYield}
            disabled={!isSumValid() || loading || (originalFormData !== null && !hasFormChanged())}
          >
            <Icon as={Save} size={18} className="text-white mr-2" />
            <Text className="text-white">
              {loading ? 'Saving...' : originalFormData !== null ? 'Update Yield Data' : 'Save Yield Data'}
            </Text>
          </Button>

          <Button 
            className={`w-full ${originalFormData === null ? 'opacity-50' : ''}`}
            onPress={() => setShowConfirmModal(true)}
            disabled={originalFormData === null || loading}
          >
            <Icon as={CheckCircle} size={18} className="text-white mr-2" />
            <Text className="text-white">Mark as Harvested</Text>
          </Button>

          {originalFormData === null && (
            <Text className="text-xs text-center text-muted-foreground mt-2">
              Please save yield data first before marking as harvested
            </Text>
          )}
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <ConfirmationModal
        visible={showConfirmModal}
        icon={<Icon as={CheckCircle} size={32} className="text-primary " />}
        modalTitle="Mark as Harvested?"
        modalDescription="This action will mark this setup as harvested and move it to your harvest history. This cannot be undone."
        confirmText="Confirm Harvest"
        iconBgColor="bg-green-50"
        confirmButtonColor="bg-primary"
        onConfirm={handleMarkAsHarvested}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Success Modal */}
      <StatusModal
        visible={showSuccessModal}
        type="success"
        title="Harvest Complete!"
        message="Your crop has been successfully marked as harvested and moved to harvest history."
        buttonText="Back to Hydroponics"
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

