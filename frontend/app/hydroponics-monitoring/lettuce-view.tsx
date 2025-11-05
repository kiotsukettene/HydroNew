import { View, Image } from 'react-native'
import React, { useEffect} from 'react'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import FolderBg from '@/components/ui/folder-bg'
import { Droplet } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { Card } from '@/components/ui/card'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore'
import { useYieldStore } from '@/store/hydroponics/hydroponicYieldStore'


export default function LettuceView() {
  const router = useRouter()
  const params = useLocalSearchParams();
  const setupId = params.id;
  const { hydroponicSetups } = useHydroponicSetupStore();
  const { yields, fetchYieldBySetup, loading, error } = useYieldStore();
  const setup = hydroponicSetups.find((setup) => setup.id === Number(setupId));

  useEffect(() =>{ 
    if (setupId){
      fetchYieldBySetup(Number(setupId));
    }
  }, [setupId]);

  const yieldData = yields.length > 0 ? yields[0] : null;

  return (
       <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* =========== Page Header =========== */}
        <View className="relative z-10 ">
          <PageHeader title="Hydroponics Monitoring" />
        </View>

        {/* =========== Plant Section =========== */}
        <View
          className="mt-2"
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}>
          <View className="items-center justify-center py-4">
            <Image 
              source={require('@/assets/images/lettuce.png')} 
              style={{ width: 160, height: 160 }}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* =========== Folder Section =========== */}
        <View className="flex-1 px-4 pt-5">
         <FolderBg>
  <View className="flex-1 justify-between p-4">
    <View>
      <Text className="mb-4 text-xl font-bold text-white">My {setup?.crop_name}</Text>

      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-xl font-bold text-white">{yieldData?.plant_age} Days</Text>
          <Text className="text-xs text-lime-200">PLANT AGE</Text>

          <Text className="mt-1 text-xl font-bold text-white">41 %</Text>
          <Text className="text-xs text-lime-200">HUMIDITY</Text>
        </View>

        <View className="flex-1">
          <Text className="text-xl font-bold text-white">{yieldData?.days_left} Days</Text>
          <Text className="text-xs text-lime-200">ESTIMATED DAYS LEFT</Text>

          <Text className="mt-1 text-xl font-bold text-white">{setup?.water_amount} %</Text>
          <Text className="text-xs text-lime-200">WATER TANK AVAILABLE</Text>
        </View>
      </View>
    </View>
 
    <View className="items-center mt-7">
      <Button className="w-full rounded-xl bg-emerald-50 " onPress={() => {router.push('/hydroponics-monitoring/pump-screen')}}>
        <Icon as={Droplet} className="text-primary" />
        <Text className="ml-2  text-primary">Start Pump</Text>
      </Button>
      
      {/* Debug button */}
      {/* <Button 
        variant="outline" 
        className="w-full rounded-xl border-red-200 mt-2"
        onPress={toggleSetupState}
      >
        <Text className="text-red-200">Debug: Toggle Setup State</Text>
      </Button> */}
    </View>
  </View>
</FolderBg>
        </View>

        {/* =========== Setup Information Section =========== */}
        <View className="px-4 pb-5">
          <Card className="p-6 rounded-2xl ">
            <Text className="text-lg font-semibold mb-4 bg-lime-50">Crop Details</Text>
            
            <View className="flex-row justify-between mb-4">
              <View className="flex-1">
                <Text className="text-base font-bold">{setup?.number_of_crops || 'N/A'}</Text>
                <Text className="text-xs text-muted-foreground">NUMBER OF CROPS</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold capitalize">{setup?.bed_size || 'N/A'}</Text>
                <Text className="text-xs text-muted-foreground">BED SIZE</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold">
                  {setup?.target_ph_min && setup?.target_ph_max 
                    ? `${setup.target_ph_min} - ${setup.target_ph_max}`
                    : 'N/A'}
                </Text>
                <Text className="text-xs text-muted-foreground">TARGET pH RANGE</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold">
                  {setup?.target_tds_min && setup?.target_tds_max 
                    ? `${setup.target_tds_min} - ${setup.target_tds_max} ppm`
                    : 'N/A'}
                </Text>
                <Text className="text-xs text-muted-foreground">TARGET TDS RANGE</Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
      
    </SafeAreaView>
  )
}