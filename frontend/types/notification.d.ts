export type NotificationType = { 
    id: number;
    device_id: number;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    is_read: boolean;
    created_at: string;
    time: string;
};

export type NotificationPayload = {
    device_id: number;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
};


export type NotificationState = {
    notifications: NotificationType[];
    error: string | null;
    loading: boolean;
    fetchNotifications: () => Promise<void>;
    createNotification: (data: NotificationPayload) => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
}