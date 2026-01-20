export type NotificationType = { 
    id: number;
    user_id: number;
    device_id: number | null;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
    is_read: boolean;
    created_at: string;
    time?: string; // Optional computed field for display
};

export type NotificationPayload = {
    device_id?: number | null;
    title: string;
    message: string;
    type: 'success' | 'warning' | 'info';
};

export type NotificationBroadcastEvent = {
    notification: NotificationType;
};

export type NotificationState = {
    notifications: NotificationType[];
    unreadCount: number;
    error: string | null;
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    total: number;
    offset: number;
    isListening: boolean;
    fetchNotifications: (refresh?: boolean) => Promise<void>;
    fetchMoreNotifications: () => Promise<void>;
    fetchUnreadCount: () => Promise<void>;
    createNotification: (data: NotificationPayload) => Promise<void>;
    markAsRead: (id: number) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    startListening: (userId: number) => void;
    stopListening: (userId: number) => void;
    addNotification: (notification: NotificationType) => void;
}