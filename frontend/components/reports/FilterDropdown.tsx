import React, { useState } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/ui/icon';
import { Filter, X } from 'lucide-react-native';
import { Button } from '@/components/ui/button';

interface FilterDropdownProps {
  children: React.ReactNode;
  filterCount?: number;
  buttonText?: string;
}

export function FilterDropdown({ 
  children, 
  filterCount = 0,
  buttonText = 'Filters'
}: FilterDropdownProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <TouchableOpacity 
        activeOpacity={0.7} 
        onPress={() => setShowModal(true)}
        className="mb-4"
      >
        <Card className="p-3 border border-primary/30 bg-primary/5">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Icon as={Filter} size={18} className="text-primary" />
              <Text className="text-sm font-semibold text-primary">
                {buttonText}
              </Text>
              {filterCount > 0 && (
                <View className="bg-primary rounded-full px-2 py-0.5 min-w-[20px] items-center">
                  <Text className="text-xs font-bold text-white">{filterCount}</Text>
                </View>
              )}
            </View>
            <Icon as={Filter} size={16} className="text-primary" />
          </View>
        </Card>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable 
          className="flex-1 bg-black/40 justify-end"
          onPress={() => setShowModal(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Card className="rounded-t-3xl rounded-b-none max-h-[80%]">
              {/* Header */}
              <View className="flex-row items-center justify-between p-4 border-b border-muted-foreground/20">
                <Text className="text-lg font-semibold text-gray-900">{buttonText}</Text>
                <TouchableOpacity onPress={() => setShowModal(false)}>
                  <Icon as={X} size={24} className="text-muted-foreground" />
                </TouchableOpacity>
              </View>

              {/* Filter Content */}
              <ScrollView className="px-4 py-2 max-h-[500px]">
                {children}
              </ScrollView>

              {/* Apply Button */}
              <View className="p-4 border-t border-muted-foreground/20">
                <Button 
                  onPress={() => setShowModal(false)}
                  className="w-full"
                >
                  <Text className="text-white font-semibold">Apply Filters</Text>
                </Button>
              </View>
            </Card>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

