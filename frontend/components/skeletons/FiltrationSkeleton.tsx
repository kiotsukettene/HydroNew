import React from 'react';
import { ScrollView, View } from 'react-native';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard } from '@/components/ui/skeleton';

export const FiltrationSkeleton: React.FC = () => {
  return (
    <View className="flex-1 relative">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="mt-36 relative z-10">
            <SkeletonCard className="rounded-t-3xl border-transparent p-5 sm:p-6">
              {/* Title Skeleton */}
              <View className="mb-4">
                <SkeletonText width={220} height={28} />
                <SkeletonText width={180} height={16} className="mt-1" />
              </View>

              {/* Button Skeleton */}
              <Skeleton className="h-12 w-full rounded-lg mb-3" />
              <Skeleton className="h-12 w-full rounded-lg mb-4" />

              {/* Progress Card Skeleton */}
              <SkeletonCard className="mt-0 flex-row items-center justify-between border-0 p-3 sm:p-4">
                <View className="flex-1 flex-row items-center">
                  <SkeletonCircle size={40} />
                  <View className="ml-3 flex-1">
                    <SkeletonText width={120} height={16} />
                  </View>
                </View>
                <SkeletonCircle size={48} />
              </SkeletonCard>

              {/* Stages Card Skeleton */}
              <SkeletonCard className="mt-4 border-2 border-gray-200 shadow-lg rounded-2xl">
                <View className="px-2 sm:px-4">
                  {/* Stage 1 */}
                  {[1, 2, 3, 4].map((stage, index) => (
                    <View 
                      key={stage}
                      className={`relative flex-row items-center ${index < 3 ? 'mb-6 sm:mb-8' : ''}`}
                    >
                      <SkeletonCircle size={40} className="mr-4 sm:mr-6" />
                      
                      <View className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 p-3 sm:p-4">
                        <View className="flex-row items-center justify-between mb-2 sm:mb-3">
                          <SkeletonText width={80} height={18} />
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </View>
                        <SkeletonText width={140} height={16} />
                        <SkeletonText width={160} height={14} className="mt-1" />
                      </View>
                    </View>
                  ))}
                </View>
              </SkeletonCard>
            </SkeletonCard>
        </View>
      </ScrollView>
    </View>
  );
};
