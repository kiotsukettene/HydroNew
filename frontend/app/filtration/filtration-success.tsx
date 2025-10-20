import React from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react-native';

interface FiltrationSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onViewDetails?: () => void;
  tdsData?: any;
}

export default function FiltrationSuccessModal({
  visible,
  onClose,
  onViewDetails,
}: FiltrationSuccessModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-foreground/50 items-center justify-center px-6 relative">
        {/* Modal Container */}
        <View className="rounded-3xl bg-background w-full max-w-sm relative overflow-hidden">
          
          {/* ===== Background Image at Bottom ===== */}
          <View className="absolute -bottom-1 left-0 right-0">
            <Image
              source={require('@/assets/images/email-verify-bg.png')}
              style={{
                width: '100%',
                height: undefined,
                aspectRatio: 2.5, // maintains proportions
              }}
              resizeMode="cover" // fills full width, no white sides
            />
          </View>

          {/* ===== Modal Content ===== */}
          <View className="p-6 pb-28 relative z-10">
            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted items-center justify-center z-20"
            >
              <X size={16} className="text-foreground" />
            </TouchableOpacity>

            {/* Check Icon */}
            <View className="items-center mb-6 mt-8">
              <View className="rounded-full w-16 h-16 bg-lime-50 items-center justify-center">
                <Image
                  source={require('@/assets/images/check.png')}
                  className="w-full h-full"
                  resizeMode="contain"
                />
              </View>
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-primary text-center mb-3">
              Filtration Complete!
            </Text>

            {/* Subtitle */}
            <Text className="text-muted-foreground text-center mb-8 text-base leading-5">
              Water is now safe and ready for your hydroponics system.
            </Text>

            {/* Action Button */}
            <Button onPress={onViewDetails || onClose} className='mb-10'>
              <Text>View Filtration Details</Text>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
