import { View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PageHeader } from '@/components/ui/page-header'
import { Text } from '@/components/ui/text'
import { BellOff } from 'lucide-react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import NotificationItem from './notification-item'

const notificationsData = [
  {
    id: 1,
    type: 'success' as const,
    title: 'Plant ready for harvest!',
    message: 'Your lettuce plant has reached the optimal growth stage and is ready for harvest.',
    time: 'Nov 12 8:00pm',
    isRead: false,
  },
  {
    id: 2,
    type: 'warning' as const,
    title: 'Filter cleaning!',
    message: 'Filter requires cleaning in the next 3 days. Clean immediately to maintain water quality.',
    time: 'Nov 12 8:00pm',
    isRead: false,
  },
  {
    id: 3,
    type: 'info' as const,
    title: 'Water is potable',
    message: 'Your recent water test has met the appropriate potability safe for hydroponics.',
    time: 'Nov 12 8:00pm',
    isRead: false,
  },
  {
    id: 4,
    type: 'warning' as const,
    title: 'Filter cleaning!',
    message: 'Filter requires cleaning in the next 3 days. Clean immediately to maintain water quality.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
  {
    id: 5,
    type: 'info' as const,
    title: 'Water is potable',
    message: 'Your recent water test has met the appropriate potability safe for hydroponics.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
  {
    id: 6,
    type: 'warning' as const,
    title: 'Filter cleaning!',
    message: 'Filter requires cleaning in the next 3 days. Clean immediately to maintain water quality.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
  {
    id: 7,
    type: 'info' as const,
    title: 'Water is potable',
    message: 'Your recent water test has met the appropriate potability safe for hydroponics.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
]

const STORAGE_KEY = '@notifications_data'

export default function Notifications() {
  const [notifications, setNotifications] = useState(notificationsData)

  // Load notifications from storage on mount
  useEffect(() => {
    loadNotifications()
  }, [])

  // Save notifications to storage whenever they change
  useEffect(() => {
    saveNotifications()
  }, [notifications])

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setNotifications(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading notifications:', error)
    }
  }

  const saveNotifications = async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
    } catch (error) {
      console.error('Error saving notifications:', error)
    }
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  const handleRestoreNotifications = () => {
    setNotifications(notificationsData)
  }

  const handleNotificationPress = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
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
          <View className="flex-row justify-end mb-2">
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