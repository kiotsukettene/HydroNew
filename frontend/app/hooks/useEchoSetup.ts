import { useEffect } from 'react';
import { initializeEcho, disconnectEcho } from '@/lib/echo';
import { useNotificationStore } from '@/store/notification/notificationStore';
import { useAuthStore } from '@/store/auth/authStore';

export const useEchoSetup = (userId?: number) => {
  const { startListening, stopListening } = useNotificationStore();

  useEffect(() => {
    console.log('useEchoSetup effect running, userId:', userId);
    
    const setupEcho = async () => {
      try {
        if (!userId) {
          console.log('No userId provided, skipping Echo setup');
          return;
        }

        // Get auth token directly from auth store instead of AsyncStorage
        const token = useAuthStore.getState().token;
        console.log('Token retrieved from auth store:', token ? 'Token exists' : 'No token found');
        
        if (token && userId) {
          console.log('Initializing Echo for user:', userId);
          
          // Initialize Echo
          initializeEcho(token);
          
          console.log('Starting to listen for notifications...');
          // Start listening to notifications
          startListening(userId);
        } else {
          console.log('Missing token or userId, cannot setup Echo');
        }
      } catch (error) {
        console.error('Error setting up Echo:', error);
      }
    };

    setupEcho();

    // Cleanup on unmount
    return () => {
      console.log('useEchoSetup cleanup running');
      if (userId) {
        stopListening(userId);
      }
      disconnectEcho();
    };
  }, [userId, startListening, stopListening]);
};