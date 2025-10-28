import { View, Image, Pressable, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import NoSetup from '@/app/hydroponics-monitoring/no-setup';

import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore';

const { height: screenHeight } = Dimensions.get('window');

export default function Hydroponics() {
  const router = useRouter();
  const { hydroponicSetups, fetchHydroponicSetups, loading } = useHydroponicSetupStore();

  useEffect(() => {
    fetchHydroponicSetups(); 
  }, []);


  if (loading) return <Text>Loading...</Text>;
  if (!hydroponicSetups || hydroponicSetups.length === 0) return <NoSetup />;

  return (
    <SafeAreaView className="relative flex-1">
      <Image
        source={require('@/assets/images/list-bg.png')}
        className="absolute w-full"
        style={{ top: 0, height: 300 }}
      />

      <View className="relative z-10">
        <PageHeader title="Hydroponics Monitoring" />
      </View>

      <View className="relative flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="relative z-10 mt-36">
            <Card className="rounded-t-3xl border-transparent sm:p-6">
              <View className="mb-2 mt-4 px-6">
                <Text className="text-2xl font-bold">My Plants</Text>
                <Text className="mt-1 text-base text-muted-foreground">
                  Add and select your hydroponic plants to monitor their growth and health.
                </Text>

                <Button className="mt-4" onPress={() => router.push('/hydroponics-monitoring/hydroponics-setup')}>
                  <Text>Add New Plant</Text>
                </Button>

                  <View className="gap-3 sm:p-6">
                    {hydroponicSetups.map((item) => (
                      <View key={item.id}>
                        <Pressable key={item.id} 
                          onPress={() => router.push({
                            pathname: "/hydroponics-monitoring/lettuce-view",
                            params: { id: item.id }
                          })}
                          className="mt-4">
                          <Card className="relative items-center justify-center overflow-hidden border-muted-foreground/50 bg-muted/30 py-8 px-6 sm:p-6">
                            <View className="relative flex w-full flex-row items-center justify-between">
                              <View className="flex-1 pr-4">
                                <Text className="text-xl font-semibold sm:text-xl">{item.crop_name}</Text>
                                <Label className="text-xs font-normal text-muted-foreground">
                                  {new Date(item.setup_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </Label>
                                <Text className="mt-1 text-sm font-medium text-green-600">
                                  Growth: {item.growth_percentage ? `${item.growth_percentage}%` : '45%'}
                                </Text>
                              </View>
                              <Image
                                source={require('@/assets/images/lettuce-2.png')}
                                className="size-12 opacity-55 sm:h-20 sm:w-20 md:h-24 md:w-24"
                                resizeMode="contain"
                              />
                            </View>
                          </Card>
                        </Pressable>
                      </View>
                    ))}
                  </View>
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
