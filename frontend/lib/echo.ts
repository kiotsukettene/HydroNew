import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

let echoInstance: Echo<any> | null = null;
let connectionPromise: Promise<void> | null = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 10;
const RECONNECT_DELAY = 3000; // 3 seconds

export const initializeEcho = (authToken: string) => {
  if (echoInstance) {
    console.log('✅ Echo already initialized, returning existing instance');
    // Update the auth token in case it changed
    const pusherInstance = (echoInstance as any).connector.pusher;
    if (pusherInstance && pusherInstance.config) {
      pusherInstance.config.auth = {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json',
        },
      };
    }
    return echoInstance;
  }

  console.log('🔧 Initializing Echo with token:', authToken ? 'Token exists' : 'No token');
  console.log('🔑 Pusher Key:', process.env.EXPO_PUBLIC_PUSHER_APP_KEY);
  console.log('🌍 Pusher Cluster:', process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER);
  console.log('🔐 Auth Endpoint:', `${process.env.EXPO_PUBLIC_API_URL}/broadcasting/auth`);

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: process.env.EXPO_PUBLIC_PUSHER_APP_KEY,
    cluster: process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER,
    forceTLS: true,
    encrypted: true,
    authEndpoint: `${process.env.EXPO_PUBLIC_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
      },
    },
    enabledTransports: ['ws', 'wss'],
    Pusher: Pusher,
    // Add this to ensure proper channel naming
    namespace: false, // This tells Echo not to add extra namespacing
    // Reconnection configuration
    enableStats: false,
    activityTimeout: 30000, // 30 seconds
    pongTimeout: 10000, // 10 seconds
  });

  // Create a promise that resolves when connected
  connectionPromise = new Promise((resolve) => {
    const pusherInstance = (echoInstance as any).connector.pusher;
    
    pusherInstance.connection.bind('connected', () => {
      const socketId = pusherInstance.connection.socket_id;
      console.log('🔌 Pusher Connected! Socket ID:', socketId);
      reconnectAttempts = 0; // Reset on successful connection
      resolve();
    });

    pusherInstance.connection.bind('error', (error: any) => {
      console.error('🔌 Pusher Connection Error:', error);
    });
    
    pusherInstance.connection.bind('disconnected', () => {
      console.log('🔌 Pusher Disconnected');
    });

    // Handle connection state changes
    pusherInstance.connection.bind('state_change', (states: any) => {
      console.log('🔌 Pusher State Change:', states.previous, '->', states.current);
    });

    // Handle unavailable state (connection failed)
    pusherInstance.connection.bind('unavailable', () => {
      console.log('🔌 Pusher Connection Unavailable - attempting reconnect');
      handleReconnect(authToken);
    });

    // Handle failed state
    pusherInstance.connection.bind('failed', () => {
      console.error('🔌 Pusher Connection Failed - will attempt reconnect');
      handleReconnect(authToken);
    });
  });

  console.log('Echo instance created successfully');
  return echoInstance;
};

export const getEcho = () => {
  return echoInstance;
};

export const waitForConnection = async () => {
  if (connectionPromise) {
    await connectionPromise;
  }
};

const handleReconnect = (authToken: string) => {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('🔌 Max reconnection attempts reached. Giving up.');
    return;
  }

  reconnectAttempts++;
  console.log(`🔌 Reconnection attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);

  setTimeout(() => {
    if (echoInstance) {
      console.log('🔌 Attempting to reconnect...');
      const pusherInstance = (echoInstance as any).connector.pusher;
      
      // Try to reconnect
      if (pusherInstance.connection.state === 'disconnected' || 
          pusherInstance.connection.state === 'failed' ||
          pusherInstance.connection.state === 'unavailable') {
        pusherInstance.connect();
      }
    }
  }, RECONNECT_DELAY * reconnectAttempts); // Exponential backoff
};

export const manualReconnect = () => {
  if (echoInstance) {
    console.log('🔌 Manual reconnection triggered');
    const pusherInstance = (echoInstance as any).connector.pusher;
    reconnectAttempts = 0;
    pusherInstance.connect();
  }
};

export const getConnectionState = () => {
  if (echoInstance) {
    const pusherInstance = (echoInstance as any).connector.pusher;
    return pusherInstance.connection.state;
  }
  return null;
};

export const disconnectEcho = () => {
  if (echoInstance) {
    console.log('🔌 Disconnecting Echo');
    try {
      const pusherInstance = (echoInstance as any).connector.pusher;
      if (pusherInstance) {
        // Unbind all event listeners
        pusherInstance.connection.unbind_all();
        // Disconnect
        pusherInstance.disconnect();
      }
      echoInstance.disconnect();
    } catch (error) {
      console.error('❌ Error disconnecting Echo:', error);
    }
    echoInstance = null;
    connectionPromise = null;
    reconnectAttempts = 0;
    console.log('✅ Echo disconnected and cleaned up');
  } else {
    console.log('⚠️ No Echo instance to disconnect');
  }
};