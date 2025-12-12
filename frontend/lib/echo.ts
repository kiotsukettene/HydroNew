import Echo from 'laravel-echo';
import Pusher from 'pusher-js/react-native';

let echoInstance: Echo | null = null;
let connectionPromise: Promise<void> | null = null;

export const initializeEcho = (authToken: string) => {
  if (echoInstance) {
    console.log('Echo already initialized, returning existing instance');
    return echoInstance;
  }

  console.log('Initializing Echo with token:', authToken ? 'Token exists' : 'No token');
  console.log('Pusher Key:', process.env.EXPO_PUBLIC_PUSHER_APP_KEY);
  console.log('Pusher Cluster:', process.env.EXPO_PUBLIC_PUSHER_APP_CLUSTER);
  console.log('Auth Endpoint:', `${process.env.EXPO_PUBLIC_API_URL}/broadcasting/auth`);

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
  });

  // Create a promise that resolves when connected
  connectionPromise = new Promise((resolve) => {
    const pusherInstance = (echoInstance as any).connector.pusher;
    
    pusherInstance.connection.bind('connected', () => {
      const socketId = pusherInstance.connection.socket_id;
      console.log('🔌 Pusher Connected! Socket ID:', socketId);
      resolve();
    });

    pusherInstance.connection.bind('disconnected', () => {
      console.log('🔌 Pusher Disconnected');
    });

    pusherInstance.connection.bind('error', (error: any) => {
      console.error('🔌 Pusher Connection Error:', error);
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

export const disconnectEcho = () => {
  if (echoInstance) {
    console.log('Disconnecting Echo');
    echoInstance.disconnect();
    echoInstance = null;
    connectionPromise = null;
  }
};