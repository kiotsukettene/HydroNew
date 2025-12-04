import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Text } from './text';
import { Icon } from './icon';
import { Calendar as CalendarIcon, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
  recommendedMinDate?: string;
  recommendedMaxDate?: string;
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onDateChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
  recommendedMinDate,
  recommendedMaxDate,
  className,
  disabled = false,
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDayPress = (day: { dateString: string }) => {
    onDateChange(day.dateString);
    setShowCalendar(false);
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Generate marked dates for recommended range
  const getMarkedDates = () => {
    const marked: any = {};

    // Mark recommended date range with light green background
    if (recommendedMinDate && recommendedMaxDate) {
      const startDate = new Date(recommendedMinDate);
      const endDate = new Date(recommendedMaxDate);
      const currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        // Check if this date is the selected date
        if (value === dateString) {
          // Selected date within range: keep light green background, change text color only
          marked[dateString] = {
            color: '#E8F5E9', // Keep recommended range background
            textColor: '#4CAF50', // Dark green text to stand out
            startingDay: dateString === recommendedMinDate,
            endingDay: dateString === recommendedMaxDate,
          };
        } else {
          // Recommended range gets light green background with dark text
          marked[dateString] = {
            color: '#E8F5E9',
            textColor: '#2C3E50',
            startingDay: dateString === recommendedMinDate,
            endingDay: dateString === recommendedMaxDate,
          };
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }

    // If selected date is outside recommended range: just text color + dot
    if (value && !marked[value]) {
      marked[value] = {
        textColor: '#4CAF50', // Dark green text
        marked: true, // Add dot indicator
        dotColor: '#4CAF50', // Dark green dot
      };
    }

    return marked;
  };

  return (
    <>
      <TouchableOpacity
        className={cn(
          'border border-muted-foreground/50 rounded-xl px-3 py-4 bg-[#FAFFFA] flex-row items-center justify-between',
          disabled && 'opacity-50',
          className
        )}
        onPress={() => !disabled && setShowCalendar(true)}
        disabled={disabled}
      >
        <Text
          className={cn(
            'text-[#2C3E50] text-base',
            !value && 'text-muted-foreground'
          )}
        >
          {formatDisplayDate(value || '')}
        </Text>
        <Icon as={CalendarIcon} size={20} className="text-[#7F8C8D]" />
      </TouchableOpacity>

      <Modal
        visible={showCalendar}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-center items-center"
          onPress={() => setShowCalendar(false)}
        >
          <Pressable
            className="bg-white rounded-2xl p-4 m-4 w-11/12 max-w-md"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Select Harvest Date</Text>
              <TouchableOpacity onPress={() => setShowCalendar(false)}>
                <Icon as={X} size={24} className="text-muted-foreground" />
              </TouchableOpacity>
            </View>

            {recommendedMinDate && recommendedMaxDate && (
              <View className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                <View className="flex-row items-start gap-2">
                  <View className="mt-0.5">
                    <View className="w-4 h-4 bg-[#E8F5E9] rounded" />
                  </View>
                  <Text className="text-xs text-blue-700 flex-1">
                    Highlighted dates are the recommended harvest window for optimal crop maturity
                  </Text>
                </View>
              </View>
            )}

            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              markingType={'period'}
              minDate={minDate}
              maxDate={maxDate}
              theme={{
                todayTextColor: '#4CAF50',
                dayTextColor: '#2C3E50',
                textDisabledColor: '#d9e1e8',
                dotColor: '#4CAF50',
                arrowColor: '#4CAF50',
                monthTextColor: '#2C3E50',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '400',
                textMonthFontWeight: '600',
                textDayHeaderFontWeight: '600',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

