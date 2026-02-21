import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner-native';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import FolderBg from '@/components/ui/folder-bg';
import { Droplet, Leaf, Activity, Thermometer, Wind, Edit, AlertTriangle } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore';
import { useSensorStore } from '@/store/sensor/sensorStore';
import { subscribeMessage, publishWithAck } from '@/service/mqtt.client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '@/store/auth/authStore';
import { Separator } from '@/components/ui/separator';
import { ConfirmationModal } from '@/components/ui/confirmation-modal';

export default function LettuceView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setupId = params.id;
  const { currentSetup, fetchSetupById, loading, error } = useHydroponicSetupStore();
  const [activeTab, setActiveTab] = useState<'details' | 'monitoring'>('monitoring');
  const userId = useAuthStore((state) => state.user?.id);
  const [deviceSerial, setDeviceSerial] = useState('');
  /** Pump running (from /state); when true, button muted for all users. */
  const [isHydroponicsPumpRunning, setIsHydroponicsPumpRunning] = useState(false);
  /** Waiting for ack after clicking Start Pump. */
  const [isWaitingForPumpAck, setIsWaitingForPumpAck] = useState(false);
  const [isLowWaterWarningVisible, setIsLowWaterWarningVisible] = useState(false);

  // Real-time hydroponics sensor data - read directly from store (subscription is in _layout.tsx via useEchoSetup)
  const hydroponicsWater = useSensorStore((state) => state.hydroponicsWater);
  const cleanWater = useSensorStore((state) => state.cleanWater);

  // Check if harvest is allowed (plant age must be >= 14 days)
  const canHarvest = currentSetup ? (currentSetup.plant_age ?? 0) >= 14 : false;

  const isPhOutOfRange =
    hydroponicsWater?.ph != null &&
    currentSetup
      ? hydroponicsWater.ph < currentSetup.target_ph_min ||
        hydroponicsWater.ph > currentSetup.target_ph_max
      : false;

  const isTdsOutOfRange =
    hydroponicsWater?.tds != null &&
    currentSetup
      ? hydroponicsWater.tds < currentSetup.target_tds_min ||
        hydroponicsWater.tds > currentSetup.target_tds_max
      : false;


  // mappings here for each GIF you want to support.
  const cropGifMap: Record<string, any> = {
    olmetie: require('../../assets/gif-lettuce/olmetie.gif'),
    'green-rapid': require('../../assets/gif-lettuce/green-rapid.gif'),
    romaine: require('../../assets/gif-lettuce/romaine.gif'),
    butterhead: require('../../assets/gif-lettuce/butterhead.gif'),
    loose: require('../../assets/gif-lettuce/loose.gif'),
  };

  const gifKey = currentSetup?.crop_name
    ? currentSetup.crop_name.toString().toLowerCase().replace(/\s+/g, '-')
    : 'lettuce';

  const plantImageSource = cropGifMap[gifKey] ?? cropGifMap['lettuce'];

  
  // fixed GIF size
  const imageSize = 300;


  {/* ========================== GET Device Serial ========================== */}
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
  },[userId]);


  useEffect(() => {
    if (setupId) {
      fetchSetupById(Number(setupId));
    }
  }, [setupId]);

  // Subscribe to pump state so all users see button muted when pump is running
  useEffect(() => {
    if (!deviceSerial) return;
    const topic = `hydroponics/${deviceSerial}/pump/1/state`;
    const unsubscribe = subscribeMessage(topic, (_t, payload) => {
      const value = payload.toString().trim();
      setIsHydroponicsPumpRunning(value === '1');
    });
    return unsubscribe;
  }, [deviceSerial]);

  const pumpWater = () => {
    if (!deviceSerial) return;
    setIsWaitingForPumpAck(true);
    publishWithAck(`hydroponics/${deviceSerial}/pump/1`, 'OPEN', (success) => {
      setIsWaitingForPumpAck(false);
      if (success) {
        toast.success('Pump started');
        router.push('/hydroponics-monitoring/pump-screen');
      } else {
        toast.error('Failed to start pump');
      }
    });
    console.log(`Published message to hydroponics/${deviceSerial}/pump/1`);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* =========== Page Header =========== */}
        <View className="relative z-10">
          <PageHeader 
            title="Hydroponics Monitoring" 
            showBackButton={true} 
            showNotificationButton={false}
            
          />
        </View>

        {/* =========== Plant Section =========== */}
        <View
          className="mt-2"
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <View className="items-center justify-center py-2">
            {/* fixed-size container: constrains layout so only the GIF changes size */}
            <View style={{ width: imageSize, height: imageSize, alignItems: 'center', justifyContent: 'center' }}>
              {/* Soft gradient background behind image (radial-style glow) */}
              <LinearGradient
                colors={[
                  
                  'rgba(34,197,94,0.08)',
                  'rgba(34,197,94,0.04)',
                ]}
                locations={[0, 0.3, 0.5, 0.7, 1]}
                style={{
                  position: 'absolute',
                  width: imageSize * 0.75,
                  height: imageSize * 0.75,
                  borderRadius: imageSize * 0.45,
                }}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
              />
              <Image
                source={plantImageSource}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
            {/* Growth progress indicator */}
            {currentSetup?.plant_age != null && currentSetup?.days_left != null && (() => {
              const totalDays = currentSetup.plant_age + currentSetup.days_left;
              const progressPercent = totalDays > 0
                ? Math.min(100, Math.max(0, (currentSetup.plant_age / totalDays) * 100))
                : 0;
              return (
                <View className="w-full px-6 mt-3">
                  <View className="flex-row justify-between items-center mb-1.5">
                    <Text className="text-xs text-muted-foreground">Growth</Text>
                    <Text className="text-xs font-semibold text-muted-foreground">
                      {Math.round(progressPercent)}%
                    </Text>
                  </View>
                  <View className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                    <View
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </View>
                </View>
              );
            })()}
          </View>
        </View>

        {/* =========== Folder Section =========== */}
        <View className="flex-1 px-4  pb-5">
          <View style={{ position: 'relative' }}>
            <FolderBg>
            <View className="flex-1 justify-between p-4">
              <View>
                <Text className="mb-4 text-2xl font-bold text-white">
                  {currentSetup?.crop_name
                    ? currentSetup.crop_name.charAt(0).toUpperCase() +
                      currentSetup.crop_name.slice(1)
                    : 'Loading...'}
                </Text>
                <Separator className='mb-3 -mt-3 w-32 opacity-40'/>
                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {currentSetup?.plant_age ?? '-'} Days
                    </Text>
                    <Text className="text-xs text-lime-200">PLANT AGE</Text>

                    <Text className="mt-1 text-xl font-bold text-white">{currentSetup?.water_amount ?? '-'}</Text>
                    <Text className="text-xs text-lime-200">WATER AMOUNT</Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {currentSetup?.days_left ?? '-'} Days
                    </Text>
                    <Text className="text-xs text-lime-200">ESTIMATED DAYS LEFT</Text>

                    <Text className="mt-1 text-xl font-bold text-white">
                      {currentSetup?.number_of_crops ?? '-'}
                    </Text>
                    <Text className="text-xs text-lime-200">NUMBER OF CROPS</Text>
                  </View>
                </View>
              </View>

              <View className="mt-7">
                <Button
                  className={`w-full rounded-xl bg-emerald-50 ${(isHydroponicsPumpRunning || isWaitingForPumpAck) ? 'opacity-50' : ''}`}
                  onPress={() => {
                    const waterLevel = cleanWater?.water_level ?? 0;
                    if (waterLevel <= 10) {
                      setIsLowWaterWarningVisible(true);
                    } else {
                      pumpWater();
                    }
                  }}
                  disabled={loading || isHydroponicsPumpRunning || isWaitingForPumpAck}>
                  <Icon as={Droplet} className="text-primary" />
                  <Text className="ml-2 text-primary">
                    {isWaitingForPumpAck ? 'Starting...' : isHydroponicsPumpRunning ? 'Pumping water...' : 'Start Pump'}
                  </Text>
                </Button>
                <ConfirmationModal
                  visible={isLowWaterWarningVisible}
                  icon={<Icon as={AlertTriangle} size={40} color="#eab308" />}
                  iconBgColor="bg-yellow-100"
                  modalTitle="Low Water Warning"
                  modalDescription={`Your clean water tank is ${cleanWater?.water_level != null && !isNaN(cleanWater.water_level) ? cleanWater.water_level.toFixed(0) : ' '}running low. Pumping now may not be enough to irrigate your crops properly. Are you sure you want to continue?`}
                  confirmText="Yes, Pump it"
                  confirmButtonColor="bg-primary"
                  onCancel={() => setIsLowWaterWarningVisible(false)}
                  onConfirm={() => {
                    setIsLowWaterWarningVisible(false);
                    pumpWater();
                  }}
                />
              </View>
            </View>
          </FolderBg>
            <Button
              style={{
                position: 'absolute',
                top: '2.2%',
                right: '1.85%',
                width: '24.6%',
                height: '19.3%',
                borderRadius: 20,
                backgroundColor: '#D9D9D9',
                
              }}
              disabled={loading || !currentSetup}
              className="rounded-[20px] bg-[#D9D9D9]"
              onPress={() => {
                  if (setupId) {
                    router.push(`/hydroponics-monitoring/hydroponics-setup-edit?id=${setupId}` as any);
                  }
                }}>

              <Edit size={16} className="text-foreground" />
              <Text className="text-foreground font-semibold">Edit</Text>
            </Button>
           
          </View>

          {/* Mark as Harvested Button - Outside FolderBg */}
          <View>
            <Button
              variant="outline"
              className={`w-full rounded-2xl mt-4 ${!canHarvest ? 'opacity-50 border-muted-foreground' : 'border-primary'}`}
              onPress={() => {
                router.push({
                  pathname: '/hydroponics-monitoring/harvest-form',
                  params: { id: setupId }
                });
              }}
              disabled={loading || !canHarvest}>
              <Icon as={Leaf} className={!canHarvest ? 'text-muted-foreground' : 'text-primary'} />
              <Text className={`ml-2 ${!canHarvest ? 'text-muted-foreground' : 'text-primary'}`}>
                Mark as Harvested
              </Text>
            </Button>
            {!canHarvest && currentSetup && (
              <Text className="text-xs text-muted-foreground text-center mt-2">
                {currentSetup.plant_age !== null && currentSetup.plant_age !== undefined
                  ? `${14 - currentSetup.plant_age} day${14 - currentSetup.plant_age !== 1 ? 's' : ''} remaining until harvest is available`
                  : 'Minimum 14 days required before harvest'}
              </Text>
            )}
          </View>
        </View>

        {/* =========== Tabs Section =========== */}
        <View className="px-4 pb-4">
          <View className="flex-row bg-gray-100 rounded-xl p-1">
            <TouchableOpacity
              activeOpacity={1}
              className={`flex-1 py-3 rounded-lg ${activeTab === 'monitoring' ? 'bg-primary' : 'bg-transparent'}`}
              onPress={() => setActiveTab('monitoring')}
            >
              <Text className={`text-center font-semibold ${activeTab === 'monitoring' ? 'text-white' : 'text-muted-foreground'}`}>
                Real-Time
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              className={`flex-1 py-3 rounded-lg ${activeTab === 'details' ? 'bg-primary' : 'bg-transparent'}`}
              onPress={() => setActiveTab('details')}
            >
              <Text className={`text-center font-semibold ${activeTab === 'details' ? 'text-white' : 'text-muted-foreground'}`}>
                Crop Details
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* =========== Real-Time Monitoring Section =========== */}
        {activeTab === 'monitoring' && (
          <View className="px-4 pb-5">
            <View className="mb-4">
              <Text className="text-lg font-semibold">Real-Time Monitoring</Text>
            </View>

            {/* Monitoring Cards Grid */}
            <View className="gap-3">
              {/* pH Level Card */}
              <Card className={`p-4 border ${isPhOutOfRange ? 'border-red-300' : 'border-muted-foreground/20'}`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Icon as={Activity} size={16} className="text-muted-foreground" />
                      <Text className="text-base text-muted-foreground">pH Level</Text>
                    </View>
                    <Text className={`text-3xl font-bold ${isPhOutOfRange ? 'text-red-500' : ''}`}>
                      {hydroponicsWater?.ph != null && !isNaN(hydroponicsWater.ph) ? hydroponicsWater.ph.toFixed(2) : '--'}
                    </Text>
                    {isPhOutOfRange && (
                      <Text className="text-xs text-red-500 mt-1">pH level is outside the target range</Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-muted-foreground mb-1">Target Range</Text>
                    <Text className="text-sm font-semibold">{currentSetup?.target_ph_min} - {currentSetup?.target_ph_max}</Text>
                  </View>
                </View>
              </Card>

              {/* TDS Card */}
              <Card className={`p-4 border ${isTdsOutOfRange ? 'border-red-300' : 'border-muted-foreground/20'}`}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Icon as={Droplet} size={16} className="text-muted-foreground" />
                      <Text className="text-sm text-muted-foreground">TDS (Total Dissolved Solids)</Text>
                    </View>
                    <Text className={`text-3xl font-bold ${isTdsOutOfRange ? 'text-red-500' : ''}`}>
                      {hydroponicsWater?.tds ? Math.round(hydroponicsWater.tds) : '--'} <Text className={`text-lg ${isTdsOutOfRange ? 'text-red-500' : 'text-muted-foreground'}`}>ppm</Text>
                    </Text>
                    {isTdsOutOfRange && (
                      <Text className="text-xs text-red-500 mt-1">TDS is outside the target range</Text>
                    )}
                  </View>
                  <View className="items-end">
                    <Text className="text-xs text-muted-foreground mb-1">Target Range</Text>
                    <Text className="text-sm font-semibold">{currentSetup?.target_tds_min} - {currentSetup?.target_tds_max}</Text>
                  </View>
                </View>
              </Card>

              {/* EC and Humidity Row */}
              <View className="flex-row gap-3">
                <Card className="flex-1 p-4 border border-muted-foreground/20">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Icon as={Thermometer} size={16} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">EC</Text>
                  </View>
                  <Text className="text-2xl font-bold">
                    {hydroponicsWater?.ec != null && !isNaN(hydroponicsWater.ec) ? hydroponicsWater.ec.toFixed(2) : '--'}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">mS/cm</Text>
                </Card>

                <Card className="flex-1 p-4 border border-muted-foreground/20">
                  <View className="flex-row items-center gap-2 mb-2">
                    <Icon as={Wind} size={16} className="text-muted-foreground" />
                    <Text className="text-xs text-muted-foreground">Humidity</Text>
                  </View>
                  <Text className="text-2xl font-bold">
                    {hydroponicsWater?.humidity != null && !isNaN(hydroponicsWater.humidity) ? `${hydroponicsWater.humidity.toFixed(0)}%` : '--'}
                  </Text>
                  <Text className="text-xs text-muted-foreground mt-1">Optimal: 50-70%</Text>
                </Card>
              </View>
            </View>
          </View>
        )}

        {/* =========== Setup Information Section =========== */}
        {activeTab === 'details' && (
          <View className="px-4 pb-5">
            <Card className="rounded-2xl p-6">
              <Text className="text-base font-semibold">Your Crop Details:</Text>
              <Separator className='w-full '/>
              {/* Basic Info */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold capitalize">
                    {currentSetup?.crop_name || 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">CROP NAME</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.status ? currentSetup.status.charAt(0).toUpperCase() + currentSetup.status.slice(1) : 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">STATUS</Text>
                </View>
              </View>

              {/* Setup and Harvest Dates */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.setup_date 
                      ? new Date(currentSetup.setup_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">SETUP DATE</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.harvest_date 
                      ? new Date(currentSetup.harvest_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">EXPECTED HARVEST</Text>
                </View>
              </View>

              {/* Bed and Crops Info */}
              <View className="mb-4 flex-row justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold capitalize">
                    {currentSetup?.bed_size || 'N/A'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">BED SIZE</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold">
                    {currentSetup?.nutrient_solution || 'Not specified'}
                  </Text>
                  <Text className="text-xs text-muted-foreground">NUTRIENT SOLUTION</Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
