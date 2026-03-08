import React from 'react';
import { ScrollView, View } from 'react-native';
import { Skeleton, SkeletonText, SkeletonCircle, SkeletonCard } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const imageSize = 300;

export const LettuceViewSkeleton: React.FC = () => {
  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Plant Image Skeleton */}
        <View
          className="mt-2 items-center justify-center py-4"
          style={{
            borderBottomLeftRadius: 30,
            borderBottomRightRadius: 30,
          }}
        >
          <Skeleton
            style={{ width: imageSize, height: imageSize, borderRadius: 12 }}
          />
        </View>

        {/* Folder Section Skeleton */}
        <View className="flex-1 px-4 pt-5 pb-5">
          <SkeletonCard className="rounded-t-3xl border-transparent p-4">
            <View>
              {/* Crop name */}
              <SkeletonText width={160} height={24} className="mb-4" />

              <View className="flex-row justify-between">
                <View className="flex-1">
                  <SkeletonText width={48} height={24} />
                  <SkeletonText width={70} height={12} className="mt-1" />
                  <SkeletonText width={56} height={24} className="mt-1" />
                  <SkeletonText width={90} height={12} className="mt-1" />
                </View>
                <View className="flex-1">
                  <SkeletonText width={48} height={24} />
                  <SkeletonText width={120} height={12} className="mt-1" />
                  <SkeletonText width={40} height={24} className="mt-1" />
                  <SkeletonText width={100} height={12} className="mt-1" />
                </View>
              </View>
            </View>

            <Skeleton className="mt-7 h-12 w-full rounded-xl" />
          </SkeletonCard>

          <Skeleton className="mt-2 h-12 w-full rounded-xl" />
        </View>

        {/* Tabs Skeleton */}
        <View className="px-4 pb-4">
          <View className="flex-row gap-1 rounded-xl bg-gray-100 p-1">
            <Skeleton className="flex-1 h-12 rounded-lg" />
            <Skeleton className="flex-1 h-12 rounded-lg" />
          </View>
        </View>

        {/* Real-Time Monitoring Section Skeleton */}
        <View className="px-4 pb-5">
          <SkeletonText width={180} height={20} className="mb-4" />

          <View className="gap-3">
            <Card className="p-4 border border-muted-foreground/20">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <SkeletonCircle size={16} />
                    <SkeletonText width={60} height={14} />
                  </View>
                  <SkeletonText width={64} height={32} />
                </View>
                <View className="items-end">
                  <SkeletonText width={70} height={12} className="mb-1" />
                  <SkeletonText width={80} height={14} />
                </View>
              </View>
            </Card>

            <Card className="p-4 border border-muted-foreground/20">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <SkeletonCircle size={16} />
                    <SkeletonText width={140} height={14} />
                  </View>
                  <SkeletonText width={80} height={32} />
                </View>
                <View className="items-end">
                  <SkeletonText width={70} height={12} className="mb-1" />
                  <SkeletonText width={80} height={14} />
                </View>
              </View>
            </Card>

            <View className="flex-row gap-3">
              <Card className="flex-1 p-4 border border-muted-foreground/20">
                <View className="flex-row items-center gap-2 mb-2">
                  <SkeletonCircle size={16} />
                  <SkeletonText width={24} height={12} />
                </View>
                <SkeletonText width={56} height={28} />
                <SkeletonText width={50} height={12} className="mt-1" />
              </Card>
              <Card className="flex-1 p-4 border border-muted-foreground/20">
                <View className="flex-row items-center gap-2 mb-2">
                  <SkeletonCircle size={16} />
                  <SkeletonText width={60} height={12} />
                </View>
                <SkeletonText width={48} height={28} />
                <SkeletonText width={90} height={12} className="mt-1" />
              </Card>
            </View>
          </View>
        </View>
    </ScrollView>
  );
};
