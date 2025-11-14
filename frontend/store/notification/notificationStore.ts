import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { handleAxiosError } from '@/api/handleAxiosError';
import { NotificationState, NotificationPayload } from '@/types/notification';

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    error: null,
    loading: false,

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
}));
