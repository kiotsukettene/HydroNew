import { View, Image } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import FolderBg from '@/components/ui/folder-bg';
import { Droplet } from 'lucide-react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore';

export default function LettuceView() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const setupId = params.id;
  const { currentSetup, fetchSetupById, loading, error } = useHydroponicSetupStore();

  useEffect(() => {
    if (setupId) {
      fetchSetupById(Number(setupId));
    }
  }, [setupId]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1">
        {/* =========== Page Header =========== */}
        <View className="relative z-10">
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
                <Text className="mb-4 text-xl font-bold text-white">
                  {currentSetup?.crop_name
                    ? currentSetup.crop_name.charAt(0).toUpperCase() +
                      currentSetup.crop_name.slice(1)
                    : 'Loading...'}
                </Text>

                <View className="flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-white">
                      {currentSetup?.plant_age ?? '-'} Days
                    </Text>
                    <Text className="text-xs text-lime-200">PLANT AGE</Text>

                    <Text className="mt-1 text-xl font-bold text-white">41 %</Text>
                    <Text className="text-xs text-lime-200">HUMIDITY</Text>
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

              <View className="mt-7 items-center">
                <Button
                  className="w-full rounded-xl bg-emerald-50"
                  onPress={() => {
                    router.push('/hydroponics-monitoring/pump-screen');
                  }}
                  disabled={loading}>
                  <Icon as={Droplet} className="text-primary" />
                  <Text className="ml-2 text-primary">Start Pump</Text>
                </Button>
              </View>
            </View>
          </FolderBg>
        </View>

        {/* =========== Setup Information Section =========== */}
        <View className="px-4 pb-5">
          <Card className="rounded-2xl p-6">
            <Text className="mb-4 bg-lime-50 text-lg font-semibold">Crop Details</Text>

            <View className="mb-4 flex-row justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold">
                  {currentSetup?.number_of_crops || 'N/A'}
                </Text>
                <Text className="text-xs text-muted-foreground">NUMBER OF CROPS</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold capitalize">
                  {currentSetup?.bed_size || 'N/A'}
                </Text>
                <Text className="text-xs text-muted-foreground">BED SIZE</Text>
              </View>
            </View>

            <View className="flex-row justify-between">
              <View className="flex-1">
                <Text className="text-base font-bold">
                  {currentSetup?.target_ph_min && currentSetup?.target_ph_max
                    ? `${currentSetup.target_ph_min} - ${currentSetup.target_ph_max}`
                    : 'N/A'}
                </Text>
                <Text className="text-xs text-muted-foreground">TARGET pH RANGE</Text>
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold">
                  {currentSetup?.target_tds_min && currentSetup?.target_tds_max
                    ? `${currentSetup.target_tds_min} - ${currentSetup.target_tds_max} ppm`
                    : 'N/A'}
                </Text>
                <Text className="text-xs text-muted-foreground">TARGET TDS RANGE</Text>
              </View>
            </View>
          </Card>
        </View>
      </View>
    </SafeAreaView>
  );
}
