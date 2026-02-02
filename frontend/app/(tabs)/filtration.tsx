import { View, Image, ScrollView, Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
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
import { publishWithAck, publishMessage, subscribeMessage } from '@/service/mqtt.client';
import { useAuthStore } from '@/store/auth/authStore';
import { useTreatmentStore } from '@/store/treatment/treatmentStore';
import { useSensorStore } from '@/store/sensor/sensorStore';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Map stage id (1–4) to backend stage_name and stage_order for POST /treatment/stages. */
const STAGE_API_MAP: Record<number, { stage_name: import('@/types/treatment').TreatmentStageName; stage_order: number }> = {
  1: { stage_name: 'MFC', stage_order: 1 },
  2: { stage_name: 'Natural Filter', stage_order: 2 },
  3: { stage_name: 'UV Filter', stage_order: 3 },
  4: { stage_name: 'Clean Water Tank', stage_order: 4 },
};

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
  // Backend integration fields
  sensorValue?: number;
  threshold?: number;
  isAlertEnabled?: boolean;
  lastUpdated?: string;
}

export default function Filtration() {
  // Process control states
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const [isProcessFailed, setIsProcessFailed] = useState(false);
  const [isProcessCompleted, setIsProcessCompleted] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);
  const [buttonText, setButtonText] = useState("Start Process");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);
  const [isStageOneExpanded, setIsStageOneExpanded] = useState(false);
  const [deviceSerial, setDeviceSerial] = useState('');
  const [totalCycles, setTotalCycles] = useState(0);
  const { saveTreatment, updateTreatment, saveStage, updateStage, currentTreatment } = useTreatmentStore();
  const userId = useAuthStore((state) => state.user?.id);
  const dirtyWater = useSensorStore((state) => state.dirtyWater);
  const cleanWater = useSensorStore((state) => state.cleanWater);
  const stages2To4TimeoutIdsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const hasFailedStages2To4Ref = useRef(false);
  const [isRestartPumpOpen, setIsRestartPumpOpen] = useState(false);
  const autoCloseRestartPumpTriggeredRef = useRef(false);
  const autoCompleteStageOneTreatmentIdRef = useRef<number | null>(null);
  const autoCloseStageOneTriggeredRef = useRef(false);
  const autoCloseDrainWaterTriggeredRef = useRef(false);
  const [isStageOneValveOpen, setIsStageOneValveOpen] = useState(false);
  const [isDrainWaterValveOpen, setIsDrainWaterValveOpen] = useState(false);
  const [isWaitingForStartAck, setIsWaitingForStartAck] = useState(false);
  const [isWaitingForRestartAck, setIsWaitingForRestartAck] = useState(false);

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

  // Simple helper to save/clear filtration status
  const saveStatus = (stage: number, progress: number, failed = false, complete = false) => {
    AsyncStorage.setItem('filtration_status', JSON.stringify({
      currentStage: `Stage ${stage}`,
      progress: `${progress}% Complete`,
      hasFailed: failed,
      isComplete: complete,
    }));
  };

  const clearStatus = () => AsyncStorage.removeItem('filtration_status');

  /** Persist stage "in progress" to backend when a stage starts. */
  const reportStageInProgress = (stageId: number) => {
    const map = STAGE_API_MAP[stageId];
    if (map) saveStage({ ...map, status: 'processing' });
  };

  /** Update stage result in backend (passed = completed, failed = failed). */
  const reportStageResult = (stageId: number, status: 'passed' | 'failed') => {
    const map = STAGE_API_MAP[stageId];
    if (map) updateStage({ stage_order: map.stage_order, status });
  };

  {/* ========================== GET Device Serial ========================== */}
 
const startTreatment = async () => {
  console.log('[Filtration] startTreatment: calling saveTreatment()');
  try {
    const treatment = await saveTreatment();
    console.log('[Filtration] startTreatment: saveTreatment returned', treatment ? 'data' : 'null', treatment ?? null);
    if (!treatment) {
      const storeError = useTreatmentStore.getState().error;
      console.error('[Filtration] startTreatment: no treatment, store error=', storeError);
      toast.error("Failed to start treatment");
      return;
    }
    console.log('[Filtration] startTreatment: success');
  }
  catch (error) {
    console.error("[Filtration] startTreatment: exception", error);
    toast.error("Failed to start treatment");
    return;
  }
};

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

  // Subscribe to /state topics so all users' UIs stay in sync with hardware (multi-user)
  useEffect(() => {
    if (!deviceSerial) return;

    const unsubs: (() => void)[] = [];

    unsubs.push(
      subscribeMessage(`mfc/${deviceSerial}/valve/1/state`, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsStageOneValveOpen(value === '1');
      })
    );
    unsubs.push(
      subscribeMessage(`mfc_fallback/${deviceSerial}/valve/2/state`, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsDrainWaterValveOpen(value === '1');
      })
    );
    unsubs.push(
      subscribeMessage(`reservoir_fallback/${deviceSerial}/pump/2/state`, (_topic, payload) => {
        const value = payload.toString().trim();
        setIsRestartPumpOpen(value === '1');
      })
    );
    unsubs.push(
      subscribeMessage(`mfc/${deviceSerial}/pump/3/state`, (_topic, payload) => {
        const value = payload.toString().trim();
        if (value === '1') {
          setIsProcessStarted(true);
          setButtonText("On process...");
          setIsWaitingForStartAck(false);
        } else if (value === '0') {
          setIsProcessStarted(false);
          setButtonText("Start Process");
        }
      })
    );

    return () => unsubs.forEach((u) => u());
  }, [deviceSerial]);

  {/* ========================== FUNCTIONALITY TESTING ========================== */}

  // Function to start the process
  const startProcess = () => {
    setIsWaitingForStartAck(true);
    publishWithAck(`mfc/${deviceSerial}/pump/3`, 'OPEN', async (success) => {
      setIsWaitingForStartAck(false);
      if (success) {
        setIsProcessStarted(true);
        setIsProcessFailed(false);
        setButtonText("On process...");
        setCurrentStage(1);
        saveStatus(1, 0);
        setTotalCycles((c) => c + 1);
        updateStageStatus(1, "active", "In Progress", "bg-blue-300", "bg-blue-50", "border-blue-200", "bg-blue-500");
        // Create treatment first so backend has an active treatment; then report stage.
        await startTreatment();
        reportStageInProgress(1);
        toast.success("Pump opened");
      } else {
        toast.error("Failed to open pump");
      }
    });
    console.log(`Published message to mfc/${deviceSerial}/pump/3`);
  };

  // Restart stages 2–4 only (Stage 1 stays complete). Pump OPEN; CLOSE when cleanWater.water_level >= 18.
  const restartProcess = () => {
    setIsWaitingForRestartAck(true);
    hasFailedStages2To4Ref.current = false;
    autoCloseRestartPumpTriggeredRef.current = false;

    publishWithAck(`reservoir_fallback/${deviceSerial}/pump/2`, 'OPEN', (success) => {
      setIsWaitingForRestartAck(false);
      if (success) {
        setIsProcessFailed(false);
        setButtonText("On process...");
        setFiltrationStages(prev =>
          prev.map((stage) =>
            stage.id >= 2
              ? {
                  ...stage,
                  status: "pending" as const,
                  statusText: "Pending",
                  bgColor: "bg-gray-300",
                  cardBgColor: "bg-gray-50",
                  borderColor: "border-gray-200",
                  statusBgColor: "bg-gray-400",
                }
              : stage
          )
        );
        setCurrentStage(2);
        saveStatus(2, 25);
        updateStageStatus(2, "active", "In Progress", "bg-blue-300", "bg-blue-50", "border-blue-200", "bg-blue-500");
        reportStageInProgress(2);
        setIsRestartPumpOpen(true);
        scheduleStages2To4Progress();
        toast.success("Restart pump opened");
      } else {
        toast.error("Failed to open restart pump");
      }
    });
    console.log(`Published message to reservoir_fallback/${deviceSerial}/pump/2 OPEN (restart stages 2–4)`);
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

  // Function to handle Save Process button click (Mark as Complete)
  const handleSaveProcess = async () => {
    try {
      const cyclesToSend = totalCycles > 0 ? totalCycles : 1;
      console.log('[Filtration] handleSaveProcess: calling updateTreatment with total_cycles=', cyclesToSend);
      const updated = await updateTreatment(cyclesToSend);
      console.log('[Filtration] handleSaveProcess: updateTreatment returned', updated ? 'data' : 'null', updated ?? null);
      if (!updated) {
        const storeError = useTreatmentStore.getState().error;
        console.error('[Filtration] handleSaveProcess: update failed, store error=', storeError);
        toast.error("Failed to update treatment");
        return;
      }

      // Create filtration record
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
      
      toast.success("Mark successfully");
      if (deviceSerial) {
        publishMessage(`mfc/${deviceSerial}/pump/3`, 'CLOSE', 1);
      }
      resetProcess();
    } catch (error) {
      console.error('Error saving filtration:', error);
      toast.error("Failed to save filtration");
    }
  };

  // Function to reset the entire process
  const resetProcess = () => {
    setIsProcessStarted(false);
    setIsProcessFailed(false);
    setIsProcessCompleted(false);
    setCurrentStage(0);
    setTotalCycles(0);
    setIsStageOneValveOpen(false);
    setIsDrainWaterValveOpen(false);
    setIsWaitingForStartAck(false);
    setIsWaitingForRestartAck(false);
    setIsRestartPumpOpen(false);
    autoCloseStageOneTriggeredRef.current = false;
    autoCloseDrainWaterTriggeredRef.current = false;
    autoCloseRestartPumpTriggeredRef.current = false;
    hasFailedStages2To4Ref.current = false;
    clearStages2To4Timeouts();
    setButtonText("Start Process");
    setShowSuccessModal(false);
    clearStatus();
    

    // Reset all stages back to pending
    setFiltrationStages([
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
  };

  // Function to toggle Stage One expansion
  const toggleStageOneExpansion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsStageOneExpanded(!isStageOneExpanded);
  };

  // Function to handle drain water action
  const handleDrainWater = () => {
    if (isDrainWaterValveOpen) {
      publishWithAck(`mfc_fallback/${deviceSerial}/valve/2`, 'CLOSE', (success) => {
        if (success) {
          setIsDrainWaterValveOpen(false);
          toast.success("Drain water valve closed");
        } else {
          autoCloseDrainWaterTriggeredRef.current = false; // Allow retry
          toast.error("Failed to close drain water valve");
        }
      });
      console.log(`Published message to mfc_fallback/${deviceSerial}/valve/2 CLOSE`);
    } else {
      publishWithAck(`mfc_fallback/${deviceSerial}/valve/2`, 'OPEN', (success) => {
        if (success) {
          setIsDrainWaterValveOpen(true);
          toast.success("Draining water from Stage MFC");
        } else {
          toast.error("Failed to open drain water valve");
        }
      });
      console.log(`Published message to mfc_fallback/${deviceSerial}/valve/2 OPEN`);
    }
  };

  const handleCompleteStageOne = () => {
    if (isStageOneValveOpen) {
      publishWithAck(`mfc/${deviceSerial}/valve/1`, 'CLOSE', (success) => {
        if (success) {
          setIsStageOneValveOpen(false);
          toast.success("Stage MFC valve closed");
          markStageOneComplete();
        } else {
          autoCloseStageOneTriggeredRef.current = false; // Allow retry
          toast.error("Failed to close Stage MFC valve");
        }
      });
      console.log(`Published message to mfc/${deviceSerial}/valve/1 CLOSE`);
    } else {
      publishWithAck(`mfc/${deviceSerial}/valve/1`, 'OPEN', (success) => {
        if (success) {
          setIsStageOneValveOpen(true);
          toast.success("Stage MFC valve opened");
        } else {
          toast.error("Failed to open Stage MFC valve");
        }
      });
      console.log(`Published message to mfc/${deviceSerial}/valve/1 OPEN`);
    }
  };

  const clearStages2To4Timeouts = () => {
    stages2To4TimeoutIdsRef.current.forEach((id) => clearTimeout(id));
    stages2To4TimeoutIdsRef.current = [];
  };

  // Schedule stages 2–4 progression (5s / 10s / 15s / 20s). Stage 1 must already be complete.
  const scheduleStages2To4Progress = () => {
    clearStages2To4Timeouts();
    const ids: ReturnType<typeof setTimeout>[] = [];

    ids.push(
      setTimeout(() => {
        console.log('[Filtration] Stage 3 now In Progress');
        updateStageStatus(3, "active", "In Progress", "bg-blue-300", "bg-blue-50", "border-blue-200", "bg-blue-500");
        setCurrentStage(3);
        saveStatus(3, 50);
        reportStageInProgress(3);
      }, 5000)
    );
    ids.push(
      setTimeout(() => {
        console.log('[Filtration] Stage 2 completed, Stage 4 now In Progress');
        updateStageStatus(2, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
        reportStageResult(2, 'passed');
        updateStageStatus(4, "active", "In Progress", "bg-blue-300", "bg-blue-50", "border-blue-200", "bg-blue-500");
        setCurrentStage(4);
        saveStatus(4, 75);
        reportStageInProgress(4);
      }, 10000)
    );
    ids.push(
      setTimeout(() => {
        console.log('[Filtration] Stage 3 completed');
        updateStageStatus(3, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
        reportStageResult(3, 'passed');
      }, 15000)
    );
    ids.push(
      setTimeout(() => {
        console.log('[Filtration] Stage 4 completed, process complete');
        updateStageStatus(4, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
        reportStageResult(4, 'passed');
        setButtonText("Process Complete");
        saveStatus(4, 100);
        setTimeout(() => setShowSuccessModal(true), 500);
      }, 20000)
    );
    stages2To4TimeoutIdsRef.current = ids;
  };

  // Mark Stage 1 as complete and move to Stage 2, then progress through stages with timeouts
  const markStageOneComplete = () => {
    console.log('[Filtration] markStageOneComplete: Stage 1 completed, moving to Stage 2');
    hasFailedStages2To4Ref.current = false;
    updateStageStatus(1, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
    reportStageResult(1, 'passed');
    setCurrentStage(2);
    saveStatus(2, 25);
    updateStageStatus(2, "active", "In Progress", "bg-blue-300", "bg-blue-50", "border-blue-200", "bg-blue-500");
    reportStageInProgress(2);
    toast.success("Stage 1 MFC Treatment completed!");
    scheduleStages2To4Progress();
  };

  // Auto-open Stage 1 valve when: (electric_current < 10 and treatment >= 1 day) OR treatment >= 3 days
  useEffect(() => {
    const treatment = currentTreatment;
    if (!treatment?.start_time || treatment.final_status === 'success') return;
    if (autoCompleteStageOneTreatmentIdRef.current === treatment.id) return;

    const startMs = new Date(treatment.start_time).getTime();
    const daysSinceStart = (Date.now() - startMs) / (24 * 60 * 60 * 1000);
    const electricCurrent = dirtyWater?.electric_current ?? 999;

    const openForLowCurrent = electricCurrent < 10 && daysSinceStart >= 1;
    const openForThreeDays = daysSinceStart >= 3;

    if (openForLowCurrent || openForThreeDays) {
      autoCompleteStageOneTreatmentIdRef.current = treatment.id;
      console.log('[Filtration] auto-complete Stage 1: electric_current=', electricCurrent, 'daysSinceStart=', daysSinceStart.toFixed(2));
      handleCompleteStageOne();
    }
  }, [currentTreatment, dirtyWater, deviceSerial]);

  useEffect(() => {
    if (currentTreatment?.id != null && currentTreatment.id !== autoCompleteStageOneTreatmentIdRef.current) {
      autoCompleteStageOneTreatmentIdRef.current = null;
    }
  }, [currentTreatment?.id]);

  // Auto-close Stage 1 valve when valve is open and dirtyWater.water_level >= 18
  // Also marks Stage 1 as complete and moves to Stage 2 (only on ack success)
  useEffect(() => {
    if (!isStageOneValveOpen) {
      autoCloseStageOneTriggeredRef.current = false;
      return;
    }
    if (autoCloseStageOneTriggeredRef.current) return;

    const waterLevel = dirtyWater?.water_level ?? 0;
    if (waterLevel >= 18) {
      autoCloseStageOneTriggeredRef.current = true;
      console.log('[Filtration] auto-close Stage 1 valve: water_level=', waterLevel);
      handleCompleteStageOne(); // Publishes CLOSE; on ack true: setIsStageOneValveOpen(false), markStageOneComplete()
    }
  }, [isStageOneValveOpen, dirtyWater?.water_level, deviceSerial]);

  // Auto-close drain water valve when valve is open and dirtyWater.water_level >= 18
  useEffect(() => {
    if (!isDrainWaterValveOpen) {
      autoCloseDrainWaterTriggeredRef.current = false;
      return;
    }
    if (autoCloseDrainWaterTriggeredRef.current) return;

    const waterLevel = dirtyWater?.water_level ?? 0;
    if (waterLevel >= 18) {
      autoCloseDrainWaterTriggeredRef.current = true;
      console.log('[Filtration] auto-close drain water valve: water_level=', waterLevel);
      handleDrainWater();
    }
  }, [isDrainWaterValveOpen, dirtyWater?.water_level, deviceSerial]);

  // Fail (Stage 4 Failed, Restart button) when cleanWater.ai_classification === 'bad', Stage 3 complete, Stage 4 in progress
  useEffect(() => {
    if (cleanWater?.ai_classification !== 'bad') return;
    if (hasFailedStages2To4Ref.current) return;

    const s3 = filtrationStages.find((s) => s.id === 3);
    const s4 = filtrationStages.find((s) => s.id === 4);
    const stage3Complete = s3?.status === 'completed';
    const stage4InProgress = s4?.status === 'active';

    if (!stage3Complete || !stage4InProgress) return;

    hasFailedStages2To4Ref.current = true;
    clearStages2To4Timeouts();
    updateStageStatus(4, "failed", "Failed", "bg-red-500", "bg-red-50", "border-red-200", "bg-red-400");
    reportStageResult(4, 'failed');
    setIsProcessFailed(true);
    saveStatus(4, 75, true);
    console.log('[Filtration] Stage 4 failed (cleanWater.ai_classification bad), Restart required');
  }, [cleanWater?.ai_classification, filtrationStages]);

  // Pump CLOSE only when pump is open (restart initialized) and cleanWater.water_level >= 18
  useEffect(() => {
    if (!isRestartPumpOpen) {
      autoCloseRestartPumpTriggeredRef.current = false;
      return;
    }
    if (autoCloseRestartPumpTriggeredRef.current) return;

    const waterLevel = cleanWater?.water_level ?? 0;
    if (waterLevel >= 18) {
      autoCloseRestartPumpTriggeredRef.current = true;
      publishWithAck(`reservoir_fallback/${deviceSerial}/pump/2`, 'CLOSE', (success) => {
        if (success) {
          setIsRestartPumpOpen(false);
          toast.success("Restart pump closed");
        } else {
          autoCloseRestartPumpTriggeredRef.current = false; // Allow retry
          toast.error("Failed to close restart pump");
        }
      });
      console.log('[Filtration] auto-close restart pump: cleanWater.water_level=', waterLevel);
    }
  }, [isRestartPumpOpen, cleanWater?.water_level, deviceSerial]);

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
            {!isProcessFailed && !isProcessCompleted && (
              <Button 
                onPress={handleButtonClick}
                disabled={isWaitingForStartAck || (isProcessStarted && !isProcessFailed) || buttonText === "Process Complete"}
                className={isWaitingForStartAck || (isProcessStarted && !isProcessFailed) || buttonText === "Process Complete" ? "opacity-50" : ""}
              >
                <Text>{isWaitingForStartAck ? "Starting..." : buttonText}</Text>
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

           {/* Re-start Process Button - appears below main content card when process fails */}
          {isProcessFailed && (
            <Button 
              onPress={handleButtonClick}
              className="mt-4 bg-destructive"
            >
              <Text>Re-start Process</Text>
            </Button>
          )}
          
          {/* Save Process Button - appears below main content card after success modal */}
          {isProcessCompleted && (
            <Button 
              onPress={handleSaveProcess}
              className="mt-4 bg-secondary"
            >
              <Text>Mark as Complete</Text>
            </Button>
          )}
          

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
                        
                        {/*  ============= Drain Water button for Stage One ============== */}
                        {isStageOne && isStageOneExpanded && (
                          <View className="mt-3 gap-1">
                            <Button
                             className="w-full h-8"
                             onPress={() => handleCompleteStageOne()}>
                             <Text className="text-xs">{isStageOneValveOpen ? 'Close Valve' : 'Open Valve'}</Text>
                           </Button>
                            <Button 
                              variant="outline" 
                              className="w-full h-8"
                              onPress={handleDrainWater}
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
                          {/* ===== ===== Failed Modal ===== ===== */}
                      <FailedDetailsModal
                        visible={showFailedModal}
                        onClose={() => setShowFailedModal(false)}
                      />
                      </View>
                    </Pressable>
                  
                  </View>
                );
              })}
            </View>
          </Card>
          
          {/* Re-start Process Button - appears below main content card when process fails */}
          {isProcessFailed && (
            <Button 
              onPress={handleButtonClick}
              disabled={isWaitingForRestartAck}
              className={`mt-4 ${isWaitingForRestartAck ? "opacity-50" : ""}`}
            >
              <Text>{isWaitingForRestartAck ? "Restarting..." : "Re-start Process"}</Text>
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
