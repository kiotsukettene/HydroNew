import { View, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'

export default function Notifications() {
  return (
    <ScrollView>
      <SafeAreaView>
        <View className='p-4 bg-blue-300'>
          {/* ===== Page Header ===== */}
          <PageHeader 
            title="Notifications"
            showBackButton={true}
            showNotificationButton={false}
          />
          
          {/* ===== Notifications Content ===== */}
          <View className="mt-8">
            {/* Add your notifications content here */}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  )
}