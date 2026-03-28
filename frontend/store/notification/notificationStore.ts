import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { handleAxiosError } from '@/api/handleAxiosError';
import { NotificationState, NotificationPayload, NotificationType, NotificationBroadcastEvent } from '@/types/notification';
import { getEcho, waitForConnection } from '@/lib/echo';
import { processNotification, shouldShowToast, getToastDuration } from '@/lib/notificationHelpers';
import { toast } from 'sonner-native';

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    error: null,
    loading: false,
    loadingMore: false,
    hasMore: true,
    total: 0,
    offset: 0,
    isListening: false,

    fetchNotifications: async (refresh = false) => {
        // If refreshing, reset to first page
        if (refresh) {
            set({ offset: 0, hasMore: true });
        }
        
        set({ loading: true, error: null });
        try {
            const LIMIT = 20; // Load 20 notifications at a time
            
            const response = await axiosInstance.get('/notifications', {
                params: {
                    limit: LIMIT,
                    offset: 0, // Always start from beginning on fetch
                }
            });
            
            const rawNotifications = response.data.data;
            const hasMore = response.data.has_more;
            const total = response.data.total;
            
            // Process notifications to add computed fields
            const notifications = rawNotifications.map((n: NotificationType) => processNotification(n));
            const unreadCount = notifications.filter((n: NotificationType) => !n.is_read).length;
            
            set({
                notifications,
                unreadCount,
                hasMore,
                total,
                offset: LIMIT,
                loading: false,
            });
        } catch (error: any) {
            const err = handleAxiosError(error);
            set({
                loading: false,
                error: err.message,
            });
        }
    },

    fetchMoreNotifications: async () => {
        const state = get();
        
        // Don't fetch if already loading or no more items
        if (state.loadingMore || !state.hasMore || state.loading) {
            return;
        }
        
        set({ loadingMore: true, error: null });
        try {
            const LIMIT = 20;
            const currentOffset = state.offset;
            
            const response = await axiosInstance.get('/notifications', {
                params: {
                    limit: LIMIT,
                    offset: currentOffset,
                }
            });
            
            const rawNotifications = response.data.data;
            const hasMore = response.data.has_more;
            
            // Process new notifications
            const newNotifications = rawNotifications.map((n: NotificationType) => processNotification(n));
            
            // Append to existing notifications (avoid duplicates)
            const existingIds = new Set(state.notifications.map((n: NotificationType) => n.id));
            const uniqueNewNotifications = newNotifications.filter((n: NotificationType) => !existingIds.has(n.id));
            
            const allNotifications = [...state.notifications, ...uniqueNewNotifications];
            const unreadCount = allNotifications.filter((n: NotificationType) => !n.is_read).length;
            
            set({
                notifications: allNotifications,
                unreadCount,
                hasMore,
                offset: currentOffset + LIMIT,
                loadingMore: false,
            });
        } catch (error: any) {
            const err = handleAxiosError(error);
            set({
                loadingMore: false,
                error: err.message,
            });
        }
    },

    fetchUnreadCount: async () => {
        try {
            const response = await axiosInstance.get('/notifications/unread-count');
            set({ unreadCount: response.data.unread_count });
        } catch (error: any) {
            const err = handleAxiosError(error);
            console.error('Error fetching unread count:', err.message);
        }
    },

    createNotification: async (data: NotificationPayload) => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.post('/create-notifications', data);
            set((state) => ({
                notifications: [response.data.data, ...state.notifications],
                loading: false,
            }));
        } catch (error: any) {
            const err = handleAxiosError(error);
            set({
                loading: false,
                error: err.message,
            });
        }
    },

    markAsRead: async (id: number) => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.patch(`/notifications/${id}/mark-as-read`);
            set((state) => {
                const updatedNotifications = state.notifications.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                );
                const unreadCount = updatedNotifications.filter((n) => !n.is_read).length;
                return {
                    notifications: updatedNotifications,
                    unreadCount,
                    loading: false,
                };
            });
        } catch (error: any) {
            const err = handleAxiosError(error);
            set({
                loading: false,
                error: err.message,
            });
        }
    },

    markAllAsRead: async () => {
        set({ loading: true, error: null });
        try {
            await axiosInstance.post('/notifications/mark-all-read');
            set((state) => ({
                notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
                unreadCount: 0,
                loading: false,
            }));
        } catch (error: any) {
            const err = handleAxiosError(error);
            set({
                loading: false,
                error: err.message,
            });
        }
    },

    startListening: async (userId: number) => {
    console.log('=== startListening called ===');
    console.log('userId:', userId);
    
    const echo = getEcho();
    console.log('Echo instance:', echo ? 'exists' : 'null');
    
    const isAlreadyListening = get().isListening;
    console.log('Already listening:', isAlreadyListening);
    
    if (!echo || isAlreadyListening) {
        console.log('Exiting startListening - echo null or already listening');
        return;
    }

    // Wait for connection to be established
    console.log('Waiting for WebSocket connection...');
    await waitForConnection();
    console.log('WebSocket connected!');

    const socketId = (echo as any).socketId();
    console.log('📡 Socket ID:', socketId);

    // DON'T add 'private-' prefix - Echo does this automatically
    const channelName = `user.${userId}`;
    console.log('Subscribing to private channel:', channelName);
    console.log('Full channel name will be: private-' + channelName);

    const channel = echo.private(channelName);
    console.log('Channel object created:', !!channel);

    channel
        .listen('.notification.created', (event: NotificationBroadcastEvent) => {
            console.log('🔔 NEW NOTIFICATION EVENT RECEIVED!');
            console.log('Event data:', JSON.stringify(event, null, 2));
            
            // Add the new notification to state immediately
            const notification = processNotification(event.notification);
            get().addNotification(notification);
            
            // Show toast for important notifications
            console.log('Checking if should show toast for notification:', notification);
            const shouldShow = shouldShowToast(notification);
            console.log('shouldShowToast returned:', shouldShow);
            
            if (shouldShow) {
                const duration = getToastDuration(notification);
                console.log('Showing toast with duration:', duration);
                
                // Map notification types to toast styles
                if (notification.type === 'warning') {
                    console.log('Calling toast.warning...');
                    toast.warning(notification.title, {
                        id: 'notification-toast',
                        description: notification.message,
                        duration,
                    });
                } else if (notification.type === 'success') {
                    console.log('Calling toast.success...');
                    toast.success(notification.title, {
                        id: 'notification-toast',
                        description: notification.message,
                        duration,
                    });
                } else if (notification.type === 'info') {
                    console.log('Calling toast.info...');
                    toast.info(notification.title, {
                        id: 'notification-toast',
                        description: notification.message,
                        duration,
                    });
                } else {
                    // Fallback for 'info' or any other type
                    console.log('Calling toast.info (fallback)...');
                    toast.info(notification.title, {
                        id: 'notification-toast',
                        description: notification.message,
                        duration,
                    });
                }
                console.log('Toast method called');
            } else {
                console.log('Skipping toast - shouldShowToast returned false');
            }
            
            console.log('Notification added to state and toast shown if applicable');
        })
        .error((error: any) => {
            console.error('❌ Echo channel error:', error);
        });

    // Listen for subscription success
    channel.subscribed(() => {
        console.log('✅ Successfully subscribed to channel:', channelName);
        console.log('✅ Socket ID at subscription:', socketId);
    });

    set({ isListening: true });
    console.log('=== startListening completed ===');
},
    stopListening: (userId: number) => {
        console.log('stopListening called for userId:', userId);
        const echo = getEcho();
        if (!echo || !get().isListening) {
            console.log('Cannot stop listening - no echo or not listening');
            return;
        }

        const channelName = `user.${userId}`;
        console.log('Leaving channel:', channelName);
        echo.leave(channelName);
        set({ isListening: false });
    },

    addNotification: (notification: NotificationType) => {
        console.log('Adding notification to state:', notification);
        set((state) => {
            // Check if notification already exists to avoid duplicates
            const exists = state.notifications.some(n => n.id === notification.id);
            if (exists) {
                console.log('Notification already exists, skipping');
                return state;
            }
            
            return {
                notifications: [notification, ...state.notifications],
                unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1,
            };
        });
    },
}));
