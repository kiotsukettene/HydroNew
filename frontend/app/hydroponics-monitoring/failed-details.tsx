import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react-native';

interface FailedDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  onRetry?: () => void;
}

export default function FailedDetailsModal({
  visible,
  onClose,
  onRetry,
}: FailedDetailsModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-foreground/10 items-center justify-center px-6">
        {/* Modal Container */}
        <View className="rounded-3xl bg-muted w-full max-w-sm p-6">
          
          {/* Header with Failed status and X icon */}
          <View className="flex-row items-center mb-6">
            <View className="w-8 h-8 rounded-full bg-red-100 items-center justify-center mr-3">
              <X size={20} className="text-red-600" />
            </View>
            <Text className="text-xl font-bold text-red-600">Failed</Text>
          </View>

          {/* Details Section */}
          <View className="mb-4">
            <Text className="font-bold mb-2">Details:</Text>
            <Text className=" ">
              The Filtration System Stopped Because The Device Is Not Connected.
            </Text>
          </View>

          {/* Possible Cause Section */}
          <View className="mb-4">
            <Text className=" font-bold  mb-2">Possible Cause:</Text>
            <Text className="">
              The IoT Unit Is Unplugged Or Lost Power.
            </Text>
          </View>

          {/* Suggested Action Section */}
          <View className="mb-6">
            <Text className="text-base font-bold text-primary my-3">Suggested Action:</Text>
            <View className="space-y-2">
              <View className="flex-row items-start">
                <Text className="mr-2">•</Text>
                <Text className=" flex-1">
                  Check If The Device Is Plugged In Properly.
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className=" mr-2">•</Text>
                <Text className="flex-1">
                  Make Sure The Power Source Is Working.
                </Text>
              </View>
              <View className="flex-row items-start">
                <Text className=" mr-2">•</Text>
                <Text className=" flex-1">
                  Reconnect The Device And Try Again.
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-3">
            <Button 
              variant="outline" 
              className="flex-1 border-primary"
              onPress={onClose}
            >
              <Text>Close</Text>
            </Button>
            
          </View>
        </View>
      </View>
    </Modal>
  );
}
