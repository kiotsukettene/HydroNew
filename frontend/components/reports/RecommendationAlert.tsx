import { View } from 'react-native';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { Icon } from '@/components/ui/icon';
import { AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react-native';

interface RecommendationAlertProps {
  recommendations: string[];
  type?: 'info' | 'warning' | 'success' | 'error';
  title?: string;
}

export function RecommendationAlert({ 
  recommendations, 
  type = 'info',
  title = 'Recommendations'
}: RecommendationAlertProps) {
  if (!recommendations || recommendations.length === 0) return null;

  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          iconColor: 'text-yellow-600',
          textColor: 'text-yellow-800',
        };
      case 'success':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-800',
        };
      case 'error':
        return {
          icon: AlertCircle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-800',
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-800',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Card className={`p-4 ${config.bgColor} border ${config.borderColor}`}>
      <View className="flex-row items-start gap-3">
        <Icon as={config.icon} size={20} className={config.iconColor} />
        <View className="flex-1">
          <Text className={`text-base font-semibold ${config.textColor} mb-2`}>
            {title}
          </Text>
          {recommendations.map((recommendation, index) => (
            <View key={index} className="flex-row items-start gap-2 mb-1">
              <Text className={`text-sm ${config.textColor}`}>•</Text>
              <Text className={`text-sm ${config.textColor} flex-1`}>
                {recommendation}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </Card>
  );
}

