import React from 'react';
import { View, Modal } from 'react-native';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react-native';

interface CropOption {
  value: string;
  label: string;
  description: string;
}

interface CropInfoModalProps {
  visible: boolean;
  onClose: () => void;
  cropOptions?: CropOption[];
}

const defaultCropOptions: CropOption[] = [
  { value: 'olmetie', label: 'Olmetie', description: 'Fast-growing lettuce variety' },
  { value: 'green-rapid', label: 'Green rapid', description: 'Quick harvest lettuce type' },
  { value: 'romaine', label: 'Romaine', description: 'Crisp leaves, popular for salads' },
  { value: 'butterhead', label: 'Butterhead', description: 'Tender, buttery-textured leaves' },
  { value: 'loose-leaf', label: 'Loose-leaf', description: 'Easy to harvest, grows in loose heads' },
];

export default function CropInfoModal({
  visible,
  onClose,
  cropOptions = defaultCropOptions,
}: CropInfoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-center items-center px-4">
        <Card className="w-full max-w-sm p-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-semibold">Crop Type Information</Text>
            <Button
              variant="ghost"
              onPress={onClose}
              className="w-8 h-8 rounded-full"
            >
              <Icon as={X} size={16} className="text-muted-foreground" />
            </Button>
          </View>
          
          <View className="gap-4">
            {cropOptions.map((crop) => (
              <View key={crop.value} className="border-b border-muted-foreground/20 pb-3 last:border-b-0">
                <Text className="text-base font-semibold capitalize mb-1">{crop.label}</Text>
                <Text className="text-sm text-muted-foreground">{crop.description}</Text>
              </View>
            ))}
          </View>
        </Card>
      </View>
    </Modal>
  );
}

