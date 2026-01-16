import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Svg, Circle, G } from 'react-native-svg';

interface PerformanceGaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function PerformanceGauge({ 
  score, 
  size = 120, 
  strokeWidth = 12,
  label = 'Performance Score'
}: PerformanceGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return '#10b981'; // green
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  return (
    <View className="items-center">
      <View style={{ width: size, height: size }} className="items-center justify-center">
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Background Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e5e7eb"
              strokeWidth={strokeWidth}
              fill="none"
            />
            {/* Progress Circle */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={getColor()}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={circumference - progress}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View className="absolute items-center justify-center">
          <Text className="text-3xl font-bold text-gray-900">{score}</Text>
          <Text className="text-xs text-muted-foreground">/ 100</Text>
        </View>
      </View>
      <Text className="text-sm text-muted-foreground mt-2">{label}</Text>
    </View>
  );
}

