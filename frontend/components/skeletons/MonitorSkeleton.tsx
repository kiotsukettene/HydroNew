import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard } from '@/components/ui/skeleton';

export const MonitorSkeleton: React.FC = () => {
  return (
    <ScrollView>
      <SafeAreaView className="bg-white">
        {/* ===== Page Header Skeleton ===== */}
        <View className="flex-row items-center justify-center py-4">
          <Skeleton className="h-7 w-48 rounded-md" />
        </View>

        <View className="p-4">
          {/* ===== Water Quality Card Skeleton ===== */}
          <SkeletonCard className="mt-1 rounded-2xl bg-[#BCE7F0]/50 p-4">
            <View className="p-2">
              {/* Tabs Skeleton */}
              <View className="mb-4 flex-row rounded-lg bg-gray-200/50 p-1">
                <Skeleton className="mr-1 h-10 flex-1 rounded-md" />
                <Skeleton className="h-10 flex-1 rounded-md" />
              </View>

              {/* Tab Content Skeleton */}
              <View className="p-2">
                <View className="flex-row justify-between">
                  {/* Left Column: Sensor Details */}
                  <View className="justify-between gap-4">
                    {/* pH Level */}
                    <View>
                      <SkeletonText width={70} height={14} />
                      <Skeleton className="mt-2 h-6 w-16 rounded" />
                    </View>

                    {/* TDS */}
                    <View>
                      <SkeletonText width={40} height={14} />
                      <Skeleton className="mt-2 h-6 w-20 rounded" />
                    </View>

                    {/* Turbidity */}
                    <View>
                      <SkeletonText width={70} height={14} />
                      <Skeleton className="mt-2 h-6 w-16 rounded" />
                    </View>
                  </View>

                  {/* Right Column: Water Tank Level Circle */}
                  <View className="items-center">
                    <SkeletonCircle size={144} />
                    <Skeleton className="mt-2 h-6 w-20 rounded-full" />
                  </View>
                </View>

                {/* Start Filtration Button Skeleton */}
                <Skeleton className="mt-4 h-12 w-full rounded-lg" />
              </View>
            </View>
          </SkeletonCard>

          {/* ===== Generate AI Insights Button Skeleton ===== */}
          <Skeleton className="mt-4 h-12 w-full rounded-lg" />

          {/* ===== pH Level Scale Skeleton ===== */}
          <View className="mt-4 gap-2">
            <View className="flex-row items-center justify-between px-2">
              <SkeletonText width={180} height={20} />
              <SkeletonText width={80} height={14} />
            </View>
            {/* pH Scale Bar Skeleton */}
            <Skeleton className="mt-2 h-8 w-full rounded-full" />
            {/* pH Scale Labels */}
            <View className="mt-2 flex-row justify-between px-2">
              <SkeletonText width={20} height={12} />
              <SkeletonText width={20} height={12} />
              <SkeletonText width={20} height={12} />
              <SkeletonText width={20} height={12} />
              <SkeletonText width={20} height={12} />
            </View>
          </View>

          {/* ===== Need Help Card Skeleton ===== */}
          <SkeletonCard className="mt-4 min-h-24 rounded-2xl">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 gap-2">
                <SkeletonText width={120} height={24} />
                <SkeletonText width="90%" height={16} />
              </View>
              <SkeletonCircle size={28} />
            </View>
          </SkeletonCard>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
