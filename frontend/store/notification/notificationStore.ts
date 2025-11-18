import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { handleAxiosError } from '@/api/handleAxiosError';
import { NotificationState, NotificationPayload } from '@/types/notification';
import { getEcho, waitForConnection } from '@/lib/echo';

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    error: null,
    loading: false,
    isListening: false,

    fetchNotifications: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axiosInstance.get('/notifications');
            set({
                notifications: response.data.data,
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
            await axiosInstance.put(`/notifications/${id}/mark-as-read`);
            set((state) => ({
                notifications: state.notifications.map((n) =>
                    n.id === id ? { ...n, is_read: true } : n
                ),
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
        .listen('.notification.created', (event: any) => {
            console.log('🔔 NEW NOTIFICATION EVENT RECEIVED!');
            console.log('Event data:', JSON.stringify(event, null, 2));
            
            // Fetch fresh notifications from API
            console.log('Calling fetchNotifications...');
            get().fetchNotifications();
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

    addNotification: (notification: any) => {
        set((state) => ({
            notifications: [notification, ...state.notifications],
        }));
    },
}));
