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

  const cardBg =
    progress === 100 ? 'bg-emerald-100' : isProcessFailed ? 'bg-red-50' : 'bg-emerald-50';

  const content = (
    <Card
      className={`flex-row items-center justify-between border-0 p-3 sm:p-4 ${cardBg}`}
    >
      <View className="flex-1 flex-row items-center">
        <View className="mr-2 sm:mr-3 h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/40">
          <Loader className="text-muted" size={18} />
        </View>
        <View className="relative flex-1">
          <Text className="text-base sm:text-sm text-primary">{statusText}</Text>
        </View>
      </View>
      <View className="ml-2 sm:ml-3 md:ml-4">
        <View className="relative h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16">
          <Svg width={48} height={48} className="absolute sm:w-14 sm:h-14 md:w-16 md:h-16">
            <Circle
              cx={24}
              cy={24}
              r={20}
              stroke="#e5e7eb"
              strokeWidth={2.5}
              fill="transparent"
            />
            <Circle
              cx={24}
              cy={24}
              r={20}
              stroke="#16a34a"
              strokeWidth={2.5}
              fill="transparent"
              strokeDasharray={2 * Math.PI * 20}
              strokeDashoffset={2 * Math.PI * 20 * (1 - progress / 100)}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
          </Svg>
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-xs sm:text-sm md:text-base font-bold text-emerald-800">
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
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 5,
        }}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}
