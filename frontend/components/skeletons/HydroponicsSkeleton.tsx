import React from 'react';
import { ScrollView, View } from 'react-native';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

export const HydroponicsSkeleton: React.FC = () => {
  return (
    <View className="relative flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="relative z-10 mt-36">
            <Card className="rounded-t-3xl border-transparent">
              <View className="mb-2 mt-4 px-6">
                {/* Title */}
                <Skeleton className="h-8 w-32 rounded" />
                <SkeletonText width="90%" height={16} className="mt-2" />

                {/* Add New Plant Button Skeleton */}
                <Skeleton className="mt-4 h-12 w-full rounded-lg" />

                {/* View Harvested Crops Button Skeleton */}
                <Skeleton className="mt-4 h-12 w-full rounded-lg" />

                {/* Plant Cards List Skeleton */}
                <View className="gap-3 mt-4">
                  {[1, 2, 3].map((item) => (
                    <SkeletonCard
                      key={item}
                      className="mt-4 flex-row items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-6 py-8"
                    >
                      <View className="flex-1 pr-4">
                        {/* Setup Title */}
                        <SkeletonText width={180} height={22} />
                        {/* Date */}
                        <SkeletonText width={140} height={14} className="mt-2" />
                        {/* Growth Info */}
                        <SkeletonText width={160} height={14} className="mt-2" />
                      </View>
                      {/* Plant Image Placeholder */}
                      <SkeletonCircle size={48} />
                    </SkeletonCard>
                  ))}
                </View>
              </View>
            </Card>
          </View>
      </ScrollView>
    </View>
  );
};
