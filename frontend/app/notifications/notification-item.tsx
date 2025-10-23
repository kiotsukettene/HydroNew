import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { Leaf, AlertTriangle, Droplet } from 'lucide-react-native'

type NotificationType = 'success' | 'warning' | 'info'

interface NotificationItemProps {
  type: NotificationType
  title: string
  message: string
  time: string
  isRead?: boolean
  onPress?: () => void
}

const iconConfig = {
  success: { Icon: Leaf, bgColor: 'bg-green-100', iconColor: '#16a34a' },
  warning: { Icon: AlertTriangle, bgColor: 'bg-red-100', iconColor: '#dc2626' },
  info: { Icon: Droplet, bgColor: 'bg-blue-100', iconColor: '#2563eb' },
}

export default function NotificationItem({ 
  type, 
  title, 
  message, 
  time, 
  isRead = false,
  onPress 
}: NotificationItemProps) {
  const { Icon, bgColor, iconColor } = iconConfig[type]

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row p-4 border-b border-gray-200 ${!isRead ? 'bg-gray-50' : 'bg-white'}`}
    >
      {/* Icon */}
      <View className={`w-10 h-10 rounded-full ${bgColor} items-center justify-center mr-3`}>
        <Icon size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="text-sm font-semibold text-gray-900">{title}</Text>
          <Text className="text-xs text-gray-500">{time}</Text>
        </View>
        <Text className="text-xs text-gray-600 leading-4">{message}</Text>
      </View>
    </TouchableOpacity>
  )
}