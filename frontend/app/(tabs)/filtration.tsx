import { View, Image, ScrollView, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FiltrationSuccessModal from '../filtration/filtration-success';
import { FiltrationProgressBar } from '@/components/ui/filtration-progress-bar';
import {
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
import { useFiltrationProgressStore } from '@/store/filtration/filtrationProgressStore';

/** Pending toast: show only when MQTT state is received for the last action. */
type PendingFiltrationToast =
  | 'start_process'
  | 'open_valve_1'
  | 'close_valve_1'
  | 'open_drain'
  | 'close_drain'
  | 'restart'
  | null;
import NoDevice from '@/components/ui/no-device';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
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
  const setProgress = useFiltrationProgressStore((s) => s.setProgress);
  const {
    fetchLatestTreatment,
    startProcess: apiStartProcess,
    openValve1: apiOpenValve1,
    closeValve1: apiCloseValve1,
    openDrainValve: apiOpenDrainValve,
    closeDrainValve: apiCloseDrainValve,
    restartFiltration: apiRestartFiltration,
    openPump4: apiOpenPump4,
  } = useTreatmentStore();
  const [deviceChecked, setDeviceChecked] = useState(false);
  const pendingToastRef = useRef<PendingFiltrationToast>(null);
  const lastReconnectSyncRef = useRef<number>(0);
  const isFocusedRef = useRef(false);
  const RECONNECT_SYNC_DEBOUNCE_MS = 15000; // Only sync on reconnect at most once per 15s, and only when screen focused

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
  // Device serial from store so it updates when device is loaded from API or MQTT (AsyncStorage is synced there)
  const deviceSerial = devices?.[0]?.serial_number ?? '';

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

  // Keep ref in sync with focus so reconnect callback can skip when not on this screen
  const isFocused = useIsFocused();
  useEffect(() => {
    isFocusedRef.current = isFocused;
  }, [isFocused]);

  // Sync on filtration page focus
  useFocusEffect(
    useCallback(() => {
      syncFiltrationFromBackend();
    }, [syncFiltrationFromBackend])
  );

  // Sync on MQTT reconnect only when this screen is focused, and debounced (avoids calling latest treatment on every resubscribe)
  useEffect(() => {
    const unsub = onMQTTConnect(() => {
      if (!isFocusedRef.current) return;
      const now = Date.now();
      if (now - lastReconnectSyncRef.current < RECONNECT_SYNC_DEBOUNCE_MS) return;
      lastReconnectSyncRef.current = now;
      syncFiltrationFromBackend();
    });
    return unsub;
  }, [syncFiltrationFromBackend]);

  // Function to handle Save Process button click (Mark as Complete) — no API, toast only
  const handleSaveProcess = () => {
    toast.success("Treatment completed");
    resetProcess();
  };

  // Function to handle Transfer Reservoir button click (calls openPump4 API)
  const handleTransferReservoir = async () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    const ok = await apiOpenPump4();
    if (!ok) {
      toast.error("Failed to transfer reservoir");
      return;
    }
    toast.success("Transferring to reservoir");
  };

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
          
          console.log(`[Filtration] Message received on ${topic}:`, {
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
            console.log(`[Filtration]  Stage ${stageId} is now processing`);
            
            // If stage 1 is processing, disable start button and show "In Progress"
            if (stageId === 1) {
              setIsProcessStarted(true);
              setButtonText("In Progress");
              // Toast only when we received state for a pending action
              if (pendingToastRef.current === 'start_process') {
                toast.success('Starting Filtration');
                pendingToastRef.current = null;
              } else if (pendingToastRef.current === 'restart') {
                toast.success('Restarting filtration');
                pendingToastRef.current = null;
              }
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
            console.log(`[Filtration]  Stage ${stageId} passed`);
            
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
            console.log(`[Filtration]  Stage ${stageId} failed`);
            
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
            console.log(`[Filtration] ⏸ Stage ${stageId} reset to pending`);
          } else {
            console.warn(`[Filtration]  Unknown state received for Stage ${stageId}:`, state);
          }
        }, 1); // QoS 1 for guaranteed delivery
        
        unsubs.push(unsubscribe);
        console.log(`[Filtration]  Successfully subscribed to ${topic} with QoS 1`);
      } catch (error) {
        console.error(`[Filtration]  Failed to subscribe to ${topic}:`, error);
      }
    }

    // Subscribe to restart signal
    const restartTopic = `filtration/${deviceSerial}/restart`;
    console.log(`[Filtration] Subscribing to topic: ${restartTopic}`);
    
    try {
      const unsubRestart = subscribeMessage(restartTopic, (_topic, payload) => {
        const rawValue = payload.toString().trim();
        const value = rawValue.replace(/^"|"$/g, '');
        
        console.log(`[Filtration]  Message received on ${restartTopic}:`, {
          raw: rawValue,
          cleaned: value,
          timestamp: new Date().toISOString()
        });
        
        if (value === '1') {
          console.log('[Filtration]  Restart signal received - Stage 4 failed');
          
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
      console.log(`[Filtration]  Successfully subscribed to ${restartTopic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration]  Failed to subscribe to ${restartTopic}:`, error);
    }

    // Subscribe to pump state (main process pump)
    const pumpTopic = `mfc/${deviceSerial}/pump/3/state`;
    console.log(`[Filtration] Subscribing to topic: ${pumpTopic}`);
    
    try {
      const unsubPump = subscribeMessage(pumpTopic, (_topic, payload) => {
        const value = payload.toString().trim();
        console.log(`[Filtration]  Message received on ${pumpTopic}:`, {
          value,
          state: value === '1' ? 'ON' : 'OFF',
          timestamp: new Date().toISOString()
        });
        
        if (value === '1') {
          setIsProcessStarted(true);
          setButtonText("On process...");
          console.log(`[Filtration]  Pump is ON`);
          if (pendingToastRef.current === 'start_process') {
            toast.success('Starting Filtration');
            pendingToastRef.current = null;
          }
        } else if (value === '0') {
          setIsProcessStarted(false);
          setButtonText("Start Process");
          console.log(`[Filtration]  Pump is OFF`);
        }
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubPump);
      console.log(`[Filtration]  Successfully subscribed to ${pumpTopic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration]  Failed to subscribe to ${pumpTopic}:`, error);
    }

    // Subscribe to Stage 1 valve state
    const valve1Topic = `mfc/${deviceSerial}/valve/1/state`;
    console.log(`[Filtration] Subscribing to topic: ${valve1Topic}`);
    
    try {
      const unsubValve1 = subscribeMessage(valve1Topic, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsStageOneValveOpen(value === '1');
        console.log(`[Filtration]  Stage 1 valve: ${value === '1' ? 'OPEN' : 'CLOSED'} (${value})`);
        if (value === '1' && pendingToastRef.current === 'open_valve_1') {
          toast.success('Opening Stage 1 valve');
          pendingToastRef.current = null;
        } else if (value === '0' && pendingToastRef.current === 'close_valve_1') {
          toast.success('Closing Stage 1 valve');
          pendingToastRef.current = null;
        }
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubValve1);
      console.log(`[Filtration]  Successfully subscribed to ${valve1Topic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration]  Failed to subscribe to ${valve1Topic}:`, error);
    }

    // Subscribe to drain water valve state
    const valve2Topic = `mfc_fallback/${deviceSerial}/valve/2/state`;
    console.log(`[Filtration] Subscribing to topic: ${valve2Topic}`);
    
    try {
      const unsubValve2 = subscribeMessage(valve2Topic, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsDrainWaterValveOpen(value === '1');
        console.log(`[Filtration]  Drain valve: ${value === '1' ? 'OPEN' : 'CLOSED'} (${value})`);
        if (value === '1' && pendingToastRef.current === 'open_drain') {
          toast.success('Opening drain valve');
          pendingToastRef.current = null;
        } else if (value === '0' && pendingToastRef.current === 'close_drain') {
          toast.success('Closing drain valve');
          pendingToastRef.current = null;
        }
      }, 1); // QoS 1 for guaranteed delivery
      
      unsubs.push(unsubValve2);
      console.log(`[Filtration]  Successfully subscribed to ${valve2Topic} with QoS 1`);
    } catch (error) {
      console.error(`[Filtration]  Failed to subscribe to ${valve2Topic}:`, error);
    }

    console.log(`[Filtration]  Total subscriptions established: ${unsubs.length}`);

    return () => {
      console.log(`[Filtration]  Cleaning up ${unsubs.length} MQTT subscriptions`);
      unsubs.forEach((u) => u());
    };
  }, [deviceSerial]);

  // Function to toggle Stage One expansion
  const toggleStageOneExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsStageOneExpanded(!isStageOneExpanded);
  };

  // Function to start the process (calls backend API; toast when MQTT state received)
  const startProcess = async () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    const ok = await apiStartProcess();
    if (!ok) {
      toast.error("Failed to start process");
      return;
    }
    pendingToastRef.current = 'start_process';
    setIsProcessFailed(false);
  };

  // Function to restart the process (calls backend API; toast when MQTT state received)
  const restartProcess = async () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    const ok = await apiRestartFiltration();
    if (!ok) {
      toast.error("Failed to restart process");
      return;
    }
    pendingToastRef.current = 'restart';
    setIsProcessFailed(false);
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

  // Function to handle Stage One valve control (calls backend API; toast when MQTT state received)
  const handleCompleteStageOne = async () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    if (isStageOneValveOpen) {
      const ok = await apiCloseValve1();
      if (!ok) {
        toast.error("Failed to close valve");
        return;
      }
      pendingToastRef.current = 'close_valve_1';
    } else {
      const ok = await apiOpenValve1();
      if (!ok) {
        toast.error("Failed to open valve");
        return;
      }
      pendingToastRef.current = 'open_valve_1';
    }
  };

  // Function to handle drain water action (calls backend API; toast when MQTT state received)
  const handleDrainWater = async () => {
    if (!deviceSerial) {
      toast.error("Device not found");
      return;
    }
    if (isDrainWaterValveOpen) {
      const ok = await apiCloseDrainValve();
      if (!ok) {
        toast.error("Failed to close drain valve");
        return;
      }
      pendingToastRef.current = 'close_drain';
    } else {
      const ok = await apiOpenDrainValve();
      if (!ok) {
        toast.error("Failed to open drain valve");
        return;
      }
      pendingToastRef.current = 'open_drain';
    }
  };

  // Calculate progress based on completed stages
  const calculateProgress = () => {
    const completedStages = filtrationStages.filter(stage => stage.status === 'completed').length;
    return (completedStages / filtrationStages.length) * 100; // 25% per stage for 4 stages
  };

  // Sync progress to global store for floating bar on other pages
  useEffect(() => {
    const progress = calculateProgress();
    const completedCount = filtrationStages.filter(s => s.status === 'completed').length;
    let statusText = 'Not Started';
    if (completedCount === 4) statusText = 'Complete';
    else if (isProcessFailed) statusText = 'Restart Required';
    else if (isProcessStarted) statusText = 'In Progress...';
    const isActive = isProcessStarted || isProcessCompleted || isProcessFailed;
    setProgress(progress, statusText, isActive, isProcessFailed);
  }, [filtrationStages, isProcessStarted, isProcessCompleted, isProcessFailed, setProgress]);

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
          

          <FiltrationProgressBar floating={false} />
        
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
            <View className="gap-2">
              <Button 
                onPress={handleSaveProcess}
                className="mt-4"
              >
                <Text>Mark as Complete</Text>
              </Button>
              
              <Button 
                variant="outline"
                onPress={handleTransferReservoir}
              >
                <Text>Transfer Water</Text>
              </Button>
            </View>
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
