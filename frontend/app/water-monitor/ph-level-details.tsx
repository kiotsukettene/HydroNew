import { View, Modal } from 'react-native'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, CheckCircle, AlertTriangle } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { PHLevelDetails, PHCondition } from '@/types/ph-level'

interface PHLevelDetailsModalProps {
  visible: boolean
  onClose: () => void
  phData?: PHLevelDetails
}

export default function PHLevelDetailsModal({ visible, onClose, phData }: PHLevelDetailsModalProps) {
  // Mock pH data 
  const defaultPHData: PHLevelDetails = {
    id: 1,
    title: 'Water pH Level - Details',
    description: 'The pH level measures how acidic or alkaline the water is. For hydroponic lettuce, the ideal pH range is 5.5 to 6.5.',
    idealRange: '5.5 to 6.5',
    conditions: [
      {
        type: 'ideal',
        icon: 'check',
        description: 'If the pH is within range → Lettuce can absorb nutrients properly and grow healthy.'
      },
      {
        type: 'low',
        icon: 'warning',
        description: 'If the pH is too low (acidic) → Roots may get damaged and nutrients become harder to absorb.'
      },
      {
        type: 'high',
        icon: 'warning',
        description: 'If the pH is too high (alkaline) → Growth slows down and lettuce may show yellow leaves.'
      }
    ],
    note: 'Keeping pH balanced ensures your lettuce grows crisp, green, and nutrient-rich.'
  }

  const data = phData || defaultPHData

  const renderIcon = (condition: PHCondition) => {
    if (condition.type === 'ideal') {
      return <CheckCircle size={20} color="#10b981" />
    } else {
      return <AlertTriangle size={20} color="#f59e0b" />
    }
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-foreground/50 justify-center items-center px-4 ">
        <Card className="w-full max-w-sm ">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-secondary font-bold text-xl">
              {data.title}
            </CardTitle>
            <Button
              variant="ghost"
              onPress={onClose}
            >
              <X size={16} className='text-muted-foreground' />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4 mb-2">
            <Text className="text-base text-muted-foreground">
              {data.description}
            </Text>
            
            <View className="space-y-3 mt-4 gap-3">
              {data.conditions.map((condition: PHCondition, index: number) => (
                <View key={index} className="flex-row items-start space-x-3 gap-3">
                  <View className="mt-0.5">
                    {renderIcon(condition)}
                  </View>
                  <Text className="flex-1 ">
                    {condition.description}
                  </Text>
                </View>
              ))}
            </View>
            
            <Text className="italic  mt-4">
              {data.note}
            </Text>
          </CardContent>
        </Card>
      </View>
    </Modal>
  )
}