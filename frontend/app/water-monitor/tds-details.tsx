import { View, Modal } from 'react-native'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react-native'
import { Text } from '@/components/ui/text'
import { TDSDetails, TDSRecommendation } from '@/types/tds'

interface TDSDetailsModalProps {
  visible: boolean
  onClose: () => void
  tdsData?: TDSDetails
}

export default function TDSDetailsModal({ visible, onClose, tdsData }: TDSDetailsModalProps) {

  // Mock TDS data 
  const defaultTDSData: TDSDetails = {
    id: 1,
    title: 'Total Dissolved Solids',
    recommendations: [
      {
        ppm: '0 - 49 ',
        status: 'Unsafe',
        description: 'Early growth stage - lower nutrient concentration'
      },
      {
        ppm: '50 - 150',
        status: 'Safe',
        description: 'Active growth phase - moderate nutrient concentration'
      },
      {
        ppm: '150 above',
        status: 'Unsafe',
        description: 'Full maturity - higher nutrient concentration'
      }
    ],
    note: 'TDS level depends on lettuce growth stage. Too low = weak growth, too high = nutrient burn.',
    description: 'Total Dissolved Solids (TDS) measures the concentration of dissolved substances in water, including nutrients essential for plant growth.'
  }

  const data = tdsData || defaultTDSData

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
            <View className="space-y-2">
              {data.recommendations.map((recommendation: TDSRecommendation, index: number) => (
                <Text key={index} className="">
                  • {recommendation.ppm} ppm - ({recommendation.status})
                </Text>
              ))}
            </View>
            
            <View className="space-y-1 mt-6">
              <Text className="text-primary font-bold text-lg">Note:</Text>
              <Text className="italic ">
                In hydroponics, TDS (Total Dissolved Solids) is one of the most important indicators of water quality and nutrient strength. It measures how many dissolved nutrients, minerals, and salts are present in the water — expressed in parts per million (ppm).
              </Text>
            </View>
          </CardContent>
        </Card>
      </View>
    </Modal>
  )
}