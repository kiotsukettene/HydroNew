import React from 'react';
import { ScrollView, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const FiltrationSkeleton: React.FC = () => {
  return (
    <SafeAreaView className="relative flex-1 bg-background">
      {/* Background Image - same as filtration page */}
      <Image
        source={require('@/assets/images/filtration-bg.png')}
        className="absolute w-full"
        style={{ top: 0, height: 300 }}
      />

      {/* Page Header Skeleton */}
      <View className="relative z-10 flex-row items-center justify-center py-4">
        <Skeleton className="h-7 w-32 rounded-md" />
      </View>

      <View className="relative flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="relative z-10 mt-36">
            <Card className="rounded-t-3xl border-transparent p-5 sm:p-6">
              {/* Title & subtitle */}
              <View className="mb-1">
                <Skeleton className="h-7 w-56 rounded" />
                <SkeletonText width={220} height={14} className="mt-2" />
              </View>

              {/* Start Process button */}
              <Skeleton className="h-12 w-full rounded-lg" />

              {/* View All Filtration button */}
              <View className="-mt-3">
                <Skeleton className="h-10 w-full rounded-lg" />
              </View>

              {/* Progress status card */}
              <SkeletonCard className="mt-0 flex-row items-center justify-between rounded-xl border-0 bg-emerald-50/80 p-3 sm:p-4">
                <View className="flex-1 flex-row items-center">
                  <SkeletonCircle size={36} className="mr-2 sm:mr-3" />
                  <Skeleton className="h-4 flex-1 max-w-24 rounded" />
                </View>
                <View className="ml-2 sm:ml-3">
                  <SkeletonCircle size={48} />
                </View>
              </SkeletonCard>

              {/* Stages card with timeline */}
              <Card className="mt-4 border-2 border-gray-200 rounded-2xl shadow-lg">
                <View className="relative px-2 sm:px-4 py-2">
                  {/* Timeline line */}
                  <View
                    className="absolute left-6 sm:left-7 top-10 w-0.5 rounded-full bg-gray-200"
                    style={{ height: '85%' }}
                  />

                  {/* 4 stage rows */}
                  {[1, 2, 3, 4].map((id, index) => (
                    <View
                      key={id}
                      className={`relative flex-row items-center ${index < 3 ? 'mb-6 sm:mb-8' : ''}`}
                    >
                      <View className="relative z-10 mr-4 sm:mr-6">
                        <SkeletonCircle size={40} />
                      </View>

                      <SkeletonCard className="flex-1 rounded-2xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                        <View className="flex-row items-center justify-between mb-2 sm:mb-3">
                          <Skeleton className="h-5 w-16 rounded" />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </View>
                        <SkeletonText width={160} height={16} />
                        <SkeletonText width="90%" height={12} className="mt-1" />
                      </SkeletonCard>
                    </View>
                  ))}
                </View>
              </Card>
            </Card>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
