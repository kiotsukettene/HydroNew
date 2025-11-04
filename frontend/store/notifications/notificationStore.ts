import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Notification {
  id: number;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loadNotifications: () => Promise<void>;
  saveNotifications: (notifications: Notification[]) => Promise<void>;
  markAsRead: (id: number) => void;
  clearAll: () => void;
  restoreDefault: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

const STORAGE_KEY = '@notifications_data';

const defaultNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Plant ready for harvest!',
    message: 'Your lettuce plant has reached the optimal growth stage and is ready for harvest.',
    time: 'Nov 12 8:00pm',
    isRead: false,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Filter cleaning!',
    message: 'Filter requires cleaning in the next 3 days. Clean immediately to maintain water quality.',
    time: 'Nov 12 8:00pm',
    isRead: false,
  },
  {
    id: 3,
    type: 'info',
    title: 'Water is potable',
    message: 'Your recent water test has met the appropriate potability safe for hydroponics.',
    time: 'Nov 12 8:00pm',
    isRead: false,
  },
  {
    id: 4,
    type: 'warning',
    title: 'Filter cleaning!',
    message: 'Filter requires cleaning in the next 3 days. Clean immediately to maintain water quality.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
  {
    id: 5,
    type: 'info',
    title: 'Water is potable',
    message: 'Your recent water test has met the appropriate potability safe for hydroponics.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
  {
    id: 6,
    type: 'warning',
    title: 'Filter cleaning!',
    message: 'Filter requires cleaning in the next 3 days. Clean immediately to maintain water quality.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
  {
    id: 7,
    type: 'info',
    title: 'Water is potable',
    message: 'Your recent water test has met the appropriate potability safe for hydroponics.',
    time: 'Nov 12 8:00pm',
    isRead: true,
  },
];

const calculateUnreadCount = (notifications: Notification[]) => {
  return notifications.filter(n => !n.isRead).length;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: defaultNotifications,
  unreadCount: calculateUnreadCount(defaultNotifications),

  loadNotifications: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored !== null) {
        const notifications = JSON.parse(stored);
        set({ 
          notifications,
          unreadCount: calculateUnreadCount(notifications)
        });
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  },

  saveNotifications: async (notifications: Notification[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
      set({ 
        notifications,
        unreadCount: calculateUnreadCount(notifications)
      });
    } catch (error) {
      console.error('Error saving notifications:', error);
    }
  },

  setNotifications: (notifications: Notification[]) => {
    set({ 
      notifications,
      unreadCount: calculateUnreadCount(notifications)
    });
    get().saveNotifications(notifications);
  },

  markAsRead: (id: number) => {
    const { notifications } = get();
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    get().setNotifications(updatedNotifications);
  },

  clearAll: () => {
    get().setNotifications([]);
  },

  restoreDefault: () => {
    get().setNotifications(defaultNotifications);
  },
}));
