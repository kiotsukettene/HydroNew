import { View, Image, Pressable, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PageHeader } from '@/components/ui/page-header';
import { Dimensions } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import NoSetup from '@/app/hydroponics-monitoring/no-setup';
import { useFocusEffect } from '@react-navigation/native';

import { useHydroponicSetupStore } from '@/store/hydroponics/hydroponicSetupStore';

const { height: screenHeight } = Dimensions.get('window');

export default function Hydroponics() {
  const router = useRouter();
  const { 
    hydroponicSetups, 
    fetchHydroponicSetups, 
    loading,
    loadingMore,
    hasMore,
    loadMore,
    refresh,
  } = useHydroponicSetupStore();

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Fetch data on focus
      fetchHydroponicSetups(true);
    }, [fetchHydroponicSetups])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Force fresh fetch, bypass cache
    await fetchHydroponicSetups(true, false);
    setRefreshing(false);
  }, [fetchHydroponicSetups]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      loadMore();
    }
  }, [hasMore, loadingMore, loading, loadMore]);


  const renderPlantItem = (item: any) => (
    <View key={item.id}>
      <Pressable 
        onPress={() => router.push({
          pathname: "/hydroponics-monitoring/lettuce-view",
          params: { id: item.id }
        })}>
        <Card className="relative items-center justify-center overflow-hidden border-muted-foreground/30 bg-white py-6 px-6 sm:p-6">
          <View className="relative flex w-full flex-row items-center justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-xl font-semibold sm:text-xl">
                Setup {item.id}: {item.crop_name.charAt(0).toUpperCase() + item.crop_name.slice(1)}
              </Text>
              <Label className="text-sm font-normal text-muted-foreground">
                {new Date(item.setup_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </Label>
              <Text className="mt-1 text-sm font-medium text-primary">
                Growth: {item.growth_percentage}% • {item.growth_stage ? item.growth_stage.charAt(0).toUpperCase() + item.growth_stage.slice(1) : ''}
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
  );

  return (
    <SafeAreaView className="relative flex-1 bg-background">
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2D7D7D']}
              tintColor="#2D7D7D"
            />
          }
        >
          <View className="mt-36 relative z-10">
            <Card className="rounded-t-3xl border-transparent p-5 sm:p-6">
              <View className="mb-2">
                <Text className="text-2xl font-bold">My Plants</Text>
                <Text className="mt-1 text-base text-muted-foreground">
                  Add and select your hydroponic plants to monitor their growth and health.
                </Text>

                <Button className="mt-4" onPress={() => router.push('/hydroponics-monitoring/hydroponics-setup')}>
                  <Text>Add New Plant</Text>
                </Button>

                <Button variant={'outline'} className="mt-4" onPress={() => router.push('/hydroponics-monitoring/harvested-list')}>
                  <Text>View Harvested Crops</Text>
                </Button>
              </View>

              {loading ? (
                <View className="mt-10 items-center py-10">
                  <ActivityIndicator size="large" color="#2D7D7D" />
                  <Text className="mt-4 text-center text-muted-foreground">
                    Loading...
                  </Text>
                </View>
              ) : hydroponicSetups && hydroponicSetups.length > 0 ? (
                <>
                  {hydroponicSetups.map((item) => renderPlantItem(item))}
                  
                  {loadingMore && (
                    <View className="py-4 items-center">
                      <ActivityIndicator size="small" color="#2D7D7D" />
                      <Text className="mt-2 text-xs text-muted-foreground">Loading more...</Text>
                    </View>
                  )}
                  
                  {hasMore && !loadingMore && (
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onPress={handleLoadMore}
                    >
                      <Text>Load More</Text>
                    </Button>
                  )}
                </>
              ) : (
                <NoSetup />
              )}
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
