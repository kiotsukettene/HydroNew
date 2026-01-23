import { View } from 'react-native';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { LucideIcon } from 'lucide-react-native';
import { TrendIndicator } from './TrendIndicator';
import type { TrendDirection } from '@/types/reports';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  subtitle?: string;
  trend?: TrendDirection;
  trendValue?: string;
  bgClassName?: string;
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger';
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend,
  trendValue,
  bgClassName = '',
  colorScheme = 'primary'
}: StatCardProps) {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'success': return 'text-foreground';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <Card className={`p-4 border border-muted-foreground/20 rounded-2xl ${bgClassName}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          {icon && (
            <View className={`${getColorClass()} rounded-2xl p-3 mr-3`}>
              <Icon as={icon} size={20} className={getColorClass()} />
            </View>
          )}
          <View className="flex-1">
            <Text className="text-sm font-medium text-gray-500 mb-0.5">{title}</Text>
            <Text className={`text-2xl font-bold ${getColorClass()}`}>
              {value}
            </Text>
            {subtitle && (
              <Text className="text-xs text-muted-foreground mt-0.5">{subtitle}</Text>
            )}
          </View>
        </View>
        {trend && (
          <TrendIndicator trend={trend} value={trendValue} showLabel={false} />
        )}
      </View>
    </Card>
  );
}

