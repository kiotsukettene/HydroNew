import { View, Modal } from 'react-native'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react-native'
import { Text } from '@/components/ui/text'

interface TurbidityRecommendation {
  ntu: string
  status: string
}

interface TurbidityDetails {
  id: number
  title: string
  recommendations: TurbidityRecommendation[]
  note: string
}

interface TurbidityDetailsModalProps {
  visible: boolean
  onClose: () => void
  turbidityData?: TurbidityDetails
}

export default function TurbidityDetailsModal({ visible, onClose, turbidityData }: TurbidityDetailsModalProps) {

  // Mock Turbidity data 
  const defaultTurbidityData: TurbidityDetails = {
    id: 1,
    title: 'Turbidity Levels',
    recommendations: [
      {
        ntu: '0 - 5',
        status: 'Safe',
      },
      {
        ntu: '6 Above',
        status: 'Unsafe',
      },
    ],
    note: 'In hydroponics, turbidity measures how clear or cloudy the nutrient water is. It indicates the presence of suspended particles, such as algae, dirt, or root debris, that can affect water quality. High turbidity can reduce oxygen levels and block nutrients, leading to poor root health and slower plant growth.',
  }

  const data = turbidityData || defaultTurbidityData

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-foreground/50 justify-center items-center px-4">
        <Card className="w-full max-w-sm ">
          <CardHeader className="flex-row items-center justify-between ">
            <CardTitle className="text-secondary font-bold text-xl">
              {data.title}
            </CardTitle>
            <Button
            size={'sm'}
              onPress={onClose}
              className="bg-muted-foreground/50 rounded-full"
            >
              <X size={16} className="text-foreground" />
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-2">
         
            <View className="">
              {data.recommendations.map((recommendation: TurbidityRecommendation, index: number) => (
                <Text key={index} className="">
                  • {recommendation.ntu} NTU - ({recommendation.status})
                </Text>
              ))}
            </View>
            
            <View className="space-y-1 mt-6">
              <Text className="text-primary font-bold text-lg">Note:</Text>
              <Text className="italic ">
                {data.note}
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </Modal>
  )
}