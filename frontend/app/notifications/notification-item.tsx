import { View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Text } from '@/components/ui/text'
import { 
  Leaf, 
  AlertTriangle, 
  Droplet, 
  Info, 
  CheckCircle, 
  AlertCircle,
  Sprout 
} from 'lucide-react-native'

type NotificationType = 'success' | 'warning' | 'info' | 'sensor_alert' | 'growth_update' | 'harvest_alert'

interface NotificationItemProps {
  type: NotificationType
  title: string
  message: string
  time?: string
  isRead?: boolean
  onPress?: () => void
}

// Helper function to determine the appropriate icon based on title and type
const getNotificationIconConfig = (title: string, type: NotificationType) => {
  const lowerTitle = title.toLowerCase();
  
  // Sensor-related alerts
  if (lowerTitle.includes('ph') || lowerTitle.includes('turbidity') || lowerTitle.includes('tds')) {
    return { Icon: Droplet, bgColor: 'bg-orange-100', iconColor: '#f97316' };
  }
  
  // Growth-related notifications
  if (lowerTitle.includes('harvest') && lowerTitle.includes('ready')) {
    return { Icon: Leaf, bgColor: 'bg-green-100', iconColor: '#16a34a' };
  }
  
  if (lowerTitle.includes('overgrown')) {
    return { Icon: AlertCircle, bgColor: 'bg-red-100', iconColor: '#dc2626' };
  }
  
  if (lowerTitle.includes('growth') || lowerTitle.includes('stage') || lowerTitle.includes('seedling') || lowerTitle.includes('vegetative') || lowerTitle.includes('flowering')) {
    return { Icon: Sprout, bgColor: 'bg-blue-100', iconColor: '#3b82f6' };
  }
  
  // Default based on type
  switch (type) {
    case 'success':
    case 'harvest_alert':
      return { Icon: CheckCircle, bgColor: 'bg-green-100', iconColor: '#16a34a' };
    case 'warning':
    case 'sensor_alert':
      return { Icon: AlertTriangle, bgColor: 'bg-red-100', iconColor: '#dc2626' };
    case 'info':
    case 'growth_update':
      return { Icon: Info, bgColor: 'bg-blue-100', iconColor: '#2563eb' };
    default:
      return { Icon: Info, bgColor: 'bg-gray-100', iconColor: '#6b7280' };
  }
};

export default function NotificationItem({ 
  type, 
  title, 
  message, 
  time, 
  isRead = false,
  onPress 
}: NotificationItemProps) {
  const { Icon, bgColor, iconColor } = getNotificationIconConfig(title, type);
  const containerPadding = !isRead ? 'pl-3 pr-4 py-4' : 'px-4 py-4'
  const containerStyles = !isRead
    ? 'bg-green-50 shadow-sm'
    : 'bg-white shadow-sm'

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row rounded-2xl ${containerPadding} ${containerStyles}`}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View className="relative mr-3">
        {!isRead && (
          <View className="absolute -left-2 -top-1 w-2.5 h-2.5 rounded-full bg-green-600 border-2 border-green-50" />
        )}
        <View className={`w-9 h-9 rounded-full ${bgColor} items-center justify-center border border-gray-200/60`}>
          <Icon size={18} color={iconColor} />
        </View>
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-start justify-between">
          <Text className="font-semibold text-gray-900 flex-1 pr-2" numberOfLines={1}>
            {title}
          </Text>
          {time && (
            <Text className="text-xs text-gray-500">{time}</Text>
          )}
        </View>
        <Text className="text-sm text-gray-600 leading-5 mt-2" numberOfLines={3}>
          {message}
        </Text>
      </View>
    </TouchableOpacity>
  )
}