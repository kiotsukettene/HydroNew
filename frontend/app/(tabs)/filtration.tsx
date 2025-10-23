import { View, Image, ScrollView,} from 'react-native';
import React, { useState, useEffect } from 'react';
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
  const [currentStage, setCurrentStage] = useState(0);
  const [buttonText, setButtonText] = useState("Start Process");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showFailedModal, setShowFailedModal] = useState(false);

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



  {/* ========================== FUNCTIONALITY TESTING ========================== */}

  // Function to start the process
  const startProcess = () => {
    setIsProcessStarted(true);
    setIsProcessFailed(false);
    setButtonText("On process...");
    setCurrentStage(1);
    
    // Start Stage 1
    setTimeout(() => {
      updateStageStatus(1, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
      setCurrentStage(2);
      
      // Start Stage 2 (will fail for testing)
      setTimeout(() => {
        updateStageStatus(2, "failed", "Failed", "bg-red-500", "bg-red-50", "border-red-200", "bg-red-400");
        setIsProcessFailed(true);
        setButtonText("Re-start Process");
      }, 2000);
    }, 2000);
  };

  // Function to restart the process
  const restartProcess = () => {
    setIsProcessFailed(false);
    setButtonText("On process...");
    
    // Fix Stage 2 and continue
    setTimeout(() => {
      updateStageStatus(2, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
      setCurrentStage(3);
      
      // Continue to Stage 3
      setTimeout(() => {
        updateStageStatus(3, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
        setCurrentStage(4);
        
        // Complete Stage 4
        setTimeout(() => {
          updateStageStatus(4, "completed", "Completed", "bg-green-300", "bg-green-50", "border-green-100", "bg-green-500");
          setButtonText("Process Complete");
          // Show success modal after completion
          setTimeout(() => {
            setShowSuccessModal(true);
          }, 500);
        }, 2000);
      }, 2000);
    }, 2000);
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

  // Function to reset the entire process
  const resetProcess = () => {
    setIsProcessStarted(false);
    setIsProcessFailed(false);
    setCurrentStage(0);
    setButtonText("Start Process");
    setShowSuccessModal(false);
    
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

  useEffect(() => {
    return () => {};
  }, []);


 
  return (  
    <SafeAreaView className="flex-1 relative">
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
            <Button 
              onPress={handleButtonClick}
              disabled={(isProcessStarted && !isProcessFailed) || buttonText === "Process Complete"}
              className={(isProcessStarted && !isProcessFailed) || buttonText === "Process Complete" ? "opacity-50" : ""}
            >
              <Text>{buttonText}</Text>
            </Button>
          

          <Card className="mt-0 flex-row items-center justify-between border-0 bg-emerald-50 p-3 sm:p-4">


            <View className="flex-1 flex-row items-center">
              <View className="text mr-2 sm:mr-3 h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/40">
                <Loader className="text-muted" size={18} />
              </View>

              {/* Text with background patterns */}
              <View className="relative flex-1">
                <Text className="text-base sm:text-lg font-semibold text-primary">In Progress...</Text>
          
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
                    strokeDasharray={`${2 * Math.PI * 20}`}
                    strokeDashoffset={`${2 * Math.PI * 20 * 0.95}`}
                    strokeLinecap="round"
                    transform="rotate(-90 24 24)"
                  />
                </Svg>
                {/* Percentage text */}
                <View className="absolute inset-0 items-center justify-center">
                  <Text className="text-xs sm:text-sm md:text-base font-bold text-emerald-800">0%</Text>
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
                
                return (
                  <View key={stage.id} className={`relative flex-row items-center ${!isLast ? 'mb-6 sm:mb-8' : ''}`}>
                    <View className={`relative z-10 mr-4 sm:mr-6 w-10 h-10 sm:w-11 sm:h-11 ${stage.bgColor} rounded-full items-center justify-center ${
                      stage.status === 'active' ? 'border-2 sm:border-4 border-blue-200' : ''
                    }`}>
                      <IconComponent className={stage.status === 'pending' ? 'text-foreground/70' : stage.status === 'failed' ? 'text-white' : 'text-muted'} size={18} />
                    </View>
                    
                  
                    
                    {/* Stage Card */}
                    <View className={`flex-1 ${stage.cardBgColor} rounded-2xl p-3 sm:p-4 ${
                      stage.status === 'active' ? 'border-2' : stage.status === 'failed' ? 'border-2' : 'border'
                    } ${stage.borderColor}`}>
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
                  
                  </View>
                );
              })}
            </View>
          </Card>
          </Card>
          </View>
          </ScrollView>
        </View>

        {/* ===== ===== Success Modal ===== ===== */}
        <FiltrationSuccessModal
          visible={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            resetProcess();
          }}
          onViewDetails={() => {
            setShowSuccessModal(false);
            router.push('/filtration/filtration-details');
            resetProcess();
          }}
        />
      </SafeAreaView>
    );
  }
