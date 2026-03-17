import React, { useEffect } from 'react';
import { View, Pressable } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react-native';
import { useFiltrationProgressStore } from '@/store/filtration/filtrationProgressStore';
import { router } from 'expo-router';

interface FiltrationProgressBarProps {
  /** When true, renders as a floating bar. When false, renders inline (e.g. on filtration page). */
  floating?: boolean;
}

export function FiltrationProgressBar({ floating = false }: FiltrationProgressBarProps) {
  const { progress, statusText, isActive, isProcessFailed, syncFromApi } = useFiltrationProgressStore();

  // When floating, sync from API on mount so we have latest progress (filtration page may be unmounted)
  useEffect(() => {
    if (floating) syncFromApi();
  }, [floating, syncFromApi]);

  // When floating (on other pages), only show when process is active. On filtration page, always show.
  if (floating && !isActive) return null;

  const isComplete = progress >= 100;

  const cardBg = isProcessFailed
    ? 'bg-red-50'
    : isComplete
      ? 'bg-emerald-50'
      : 'bg-slate-100';

  const progressColor = isProcessFailed ? '#ef4444' : isComplete ? '#16a34a' : '#64748b';
  const progressTextColor = isProcessFailed
    ? 'text-red-800'
    : isComplete
      ? 'text-emerald-800'
      : 'text-slate-700';

  const statusTextColor = floating ? 'text-slate-800' : 'text-primary';
  const cardChrome = floating ? 'border border-slate-200' : 'border-0';
  const cardPadding = floating ? 'px-3 py-2 sm:px-4 sm:py-2.5' : 'p-3 sm:p-4';

  const iconSizeClass = floating ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-9 w-9 sm:h-10 sm:w-10';
  const ringBoxClass = floating
    ? 'h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14'
    : 'h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16';
  const ringSvgClass = floating ? 'absolute sm:w-12 sm:h-12 md:w-14 md:h-14' : 'absolute sm:w-14 sm:h-14 md:w-16 md:h-16';
  const ringSize = floating ? 44 : 48;
  const ringCenter = ringSize / 2;
  const ringRadius = floating ? 18 : 20;
  const ringCircumference = 2 * Math.PI * ringRadius;

  const content = (
    <Card
      className={`flex-row items-center justify-between ${cardPadding} ${cardChrome} ${cardBg}`}
    >
      <View className="flex-1 flex-row items-center">
        <View className={`mr-2 sm:mr-3 ${iconSizeClass} items-center justify-center rounded-full bg-slate-200`}>
          <Loader className="text-slate-600" size={18} />
        </View>
        <View className="relative flex-1">
          <Text className={`text-base sm:text-sm ${statusTextColor}`}>{statusText}</Text>
        </View>
      </View>
      <View className="ml-2 sm:ml-3 md:ml-4">
        <View className={`relative ${ringBoxClass}`}>
          <Svg width={ringSize} height={ringSize} className={ringSvgClass}>
            <Circle
              cx={ringCenter}
              cy={ringCenter}
              r={ringRadius}
              stroke="#e5e7eb"
              strokeWidth={2.5}
              fill="transparent"
            />
            <Circle
              cx={ringCenter}
              cy={ringCenter}
              r={ringRadius}
              stroke={progressColor}
              strokeWidth={2.5}
              fill="transparent"
              strokeDasharray={ringCircumference}
              strokeDashoffset={ringCircumference * (1 - progress / 100)}
              strokeLinecap="round"
              transform={`rotate(-90 ${ringCenter} ${ringCenter})`}
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Text className={`text-xs sm:text-sm md:text-base font-bold ${progressTextColor}`}>
              {Math.round(progress)}%
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );

  if (floating) {
    return (
      <Pressable
        onPress={() => router.push('/(tabs)/filtration')}
        className="absolute left-4 right-4 bottom-20 z-[5]"
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
