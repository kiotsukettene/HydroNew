import { View } from 'react-native';
import React from 'react';
import { Text } from '@/components/ui/text';
import { Bell } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useNotificationStore } from '@/store/notification/notificationStore';

interface NotificationBadgeProps {
  size?: number;
  iconColor?: string;
  badgeColor?: string;
  onPress?: () => void;
}

/**
 * Notification Bell Icon with Unread Count Badge
 * 
 * @example
 * ```tsx
 * import { NotificationBadge } from '@/components/ui/notification-badge';
 * 
 * // In your header or navigation
 * <NotificationBadge />
 * ```
 */
export function NotificationBadge({ 
  size = 24, 
  iconColor = '#1f2937',
  badgeColor = '#ef4444',
  onPress
}: NotificationBadgeProps) {
  const unreadCount = useNotificationStore(state => state.unreadCount);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/notifications');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} className="relative" activeOpacity={0.7}>
      <Bell size={size} color={iconColor} />
      
      {unreadCount > 0 && (
        <View 
          className="absolute -top-1 -right-1 rounded-full min-w-[18px] h-[18px] items-center justify-center px-1"
          style={{ backgroundColor: badgeColor }}
        >
          <Text className="text-white text-xs font-bold">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

/**
 * Simple Unread Count Text (for use in lists, cards, etc.)
 * 
 * @example
 * ```tsx
 * import { UnreadCountText } from '@/components/ui/notification-badge';
 * 
 * <UnreadCountText />
 * // Shows: "3 new notifications"
 * ```
 */
export function UnreadCountText({ className = '' }: { className?: string }) {
  const unreadCount = useNotificationStore(state => state.unreadCount);

  if (unreadCount === 0) return null;

  return (
    <Text className={`text-sm font-medium text-red-600 ${className}`}>
      {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
    </Text>
  );
}

/**
 * Minimal Unread Dot Indicator
 * 
 * @example
 * ```tsx
 * import { UnreadDot } from '@/components/ui/notification-badge';
 * 
 * <View className="relative">
 *   <Icon />
 *   <UnreadDot />
 * </View>
 * ```
 */
export function UnreadDot({ size = 8, color = '#ef4444' }: { size?: number; color?: string }) {
  const unreadCount = useNotificationStore(state => state.unreadCount);

  if (unreadCount === 0) return null;

  return (
    <View 
      className="absolute top-0 right-0 rounded-full"
      style={{ 
        width: size, 
        height: size, 
        backgroundColor: color 
      }}
    />
  );
}
