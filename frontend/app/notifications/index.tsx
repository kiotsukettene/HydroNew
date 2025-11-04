import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { BellOff } from 'lucide-react-native'
import NotificationItem from './notification-item'
import { useNotificationStore } from '@/store/notifications/notificationStore'

export default function Notifications() {
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const loadNotifications = useNotificationStore((s) => s.loadNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const clearAll = useNotificationStore((s) => s.clearAll)
  const restoreDefault = useNotificationStore((s) => s.restoreDefault)

  // Load notifications from storage on mount
  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  const handleClearAll = () => {
    clearAll()
  }

  const handleRestoreNotifications = () => {
    restoreDefault()
  }

  const handleNotificationPress = (id: number) => {
    markAsRead(id)
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <SafeAreaView className="">
        {/* ===== Page Header ===== */}
        <PageHeader 
          title="Notifications"
          showBackButton={true}
          showNotificationButton={false}
        />
        
      <View className='p-4'>
          {/* ===== Clear All Button ===== */}
        {notifications.length > 0 && (
          <View className="flex-row justify-between mb-2">
            <Text className='font-semibold'>
              All {unreadCount > 0 && `(${unreadCount} unread)`}
            </Text>
            <TouchableOpacity onPress={handleClearAll}>
              <Text className="text-primary">Clear all</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ===== Notifications List ===== */}
        {notifications.length === 0 ? (
          // Empty State
          <View className="items-center justify-center pt-32">
            <View className="w-32 h-32 rounded-full bg-green-50 items-center justify-center mb-6">
              <BellOff size={48} color="hsl(70, 91%, 17%)" strokeWidth={1.5} />
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              No Notifications Here
            </Text>
            <Text className=" text-gray-500 text-center px-8 mb-4">
              There is no notification to show right now
            </Text>
            <TouchableOpacity 
              onPress={handleRestoreNotifications}
              className="mt-4 px-6 py-2 bg-primary rounded-full"
            >
              <Text className="text-white font-medium">Restore Notifications</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Notifications List
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                time={notification.time}
                isRead={notification.isRead}
                onPress={() => handleNotificationPress(notification.id)}
              />
            ))}
            
            {/* Bottom Spacing */}
            <View className="h-20" />
          </>
        )}
      </View>
      </SafeAreaView>
    </ScrollView>
  )
}