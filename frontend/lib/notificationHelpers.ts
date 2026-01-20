import { NotificationType } from '@/types/notification';
import { formatDistanceToNow } from './dateUtils';

/**
 * Format notification time for display
 */
export const formatNotificationTime = (createdAt: string): string => {
  try {
    const date = new Date(createdAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) { // Less than 24 hours
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days}d ago`;
      if (days < 30) {
        const weeks = Math.floor(days / 7);
        return `${weeks}w ago`;
      }
      const months = Math.floor(days / 30);
      return `${months}mo ago`;
    }
  } catch (error) {
    console.error('Error formatting notification time:', error);
    return '';
  }
};

/**
 * Process notification for display
 */
export const processNotification = (notification: NotificationType): NotificationType => {
  return {
    ...notification,
    // Use backend-provided time if available, otherwise compute it
    time: notification.time || formatNotificationTime(notification.created_at),
  };
};

/**
 * Group notifications by date
 */
export const groupNotificationsByDate = (notifications: NotificationType[]): Record<string, NotificationType[]> => {
  const groups: Record<string, NotificationType[]> = {
    Today: [],
    Yesterday: [],
    'This Week': [],
    Earlier: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notification) => {
    const notifDate = new Date(notification.created_at);
    const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

    if (notifDay.getTime() === today.getTime()) {
      groups.Today.push(notification);
    } else if (notifDay.getTime() === yesterday.getTime()) {
      groups.Yesterday.push(notification);
    } else if (notifDate >= weekAgo) {
      groups['This Week'].push(notification);
    } else {
      groups.Earlier.push(notification);
    }
  });

  // Remove empty groups
  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
};

/**
 * Get notification icon name based on type and title
 */
export const getNotificationIcon = (notification: NotificationType): string => {
  const title = notification.title.toLowerCase();
  
  // Sensor-related alerts
  if (title.includes('ph')) return 'droplet';
  if (title.includes('tds') || title.includes('turbidity')) return 'alert-triangle';
  
  // Growth-related notifications
  if (title.includes('harvest') || title.includes('ready')) return 'leaf';
  if (title.includes('growth') || title.includes('stage')) return 'sprout';
  if (title.includes('overgrown')) return 'alert-circle';
  
  // Default based on type
  switch (notification.type) {
    case 'success':
      return 'check-circle';
    case 'warning':
      return 'alert-triangle';
    case 'info':
      return 'info';
    default:
      return 'bell';
  }
};

/**
 * Determine if notification should show a toast
 */
export const shouldShowToast = (notification: NotificationType): boolean => {
  // Show toast for warning notifications (sensor alerts, overgrown plants)
  if (notification.type === 'warning') return true;
  
  // Show toast for sensor alerts (backend uses 'sensor_alert' type)
  if (notification.type === 'sensor_alert') return true;
  
  // Show toast for harvest alerts
  if (notification.type === 'harvest_alert') return true;
  
  // Show toast for harvest-ready notifications
  if (notification.title.toLowerCase().includes('ready to harvest')) return true;
  
  // Show toast for overgrown warnings
  if (notification.title.toLowerCase().includes('overgrown')) return true;
  
  return false;
};

/**
 * Get toast duration based on notification priority
 */
export const getToastDuration = (notification: NotificationType): number => {
  if (notification.type === 'warning') return 5000; // 5 seconds for warnings
  if (notification.type === 'sensor_alert') return 5000; // 5 seconds for sensor alerts
  if (notification.type === 'harvest_alert') return 4000; // 4 seconds for harvest alerts
  if (notification.type === 'success') return 3000; // 3 seconds for success
  return 4000; // 4 seconds default
};

