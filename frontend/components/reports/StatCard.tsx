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
  colorScheme?: 'primary' | 'success' | 'warning' | 'danger';
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  subtitle, 
  trend,
  trendValue,
  colorScheme = 'primary'
}: StatCardProps) {
  const getColorClass = () => {
    switch (colorScheme) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'danger': return 'text-red-600';
      default: return 'text-primary';
    }
  };

  return (
    <Card className="p-4 border border-muted-foreground/20">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            {icon && (
              <Icon as={icon} size={16} className="text-muted-foreground" />
            )}
            <Text className="text-sm text-muted-foreground">{title}</Text>
          </View>
          <Text className={`text-3xl font-bold ${getColorClass()}`}>
            {value}
          </Text>
          {subtitle && (
            <Text className="text-xs text-muted-foreground mt-1">{subtitle}</Text>
          )}
        </View>
        {trend && (
          <TrendIndicator trend={trend} value={trendValue} showLabel={false} />
        )}
      </View>
    </Card>
  );
}

