import { View, Image, ScrollView, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Svg, { Circle} from 'react-native-svg';
import FiltrationSuccessModal from '../filtration/filtration-success';
import {
  Loader,
  CheckCircle2,
  Droplets,
  Sun,
  ShieldCheck,
} from 'lucide-react-native';
import FailedDetailsModal from '../hydroponics-monitoring/failed-details';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'sonner-native';
import { subscribeMessage, publishMessage, onMQTTConnect } from '@/service/mqtt.client';
import { useAuthStore } from '@/store/auth/authStore';
import { useDeviceStore } from '@/store/device/deviceStore';
import { useTreatmentStore } from '@/store/treatment/treatmentStore';
import NoDevice from '@/components/ui/no-device';
import { useFocusEffect } from '@react-navigation/native';
import { FiltrationSkeleton } from '@/components/skeletons';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Types
interface FiltrationStage {
  id: number;
  title: string;
  name: string;
  description: string;
  status: 'completed' | 'active' | 'pending' | 'failed';
  statusText: string;
  icon: any;
  bgColor: string;
  cardBgColor: string;
  borderColor: string;
  statusBgColor: string;
}

export default function Filtration() {
  const userId = useAuthStore((state) => state.user?.id);
  const { devices, fetchDevice } = useDeviceStore();
  const { updateTreatment, fetchLatestTreatment } = useTreatmentStore();
  const [deviceChecked, setDeviceChecked] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // If devices are already loaded, mark as checked and skip fetch
      if (devices && devices.length > 0) {
        setDeviceChecked(true);
        return;
      }
      
      // Only fetch if no devices and not already checked
      if (!deviceChecked) {
        if (userId) {
          fetchDevice(userId).finally(() => setDeviceChecked(true));
        } else {
          setDeviceChecked(true);
        }
      }
    }, [userId, fetchDevice, devices, deviceChecked])
  );

  // Process control states
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const [isProcessFailed, setIsProcessFailed] = useState(false);
  const [isProcessCompleted, setIsProcessCompleted] = useState(false);
  const [buttonText, setButtonText] = useState("Start Process");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [isStageOneExpanded, setIsStageOneExpanded] = useState(false);
  const [isStageOneValveOpen, setIsStageOneValveOpen] = useState(false);
  const [isDrainWaterValveOpen, setIsDrainWaterValveOpen] = useState(false);
  const [deviceSerial, setDeviceSerial] = useState('');

  // Initialize all stages as pending
  const [filtrationStages, setFiltrationStages] = useState<FiltrationStage[]>([
    {
      id: 1,
      title: "Stage 1",
      name: "MFC Treatment",
      description: "Biological filtration",
      status: "pending",
      statusText: "Pending",
      icon: CheckCircle2,
      bgColor: "bg-gray-300",
      cardBgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      statusBgColor: "bg-gray-400"
    },
    {
      id: 2,
      title: "Stage 2",
      name: "Natural Filtration",
      description: "Multi-layer filtration",
      status: "pending",
      statusText: "Pending",
      icon: Droplets,
      bgColor: "bg-gray-300",
      cardBgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      statusBgColor: "bg-gray-400"
    },
    {
      id: 3,
      title: "Stage 3",
      name: "UV Sterilization",
      description: "Ultraviolet purification",
      status: "pending",
      statusText: "Pending",
      icon: Sun,
      bgColor: "bg-gray-300",
      cardBgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      statusBgColor: "bg-gray-400"
    },
    {
      id: 4,
      title: "Stage 4",
      name: "Clean Water",
      description: "Final purification stage",
      status: "pending",
      statusText: "Pending",
      icon: ShieldCheck,
      bgColor: "bg-gray-300",
      cardBgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      statusBgColor: "bg-gray-400"
    }
  ]);

  const filtrationStagesRef = useRef(filtrationStages);
  filtrationStagesRef.current = filtrationStages;

  // Sync filtration UI from backend (call on focus + MQTT reconnect)
  const resetProcess = useCallback(() => {
    setIsProcessStarted(false);
    setIsProcessFailed(false);
    setIsProcessCompleted(false);
    setButtonText("Start Process");
    setShowSuccessModal(false);
    setIsStageOneValveOpen(false);
    setIsDrainWaterValveOpen(false);

    setFiltrationStages([
      { id: 1, title: "Stage 1", name: "MFC Treatment", description: "Biological filtration", status: "pending", statusText: "Pending", icon: CheckCircle2, bgColor: "bg-gray-300", cardBgColor: "bg-gray-50", borderColor: "border-gray-200", statusBgColor: "bg-gray-400" },
      { id: 2, title: "Stage 2", name: "Natural Filtration", description: "Multi-layer filtration", status: "pending", statusText: "Pending", icon: Droplets, bgColor: "bg-gray-300", cardBgColor: "bg-gray-50", borderColor: "border-gray-200", statusBgColor: "bg-gray-400" },
      { id: 3, title: "Stage 3", name: "UV Sterilization", description: "Ultraviolet purification", status: "pending", statusText: "Pending", icon: Sun, bgColor: "bg-gray-300", cardBgColor: "bg-gray-50", borderColor: "border-gray-200", statusBgColor: "bg-gray-400" },
      { id: 4, title: "Stage 4", name: "Clean Water", description: "Final purification stage", status: "pending", statusText: "Pending", icon: ShieldCheck, bgColor: "bg-gray-300", cardBgColor: "bg-gray-50", borderColor: "border-gray-200", statusBgColor: "bg-gray-400" }
    ]);
  }, []);

  const syncFiltrationFromBackend = useCallback(async () => {
    const data = await fetchLatestTreatment();

    // No data or no pending treatment -> reset UI
    if (!data || !data.stages || data.final_status !== 'pending') {
      console.log('[Filtration] Sync: No pending treatment, resetting UI');
      resetProcess();
      return;
    }

    const mapBackendToUI = (s: string): 'completed' | 'active' | 'pending' | 'failed' => {
      if (s === 'passed') return 'completed';
      if (s === 'processing') return 'active';
      if (s === 'failed') return 'failed';
      return 'pending';
    };

    const stageStyles = {
      completed: { statusText: 'Completed', bgColor: 'bg-green-300', cardBgColor: 'bg-green-50', borderColor: 'border-green-100', statusBgColor: 'bg-green-500' },
      active: { statusText: 'In Progress', bgColor: 'bg-blue-300', cardBgColor: 'bg-blue-50', borderColor: 'border-blue-200', statusBgColor: 'bg-blue-500' },
      pending: { statusText: 'Pending', bgColor: 'bg-gray-300', cardBgColor: 'bg-gray-50', borderColor: 'border-gray-200', statusBgColor: 'bg-gray-400' },
      failed: { statusText: 'Failed', bgColor: 'bg-red-500', cardBgColor: 'bg-red-50', borderColor: 'border-red-200', statusBgColor: 'bg-red-400' },
    };

    const current = filtrationStagesRef.current;
    let hasProcessing = false;
    let stage4Failed = false;
    let allPassed = false;

    for (const backendStage of data.stages) {
      const stageId = backendStage.stage_order;
      const uiStatus = mapBackendToUI(backendStage.status);
      const currentStage = current.find((s) => s.id === stageId);
      if (!currentStage) continue;

      // Only update if UI is out of sync
      if (currentStage.status !== uiStatus) {
        const style = stageStyles[uiStatus];
        setFiltrationStages((prev) =>
          prev.map((s) =>
            s.id === stageId
              ? { ...s, status: uiStatus, statusText: style.statusText, bgColor: style.bgColor, cardBgColor: style.cardBgColor, borderColor: style.borderColor, statusBgColor: style.statusBgColor }
              : s
          )
        );
        console.log(`[Filtration] Sync: Stage ${stageId} updated from ${currentStage.status} to ${uiStatus}`);
      }

      if (backendStage.status === 'processing') hasProcessing = true;
      if (stageId === 4 && backendStage.status === 'failed') stage4Failed = true;
    }

    allPassed = data.stages.every((s) => s.status === 'passed');

    if (hasProcessing) {
      setIsProcessStarted(true);
      setButtonText('In Progress');
    }
    if (stage4Failed) setIsProcessFailed(true);
    if (allPassed && data.stages.length === 4) {
      setShowSuccessModal(true);
      setButtonText('Process Complete');
      setIsProcessCompleted(true);
    }
  }, [fetchLatestTreatment, resetProcess]);

  // Sync on filtration page focus
  useFocusEffect(
    useCallback(() => {
      syncFiltrationFromBackend();
    }, [syncFiltrationFromBackend])
  );

  // Sync on MQTT reconnect
  useEffect(() => {
    const unsub = onMQTTConnect(() => {
      console.log('[Filtration] MQTT reconnected, syncing state from backend');
      syncFiltrationFromBackend();
    });
    return unsub;
  }, [syncFiltrationFromBackend]);

  // Function to handle Save Process button click (Mark as Complete)
  const handleSaveProcess = async () => {
    try {
      // Call backend to update treatment with total_cycles = 1
      console.log('[Filtration] handleSaveProcess: calling updateTreatment with total_cycles=1');
      const updated = await updateTreatment(1);
      
      if (!updated) {
        console.error('[Filtration] handleSaveProcess: updateTreatment failed');
        toast.error("Failed to update treatment");
        return;
      }
      
      console.log('[Filtration] handleSaveProcess: updateTreatment successful', updated);
      
      // Create filtration record for local storage
      const filtrationRecord = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        stages: filtrationStages.map(stage => ({
          id: stage.id,
          title: stage.title,
          name: stage.name,
          description: stage.description,
          status: stage.status,
          statusText: stage.statusText,
        })),
        completedAt: new Date().toISOString(),
      };

      // Get existing filtrations
      const existingData = await AsyncStorage.getItem('filtration_list');
      const filtrations = existingData ? JSON.parse(existingData) : [];
      
      // Add new filtration
      filtrations.unshift(filtrationRecord);
      
      // Save back to AsyncStorage
      await AsyncStorage.setItem('filtration_list', JSON.stringify(filtrations));
      
      toast.success("Marked successfully");
      
      // Close pump 3 when marking as complete
      if (deviceSerial) {
        publishMessage(`mfc/${deviceSerial}/pump/3`, 'CLOSE', 1);
        console.log(`[Filtration] Published CLOSE to mfc/${deviceSerial}/pump/3 with QoS 1`);
      }
      
      resetProcess();
    } catch (error) {
      console.error('Error saving filtration:', error);
      toast.error("Failed to save filtration");
    }
  };

  // Get device serial from storage
  useEffect(() => {
    const getDeviceSerial = async () => {
      if (!userId) return;
      
      try {
        const storageKey = `paired_device:${userId}`;
        const deviceData = await AsyncStorage.getItem(storageKey);
        
        if (deviceData) {
          const device = JSON.parse(deviceData);
          setDeviceSerial(device.serial_number);
        }
      } catch (error) {
        console.error("Failed to retrieve device serial:", error);
      }
    };

    getDeviceSerial();
  }, [userId]);

  // Function to update stage status
  const updateStageStatus = (
    stageId: number, 
    status: 'completed' | 'active' | 'pending' | 'failed',
    statusText: string,
    bgColor: string,
    cardBgColor: string,
    borderColor: string,
    statusBgColor: string
  ) => {
    setFiltrationStages(prev => prev.map(stage => 
      stage.id === stageId 
        ? { 
            ...stage, 
            status,
            statusText,
            bgColor,
            cardBgColor,
            borderColor,
            statusBgColor
          }
        : stage
    ));
  };

  // Subscribe to MQTT topics for filtration stage states
  useEffect(() => {
    if (!deviceSerial) {
      console.log('[Filtration] No device serial, skipping MQTT subscriptions');
      return;
    }

    console.log('[Filtration] Setting up MQTT subscriptions for device:', deviceSerial);
    const unsubs: (() => void)[] = [];

    // Subscribe to each stage state
    for (let stageId = 1; stageId <= 4; stageId++) {
      const topic = `filtration/${deviceSerial}/stage/${stageId}/state`;
      console.log(`[Filtration] Subscribing to topic: ${topic}`);
      
      try {
        const unsubscribe = subscribeMessage(topic, (_topic, payload) => {
          const rawState = payload.toString().trim();
          // Remove quotes if present
          const state = rawState.replace(/^"|"$/g, '').toLowerCase();
          
          console.log(`[Filtration] 📨 Message received on ${topic}:`, {
            raw: rawState,
            cleaned: state,
            timestamp: new Date().toISOString()
          });
          
          if (state === 'processing') {
            // Mark stage as active/in progress
            updateStageStatus(
              stageId,
              'active',
              'In Progress',
              'bg-blue-300',
              'bg-blue-50',
              'border-blue-200',
              'bg-blue-500'
            );
            console.log(`[Filtration] ✅ Stage ${stageId} is now processing`);
            
            // If stage 1 is processing, disable start button and show "In Progress"
            if (stageId === 1) {
              setIsProcessStarted(true);
              setButtonText("In Progress");
            }
          } else if (state === 'passed') {
            // Mark stage as completed
            updateStageStatus(
              stageId,
              'completed',
              'Completed',
              'bg-green-300',
              'bg-green-50',
              'border-green-100',
              'bg-green-500'
            );
            console.log(`[Filtration] ✅ Stage ${stageId} passed`);
            
            // If all stages are completed, show success modal
            if (stageId === 4) {
              setTimeout(() => {
                setShowSuccessModal(true);
                setButtonText("Process Complete");
              }, 500);
            }
          } else if (state === 'failed') {
            // Mark stage as failed
            updateStageStatus(
              stageId,
              'failed',
              'Failed',
              'bg-red-500',
              'bg-red-50',
              'border-red-200',
              'bg-red-400'
            );
            console.log(`[Filtration] ❌ Stage ${stageId} failed`);
            
            // If stage 4 failed, show restart option
            if (stageId === 4) {
              setIsProcessFailed(true);
            }
          } else if (state === 'pending') {
            // Reset stage to pending
            updateStageStatus(
              stageId,
              'pending',
              'Pending',
              'bg-gray-300',
              'bg-gray-50',
              'border-gray-200',
              'bg-gray-400'
            );
            console.log(`[Filtration] ⏸️ Stage ${stageId} reset to pending`);
          } else {
            console.warn(`[Filtration] ⚠️ Unknown state received for Stage ${stageId}:`, state);
          }
        }, 1); // QoS 1 for guaranteed delivery
        
        unsubs.push(unsubscribe);
        console.log(`[Filtration] ✅ Successfully subscribed to ${topic} with QoS 1`);
      } catch (error) {
        console.error(`[Filtration] ❌ Failed to subscribe to ${topic}:`, error);
      }
    }

    // Subscribe to restart signal
    const restartTopic = `filtration/${deviceSerial}/restart`;
    console.log(`[Filtration] Subscribing to topic: ${restartTopic}`);
    
    try {
      const unsubRestart = subscribeMessage(restartTopic, (_topic, payload) => {
        const rawValue = payload.toString().trim();
        const value = rawValue.replace(/^"|"$/g, '');
        
        console.log(`[Filtration] 📨 Message received on ${restartTopic}:`, {
          raw: rawValue,
          cleaned: value,
          timestamp: new Date().toISOString()
        });
        
        if (value === '1') {
          console.log('[Filtration] 🔄 Restart signal received - Stage 4 failed');
          
          // Mark Stage 4 as failed (red)
          updateStageStatus(
            4,
            'failed',
            'Failed',
            'bg-red-500',
            'bg-red-50',
            'border-red-200',
            'bg-red-400'
          );
          
          // Show restart button
          setIsProcessFailed(true);
        }
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubRestart);
      console.log(`[Filtration] ✅ Successfully subscribed to ${restartTopic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration] ❌ Failed to subscribe to ${restartTopic}:`, error);
    }

    // Subscribe to pump state (main process pump)
    const pumpTopic = `mfc/${deviceSerial}/pump/3/state`;
    console.log(`[Filtration] Subscribing to topic: ${pumpTopic}`);
    
    try {
      const unsubPump = subscribeMessage(pumpTopic, (_topic, payload) => {
        const value = payload.toString().trim();
        console.log(`[Filtration] 📨 Message received on ${pumpTopic}:`, {
          value,
          state: value === '1' ? 'ON' : 'OFF',
          timestamp: new Date().toISOString()
        });
        
        if (value === '1') {
          setIsProcessStarted(true);
          setButtonText("On process...");
          console.log(`[Filtration] 🟢 Pump is ON`);
        } else if (value === '0') {
          setIsProcessStarted(false);
          setButtonText("Start Process");
          console.log(`[Filtration] 🔴 Pump is OFF`);
        }
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubPump);
      console.log(`[Filtration] ✅ Successfully subscribed to ${pumpTopic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration] ❌ Failed to subscribe to ${pumpTopic}:`, error);
    }

    // Subscribe to Stage 1 valve state
    const valve1Topic = `mfc/${deviceSerial}/valve/1/state`;
    console.log(`[Filtration] Subscribing to topic: ${valve1Topic}`);
    
    try {
      const unsubValve1 = subscribeMessage(valve1Topic, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsStageOneValveOpen(value === '1');
        console.log(`[Filtration] 📨 Stage 1 valve: ${value === '1' ? 'OPEN' : 'CLOSED'} (${value})`);
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubValve1);
      console.log(`[Filtration] ✅ Successfully subscribed to ${valve1Topic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration] ❌ Failed to subscribe to ${valve1Topic}:`, error);
    }

    // Subscribe to drain water valve state
    const valve2Topic = `mfc_fallback/${deviceSerial}/valve/2/state`;
    console.log(`[Filtration] Subscribing to topic: ${valve2Topic}`);
    
    try {
      const unsubValve2 = subscribeMessage(valve2Topic, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsDrainWaterValveOpen(value === '1');
        console.log(`[Filtration] 📨 Drain valve: ${value === '1' ? 'OPEN' : 'CLOSED'} (${value})`);
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubValve2);
      console.log(`[Filtration] ✅ Successfully subscribed to ${valve2Topic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration] ❌ Failed to subscribe to ${valve2Topic}:`, error);
    }

    console.log(`[Filtration] 🎯 Total subscriptions established: ${unsubs.length}`);

    return () => {
      console.log(`[Filtration] 🧹 Cleaning up ${unsubs.length} MQTT subscriptions`);
      unsubs.forEach((u) => u());
    };
  }, [deviceSerial]);

  // Function to toggle Stage One expansion
  const toggleStageOneExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsStageOneExpanded(!isStageOneExpanded);
  };

  // Function to start the process (publishes to pump/3)
  const startProcess = () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    
    // Publish OPEN command to pump 3
    publishMessage(`mfc/${deviceSerial}/pump/3`, 'OPEN', 1);
    console.log(`[Filtration] Published OPEN to mfc/${deviceSerial}/pump/3 with QoS 1`);
    
    // Don't set isProcessStarted here - wait for MQTT state confirmation
    setIsProcessFailed(false);
    toast.success("Starting filtration process");
  };

  // Function to restart the process (publishes to pump/1)
  const restartProcess = () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    
    // Publish OPEN command to restart pump 1
    publishMessage(`reservoir_fallback/${deviceSerial}/pump/1`, 'OPEN', 1);
    console.log(`[Filtration] Published OPEN to reservoir_fallback/${deviceSerial}/pump/1 with QoS 1`);
    
    setIsProcessFailed(false);
    setButtonText("On process...");
    toast.success("Restarting filtration process");
  };

  // Function to handle button click
  const handleButtonClick = () => {
    if (!isProcessStarted || isProcessFailed) {
      if (isProcessFailed) {
        restartProcess();
      } else {
        startProcess();
      }
    }
  };

  // Function to handle Stage One valve control (publishes to valve/1)
  const handleCompleteStageOne = () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    
    if (isStageOneValveOpen) {
      // Publish CLOSE command
      publishMessage(`mfc/${deviceSerial}/valve/1`, 'CLOSE', 1);
      console.log(`[Filtration] Published CLOSE to mfc/${deviceSerial}/valve/1 with QoS 1`);
      toast.success("Closing Stage 1 valve");
    } else {
      // Publish OPEN command
      publishMessage(`mfc/${deviceSerial}/valve/1`, 'OPEN', 1);
      console.log(`[Filtration] Published OPEN to mfc/${deviceSerial}/valve/1 with QoS 1`);
      toast.success("Opening Stage 1 valve");
    }
  };

  // Function to handle drain water action (publishes to valve/2)
  const handleDrainWater = () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    
    if (isDrainWaterValveOpen) {
      // Publish CLOSE command
      publishMessage(`mfc_fallback/${deviceSerial}/valve/2`, 'CLOSE', 1);
      console.log(`[Filtration] Published CLOSE to mfc_fallback/${deviceSerial}/valve/2 with QoS 1`);
      toast.success("Closing drain valve");
    } else {
      // Publish OPEN command
      publishMessage(`mfc_fallback/${deviceSerial}/valve/2`, 'OPEN', 1);
      console.log(`[Filtration] Published OPEN to mfc_fallback/${deviceSerial}/valve/2 with QoS 1`);
      toast.success("Opening drain valve");
    }
  };

  // Calculate progress based on completed stages
  const calculateProgress = () => {
    const completedStages = filtrationStages.filter(stage => stage.status === 'completed').length;
    return (completedStages / filtrationStages.length) * 100; // 25% per stage for 4 stages
  };

  // Get status text based on current state
  const getStatusText = () => {
    const completedCount = filtrationStages.filter(s => s.status === 'completed').length;
    
    if (completedCount === 4) return 'Complete';
    if (isProcessFailed) return 'Restart Required';
    if (isProcessStarted) return 'In Progress...';
    return 'Not Started';
  };

  // Show skeleton only on initial load (when devices haven't been fetched yet)
  if (!deviceChecked && (!devices || devices.length === 0)) {
    return (
      <SafeAreaView className="flex-1 relative bg-background">
        <Image
          source={require('@/assets/images/filtration-bg.png')}
          className="absolute w-full"
          style={{ top: 0, height: 300 }}
        />
        <View className="relative z-10">
          <PageHeader title="Filtration" />
        </View>
        <FiltrationSkeleton />
      </SafeAreaView>
    );
  }

  // Show NoDevice component if no devices found after check
  if (deviceChecked && (!devices || devices.length === 0)) {
    return <NoDevice />;
  }

  return (  
    <SafeAreaView className="flex-1 relative bg-background">
      <Image
        source={require('@/assets/images/filtration-bg.png')}
        className="absolute w-full"
        style={{ top: 0, height: 300 }}
      />
      
      {/* ===== Page Header ===== */}

      <View className="relative z-10">
        <PageHeader title="Filtration" />
      </View>

      {/* ===== Main Content ===== */}

      <View className="flex-1 relative">

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="mt-36 relative z-10">

          <Card className="rounded-t-3xl border-transparent p-5 sm:p-6">
          <View className="mb-1">
              <Text className="text-xl sm:text-2xl font-bold mb-1">Water Filtration Process</Text>
              <Text className="text-foreground/80 text-sm sm:text-base">Real-time purification monitoring</Text>
            </View>
            
            {/* Start Process Button - disabled only when pump state is 1 */}
            {!isProcessFailed && !isProcessCompleted && (
              <Button 
                onPress={handleButtonClick}
                disabled={isProcessStarted}
                className={isProcessStarted ? "opacity-50" : ""}
              >
                <Text>{buttonText}</Text>
              </Button>
            )}
            
          <View className='-mt-3'>
          <Button 
              variant="outline"
              onPress={() => router.push('/filtration/filtration-list')}
              className=""
            >
              <Text>View All Filtration</Text>
            </Button>
          </View>
          

          <Card className={`mt-0 flex-row items-center justify-between border-0 p-3 sm:p-4 ${
            calculateProgress() === 100 
              ? 'bg-emerald-100' 
              : isProcessFailed
              ? 'bg-red-50' 
              : 'bg-emerald-50'
          }`}>
            <View className="flex-1 flex-row items-center">
              <View className="text mr-2 sm:mr-3 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/40">
                <Loader className="text-muted" size={18} />
              </View>

              {/* Text with background patterns */}
              <View className="relative flex-1">
                <Text className="text-base sm:text-sm text-primary">{getStatusText()}</Text>
          
              </View>
            </View>
            {/* ===== Progress Indicator ===== */}
            <View className="ml-2 sm:ml-3 md:ml-4">
              <View className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
                {/* Outer ring */}
                <Svg width={48} height={48} className="absolute sm:w-14 sm:h-14 md:w-16 md:h-16">
                  <Circle
                    cx={24}
                    cy={24}
                    r={20}
                    stroke="#e5e7eb"
                    strokeWidth={2.5}
                    fill="transparent"
                  />
                  {/* Progress arc */}
                  <Circle
                    cx={24}
                    cy={24}
                    r={20}
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={2 * Math.PI * 20 * (1 - calculateProgress() / 100)}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </Svg>
                {/* Percentage text */}
                <View className="absolute inset-0 items-center justify-center">
                  <Text className="text-xs sm:text-sm md:text-base font-bold text-emerald-800">
                    {Math.round(calculateProgress())}%
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        
          {/* ================= Main Content Card  ==================== */}
          <Card className=" border-2 border-gray-200 shadow-lg rounded-2xl">
              <View className="relative px-2 sm:px-4">
                
                <View className="absolute left-6 sm:left-7 top-10 w-0.5 bg-gray-200 rounded-full" style={{ height: '85%' }}></View>
              
              {filtrationStages.map((stage, index) => {
                const IconComponent = stage.icon;
                const isLast = index === filtrationStages.length - 1;
                const isStageOne = stage.id === 1;
                
                return (
                  <View key={stage.id} className={`relative flex-row items-center ${!isLast ? 'mb-6 sm:mb-8' : ''}`}>
                    <View className={`relative z-10 mr-4 sm:mr-6 w-10 h-10 sm:w-11 sm:h-11 ${stage.bgColor} rounded-full items-center justify-center ${
                      stage.status === 'active' ? 'border-2 sm:border-4 border-blue-200' : ''
                    }`}>
                      <IconComponent className={stage.status === 'pending' ? 'text-foreground/70' : stage.status === 'failed' ? 'text-white' : 'text-muted'} size={18} />
                    </View>
                    
                    {/* Stage Card */}
                    <Pressable 
                      className={`flex-1 ${stage.cardBgColor} rounded-2xl ${
                        stage.status === 'active' ? 'border-2' : stage.status === 'failed' ? 'border-2' : 'border'
                      } ${stage.borderColor}`}
                      onPress={isStageOne ? toggleStageOneExpansion : undefined}
                      disabled={!isStageOne}
                    >
                      <View className="p-3 sm:p-4">
                        <View className="flex-row items-center justify-between mb-2 sm:mb-3">
                          <Text className="text-base sm:text-lg font-bold">{stage.title}</Text>
                          <Badge 
                            variant={stage.status === 'completed' ? 'default' : stage.status === 'active' ? 'secondary' : stage.status === 'failed' ? 'destructive' : 'outline'}
                            className={
                              stage.status === 'completed' 
                                ? 'bg-emerald-500 dark:bg-green-600' 
                                : stage.status === 'active' 
                                ? 'bg-blue-500 dark:bg-blue-600' 
                                : stage.status === 'failed'
                                ? 'bg-red-500 dark:bg-red-600'
                                : 'bg-gray-400 dark:bg-gray-500'
                            }
                          >
                            <Text className="text-white">{stage.statusText}</Text>
                          </Badge>
                        </View>
                        <Text className="text-sm sm:text-base font-semibold mb-1">{stage.name}</Text>
                        <Text className="text-foreground/50 text-xs sm:text-sm">{stage.description}</Text>
                        
                        {/*  ============= Stage One Control Buttons ============== */}
                        {isStageOne && isStageOneExpanded && (
                          <View className="mt-3 gap-1">
                            <Button
                             className="w-full h-8"
                             onPress={handleCompleteStageOne}
                             disabled={stage.status === 'completed'}>
                             <Text className="text-xs">{isStageOneValveOpen ? 'Close Valve' : 'Open Valve'}</Text>
                           </Button>
                            <Button 
                              variant="outline" 
                              className="w-full h-8"
                              onPress={handleDrainWater}
                              disabled={stage.status === 'completed'}
                            >
                              <Text className="text-xs">{isDrainWaterValveOpen ? 'Close Drain' : 'Drain Water'}</Text>
                            </Button>
                          </View>
                        )}
                        
                        {/*  ============= View Details button for failed stages ============== */}
                        {stage.status === 'failed' && (
                          <Button variant="link" className="self-center" onPress={() => setShowFailedModal(true)}>
                            <Text className="text-red-600 text-sm">View Details</Text>
                          </Button>
                        )}
                      </View>
                    </Pressable>
                  
                  </View>
                );
              })}
            </View>
          </Card>
          
          {/* ===== ===== Failed Modal ===== ===== */}
          <FailedDetailsModal
            visible={showFailedModal}
            onClose={() => setShowFailedModal(false)}
          />
          
          {/* Re-start Process Button - appears below main content card when process fails */}
          {isProcessFailed && (
            <Button 
              onPress={handleButtonClick}
              className="mt-4"
            >
              <Text>Re-start Process</Text>
            </Button>
          )}
          
          {/* Save Process Button - appears below main content card after success modal */}
          {isProcessCompleted && (
            <Button 
              onPress={handleSaveProcess}
              className="mt-4"
            >
              <Text>Mark as Complete</Text>
            </Button>
          )}
          
          </Card>
          </View>
          </ScrollView>
        </View>

        {/* ===== ===== Success Modal ===== ===== */}
        <FiltrationSuccessModal
          visible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            setIsProcessCompleted(true);
          }}
          onViewDetails={() => {
            setShowSuccessModal(false);
            router.push('/filtration/filtration-list');
            setIsProcessCompleted(true);
          }}
        />
      </SafeAreaView>
    );
  }
