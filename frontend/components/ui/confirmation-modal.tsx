import React from 'react';
import { View, Modal } from 'react-native';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; 
import { Text } from '@/components/ui/text';

interface ConfirmationModalProps {
  visible: boolean;
  icon: React.ReactNode;
  modalTitle: string;
  modalDescription: string;
  confirmText?: string;
  iconBgColor?: string;     
  confirmButtonColor?: string; 
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal = ({
  visible,
  icon,
  modalTitle,
  modalDescription,
  confirmText = 'Confirm',
  iconBgColor,
  confirmButtonColor,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="bg-white rounded-2xl  p-6 items-center mx-6">
          {/* Icon */}
          <View
            className={cn(
              'size-20 rounded-full p-4 mb-4 items-center justify-center',
              iconBgColor
            )}
          >
            {icon}
          </View>

          {/* Title */}
          <Text className="text-xl font-semibold text-muted-foreground mb-2 text-center">
            {modalTitle}
          </Text>

          {/* Description */}
          <Text className="text-center text-muted-foreground mb-6">
            {modalDescription}
          </Text>

          {/* Buttons */}
          <View className="flex-row w-full gap-3">
            {/* Cancel Button */}
            <View className="flex-1">
              <Button
                onPress={onCancel}
                variant={'ghost'}
                className="active:bg-muted/80 w-full border border-muted-foreground/30 h-10 items-center justify-center"
              >
                <Text className="text-muted-foreground font-medium">
                  Cancel
                </Text>
              </Button>
            </View>

            {/* Confirm Button */}
            <View className="flex-1">
              <Button
                onPress={onConfirm}
                className={cn(
                  'w-full h-10 items-center justify-center',
                  confirmButtonColor
                )}
              >
                <Text className="text-white font-medium">
                  {confirmText}
                </Text>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
