import { useEffect } from 'react';
import { initializeEcho, disconnectEcho } from '@/lib/echo';
import { useNotificationStore } from '@/store/notification/notificationStore';
import { useAuthStore } from '@/store/auth/authStore';
import { useSensorData } from './useSensorData';

/**
 * Combined hook that sets up Echo for both notifications and sensor data
 * This is the main hook to use in your root layout
 * 
 * @param userId - The user ID for notifications
 */
export const useEchoSetup = (userId?: number) => {
  const { startListening, stopListening, fetchNotifications } = useNotificationStore();
  
  // Initialize Echo connection
  useEffect(() => {
    console.log('useEchoSetup effect running, userId:', userId);
    
    const setupEcho = async () => {
      try {
        if (!userId) {
          console.log('⚠️ No userId provided, skipping Echo setup (user may need verification)');
          return;
        }

        // Get auth token directly from auth store
        const token = useAuthStore.getState().token;
        console.log('Token retrieved from auth store:', token ? 'Token exists' : 'No token found');
        
        if (!token) {
          console.log('⚠️ No token available, skipping Echo setup');
          return;
        }
        
        if (token && userId) {
          console.log('✅ Initializing Echo for user:', userId);
          
          // Initialize Echo (only once)
          initializeEcho(token);
          
          // Fetch notifications to get the unread count
          console.log('📥 Fetching notifications...');
          await fetchNotifications();
          
          console.log('👂 Starting to listen for notifications...');
          // Start listening to notifications
          startListening(userId);
        }
      } catch (error) {
        console.error('❌ Error setting up Echo:', error);
      }
    };

    setupEcho();

    // Cleanup on unmount or when userId changes
    return () => {
      console.log('🧹 useEchoSetup cleanup running');
      if (userId) {
        stopListening(userId);
      }
      disconnectEcho();
    };
  }, [userId, startListening, stopListening, fetchNotifications]);

  // Setup sensor data listeners (this will reuse the same Echo connection)
  // Device ID is now automatically loaded from AsyncStorage
  const sensorData = useSensorData();

  return sensorData;
};