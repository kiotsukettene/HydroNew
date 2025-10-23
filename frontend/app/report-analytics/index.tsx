import { View, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Text } from '@/components/ui/text'
import { PageHeader } from '@/components/ui/page-header'
import { LineChart } from "react-native-gifted-charts";
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default function ReportAnalytics() {
        const data = [
          {value: 6, label: 'Day 1'},
          {value: 7, label: 'Day 2'},
          {value: 6, label: 'Day 3'},
          {value: 7, label: 'Day 4'},
          {value: 6, label: 'Day 5'},
          {value: 7, label: 'Day 6'},
          {value: 6, label: 'Day 7'}
        ];

        const recentData = [
          { id: '1', sensor: 'pH', level: 7.0, source: 'MFC', status: 'Neutral' },
          { id: '2', sensor: 'pH', level: 2.0, source: 'UV Filter', status: 'Acidic' },
          { id: '3', sensor: 'pH', level: 12.0, source: 'Natural F...', status: 'Alkaline' },
          { id: '4', sensor: 'pH', level: 6.5, source: 'Main Tank', status: 'Neutral' },
          { id: '5', sensor: 'pH', level: 3.2, source: 'Filter System', status: 'Acidic' },
        ];

        const getStatusColor = (status: string) => {
          switch (status) {
            case 'Neutral': return 'bg-primary';
            case 'Acidic': return 'bg-secondary';
            case 'Alkaline': return 'bg-red-500';
            default: return 'bg-muted';
          }
        };

        const getLevelColor = (level: number) => {
          if (level >= 6.5 && level <= 7.5) return 'text-primary';
          if (level < 6.5) return 'text-secondary';
          if (level > 7.5) return 'text-red-500';
          return 'text-muted-foreground';
        };

  return (
    <ScrollView className="flex-1">
      <SafeAreaView>
        <PageHeader 
          title="Report & Analytics"
          showBackButton={true}
          showNotificationButton={false}
        />
        <View className="p-4">
          {/* Creative Title Section */}
          <View className="relative mb-6">
            <View className="bg-green-50 rounded-2xl p-4 border-transparent">
        
              
              {/* Main Title */}
              <View className="relative z-10">
                <View className="flex-row items-center">
                  <View className="w-1.5 h-6 bg-primary rounded-full mr-3" />
                  <Text className="text-2xl font-bold text-primary">
                    Report Analytics
                  </Text>
                </View>
              </View>
            </View>
          </View>
            <Card className='border-muted-foreground/30 px-2 py-4 bg-gradient-to-br from-secondary/20 to-white rounded-2xl overflow-hidden mt-6'>
            <View className="flex-row justify-between items-start mb-6">
              <View className="flex-1 px-4 pt-2" >
                <Text className="text-2xl font-bold text-primary">pH Sensor</Text>
                <View className="flex-row items-center">
                  <Text className="text-base text-gray-600">Last 7 days</Text>
                  <Text className="text-base text-gray-400 mx-3">•</Text>
                </View>
              </View>
              <View className="bg-muted-foreground/20  px-5 py-3 rounded-full">
                <Text className="font-bold text-base">6.8 avg</Text>
              </View>
            </View>
            <View className="w-full">
              <LineChart
                areaChart
                data={data}
                startFillColor="hsl(173 58% 39%)"
                startOpacity={0.3}
                endFillColor="hsl(173 58% 39% / 0.1)"
                endOpacity={0.1}
                maxValue={14}
                height={250}
                color="hsl(173 58% 39%)"
                thickness={3}
                curved
                spacing={50}
                initialSpacing={20}
                endSpacing={25}
                hideDataPoints={false}
                xAxisLabelTextStyle={{color: 'hsl(0 0% 45.1%)', fontSize: 13}}
                yAxisTextStyle={{color: 'hsl(0 0% 45.1%)', fontSize: 13}}
                rulesColor="hsl(0 0% 89.8%)"
                rulesType="solid"
                showVerticalLines
                verticalLinesColor="hsl(0 0% 89.8%)"
                yAxisLabelWidth={50}
                yAxisLabelSuffix=""
                hideYAxisText={false}
                xAxisColor="hsl(0 0% 89.8%)"
                yAxisColor="hsl(0 0% 89.8%)"
                width={320}
                adjustToWidth={true}
              />
            </View>
           </Card>

           {/* Recent Data Section */}
           <Card className='border-muted-foreground/30 p-6   shadow-lg mt-6'>
               <Text className="text-2xl font-semibold text-primary ">
                    Recent Data
                  </Text>
            
            {recentData.map((item, index) => (
              <View key={item.id}>
                <View className="flex-row items-center justify-between py-4">
                  <View className="flex-1 flex-row items-center">
                    {/* Main pH Level  */}
                    <View className="mr-4">
                      <Text className={`text-2xl font-bold ${getLevelColor(item.level)}`}>
                        {item.level}
                      </Text>
                      <Text className="text-xs text-gray-500 font-medium">pH Level</Text>
                    </View>
                    
                    {/* Sensor and Source Info */}
                    <View className="flex-1">
                      <Text className="text-sm font-medium text-gray-900 mb-1">
                        Sensor: {item.sensor}
                      </Text>
                      <Text className="text-sm text-gray-600">
                        Source: {item.source}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Status Badge */}
                  <View className="flex-row items-center">
                    <View className={`${getStatusColor(item.status)} px-3 py-1.5 rounded-full mr-2`}>
                      <Text className="text-white text-xs font-semibold">
                        {item.status}
                      </Text>
                    </View>
                    
                    {/* Arrow Icon */}
                    <Text className="text-gray-400 text-lg">›</Text>
                  </View>
                </View>
                
                {/* Divider */}
                {index < recentData.length - 1 && (
                  <View className="h-px bg-gray-100" />
                )}
              </View>
             ))}
            </Card>

            {/* Predictive Plant Growth Card */}
            <Card className=' mt-6 border-muted-foreground/20 rounded-2xl shadow-sm'>
              <View className="p-6">
                 <Text className="text-2xl font-semibold text-primary ">
                    Predictive Plant Growth
                  </Text>
                     <Text className="text-sm text-gray-600 ">
                      Days until harvest
                    </Text>

                    <Separator className="my-4 bg-gray-200" />
                {/* Top Section - Summary */}
                <View className="flex-row items-end justify-between mt-3 mb-6">
                 
                  <View className="flex-1">
                 
                    <View className="flex-row items-baseline">
                      <Text className="text-4xl font-bold text-gray-900">
                        32
                      </Text>
                      <Text className="text-lg text-gray-600 ml-2">
                        days
                      </Text>
                      
                    </View>
                    
                  </View>
                
                </View>

                {/* Bottom Section - Weekly Bar Chart */}
                <View className="w-full">
                  <LineChart
                    data={[
                      {value: 35, label: 'Mon'},
                      {value: 33, label: 'Tue'},
                      {value: 31, label: 'Wed'},
                      {value: 29, label: 'Thu'},
                      {value: 27, label: 'Fri'},
                      {value: 25, label: 'Sat'},
                      {value: 23, label: 'Sun'}
                    ]}
                    color="rgb(34, 197, 94)"
                    thickness={3}
                    spacing={40}
                    initialSpacing={20}
                    endSpacing={20}
                    hideDataPoints={false}
                    xAxisLabelTextStyle={{color: '#9CA3AF', fontSize: 12}}
                    yAxisTextStyle={{color: '#6B7280', fontSize: 12}}
                    rulesColor="#E5E7EB"
                    rulesType="dashed"
                    showVerticalLines
                    verticalLinesColor="#E5E7EB"
                    yAxisLabelWidth={30}
                    yAxisLabelSuffix=""
                    hideYAxisText={false}
                    xAxisColor="#E5E7EB"
                    yAxisColor="#E5E7EB"
                    height={150}
                    maxValue={40}
                    width={280}
                    adjustToWidth={true}
                  />
                </View>
              </View>
            </Card>
           
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}