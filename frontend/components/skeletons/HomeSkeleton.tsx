import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard } from '@/components/ui/skeleton';

export const HomeSkeleton: React.FC = () => {
  return (
    <ScrollView className="bg-white">
      <SafeAreaView>
        <View className="p-4">
          {/* ===== Page Header Skeleton ===== */}
          <View className="flex-row items-center justify-between pt-2">
            <View>
              <SkeletonText width={50} height={16} />
              <Skeleton className="mt-1 h-8 w-32 rounded" />
            </View>
            <SkeletonCircle size={24} />
          </View>

          {/* ===== Main Content ===== */}
          <View className="mt-5">
            {/* ===== Water Quality Card Skeleton ===== */}
            <SkeletonCard className="relative h-60 overflow-hidden rounded-2xl p-0">
              {/* pH Level */}
              <View className="absolute left-6 top-9 z-10">
                <Skeleton className="h-12 w-24 rounded" />
                <SkeletonText width={80} height={18} className="mt-2" />
              </View>

              {/* Water Info */}
              <View className="absolute bottom-4 left-9 z-10 rounded-lg bg-gray-200/50 px-10 py-3">
                <View className="flex-row gap-16">
                  <View>
                    <SkeletonText width={90} height={16} />
                    <Skeleton className="mt-2 h-7 w-20 rounded-full" />
                  </View>
                  <View>
                    <SkeletonText width={90} height={16} />
                    <Skeleton className="mt-2 h-7 w-16 rounded-full" />
                  </View>
                </View>
              </View>
            </SkeletonCard>

            {/* ===== Growth Card Skeleton ===== */}
            <View className="mt-5">
              <SkeletonCard className="relative min-h-40 overflow-hidden rounded-2xl p-6">
                <View className="flex-1 justify-between">
                  {/* Badge and Title */}
                  <View>
                    <Skeleton className="mb-2 h-6 w-36 self-start rounded-full" />
                    <SkeletonText width={180} height={18} className="px-2" />
                  </View>

                  {/* Growth Percentage */}
                  <View className="mt-4 flex-row items-center px-2">
                    <Skeleton className="h-12 w-20 rounded" />
                    <SkeletonCircle size={24} className="ml-2" />
                  </View>
                </View>
              </SkeletonCard>
            </View>

            {/* ===== Quick Actions Skeleton ===== */}
            <View className="mt-6">
              <SkeletonText width={130} height={22} className="px-2" />

              <View className="mt-3 flex-row gap-2">
                {/* Plant Status Card */}
                <SkeletonCard className="flex-1 min-h-24 justify-between rounded-2xl p-4">
                  <SkeletonCircle size={24} />
                  <View className="mt-2">
                    <SkeletonText width={50} height={18} />
                    <SkeletonText width={50} height={18} className="mt-1" />
                  </View>
                </SkeletonCard>

                {/* Right Column Cards */}
                <View className="gap-2">
                  {/* Device Card */}
                  <SkeletonCard className="min-h-20 rounded-2xl p-4">
                    <SkeletonCircle size={24} />
                    <SkeletonText width={50} height={14} className="mt-2" />
                  </SkeletonCard>

                  {/* Report Card */}
                  <SkeletonCard className="flex-1 min-h-20 rounded-2xl p-4">
                    <SkeletonCircle size={24} />
                    <SkeletonText width={130} height={14} className="mt-2" />
                  </SkeletonCard>
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};
