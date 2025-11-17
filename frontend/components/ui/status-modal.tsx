import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { CheckCircle, XCircle, X } from 'lucide-react-native';
import { cn } from '@/lib/utils';

interface StatusModalProps {
  visible: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  buttonText?: string;
  onClose: () => void;
  onButtonPress?: () => void;
}

export function StatusModal({
  visible,
  type,
  title,
  message,
  buttonText,
  onClose,
  onButtonPress,
}: StatusModalProps) {
  const isSuccess = type === 'success';
  const iconBgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';
  const textColor = isSuccess ? 'text-green-700' : 'text-red-700';
  const buttonColor = isSuccess ? 'bg-green-600' : 'bg-red-600';

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          {/* Close Button */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 items-center justify-center z-10"
          >
            <Icon as={X} size={16} className="text-gray-600" />
          </TouchableOpacity>

          {/* Icon */}
          <View className={cn('mb-4 rounded-full w-16 h-16 items-center justify-center mx-auto', iconBgColor)}>
            <Icon 
              as={isSuccess ? CheckCircle : XCircle} 
              size={32} 
              className={iconColor}
            />
          </View>

          {/* Title */}
          <Text className="text-xl font-semibold text-center mb-2" >
            {title}
          </Text>

          {/* Message */}
          <Text className="text-muted-foreground  text-center mb-6">
            {message}
          </Text>

          {/* Button */}
          <Button 
          variant={'ghost'}
            onPress={handleButtonPress}
            
          >
            <Text className=" font-medium">
              {buttonText || (isSuccess ? 'OK' : 'Try Again')}
              
            </Text>
          </Button>
        </View>
      </View>
    </Modal>
  );
}

