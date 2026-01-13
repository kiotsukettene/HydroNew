import { View } from 'react-native';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/skeleton';

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function ChartContainer({ 
  title, 
  subtitle, 
  loading = false, 
  children, 
  action 
}: ChartContainerProps) {
  return (
    <Card className='border-muted-foreground/30 px-2 py-4 bg-gradient-to-br from-secondary/20 to-white rounded-2xl overflow-hidden'>
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1 px-4 pt-2">
          <Text className="text-2xl font-bold text-primary">{title}</Text>
          {subtitle && (
            <Text className="text-base text-gray-600 mt-1">{subtitle}</Text>
          )}
        </View>
        {action && (
          <View className="pr-4 pt-2">
            {action}
          </View>
        )}
      </View>
      
      {loading ? (
        <View className="px-4 py-8">
          <Skeleton className="w-full h-64 rounded-lg" />
        </View>
      ) : (
        <View className="w-full">
          {children}
        </View>
      )}
    </Card>
  );
}

