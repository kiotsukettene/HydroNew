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
  className?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onDateChange,
  placeholder = 'Select date',
  minDate,
  maxDate,
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

            <Calendar
              onDayPress={handleDayPress}
              markedDates={
                value
                  ? {
                      [value]: {
                        selected: true,
                        selectedColor: '#4CAF50',
                      },
                    }
                  : {}
              }
              minDate={minDate}
              maxDate={maxDate}
              theme={{
                selectedDayBackgroundColor: '#4CAF50',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#4CAF50',
                dayTextColor: '#2C3E50',
                textDisabledColor: '#d9e1e8',
                dotColor: '#4CAF50',
                selectedDotColor: '#ffffff',
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

