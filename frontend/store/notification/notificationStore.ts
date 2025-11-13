import {create} from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import {handleAxiosError} from '@/api/handleAxiosError';
import { NotificationState } from '@/types/notification';

export const useNotificationStore = create<NotificationState>((set) => ({
    notifications: [],
    error: null,
    loading: false,

    fetchNotifications: async () => {
        set({loading: true, error: null}); 
        try {
            const response = await axiosInstance.get('/notifications');
            set
                (
                    {
                        notifications: response.data.data, 
                        loading: false
                    }
                );

        } catch (error: any) {
            const err = handleAxiosError(error);
            set(
                    {
                        loading: false,
                        error: err.message,
                    }
                );
        }

    },

}))