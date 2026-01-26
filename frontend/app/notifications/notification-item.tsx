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

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-row p-4 rounded-xl border-b border-gray-200 ${!isRead ? 'bg-green-50' : 'bg-background'}`}
      activeOpacity={0.7}
    >
      {/* Icon */}
      <View className={`w-10 h-10 rounded-full ${bgColor} items-center justify-center mr-3`}>
        <Icon size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View className="flex-1 gap-2">
        <View className="flex-row items-center justify-between mb-1">
          <Text className="font-semibold text-gray-900 flex-1 pr-2" numberOfLines={1}>
            {title}
          </Text>
          {time && (
            <Text className="text-xs text-gray-500">{time}</Text>
          )}
        </View>
        <Text className="text-sm text-gray-600 leading-5" numberOfLines={3}>
          {message}
        </Text>
        
        {/* Unread indicator */}
        {!isRead && (
          <View className="absolute right-0 top-0 w-2 h-2 rounded-full bg-primary" />
        )}
      </View>
    </TouchableOpacity>
  )
}