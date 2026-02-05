import { useEffect, useRef, useState } from 'react';
import { getEcho, waitForConnection } from '@/lib/echo';
import { useSensorStore } from '@/store/sensor/sensorStore';
import { useAuthStore } from '@/store/auth/authStore';
import { useDeviceStore } from '@/store/device/deviceStore';

/**
 * Custom hook to listen to real-time sensor data broadcasts
 * Subscribes to device-specific sensor channel and updates the sensor store
 * Device ID is automatically loaded from deviceStore
 * 
 * @param fallbackDeviceId - Optional fallback device ID if no device is paired (defaults to null)
 */
export const useSensorData = (fallbackDeviceId: number | null = null) => {
  const { updateCleanWater, updateDirtyWater, updateHydroponicsWater, setError } = useSensorStore();
  const isListeningRef = useRef(false);
  const channelRef = useRef<any>(null);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [echoReady, setEchoReady] = useState(false);
  const [deviceLoadAttempted, setDeviceLoadAttempted] = useState(false);
  
  // Get device ID from deviceStore
  const devices = useDeviceStore((state) => state.devices);
  const deviceId = devices.length > 0 ? devices[0].id : fallbackDeviceId;
  const { fetchDevice } = useDeviceStore();

  // Load device from API if not already loaded
  useEffect(() => {
    const loadDevice = async () => {
      // Only attempt once and only if we have a user
      if (deviceLoadAttempted || !user?.id) {
        return;
      }

      console.log(' [useSensorData] No device in store, fetching for user:', user.id);
      setDeviceLoadAttempted(true);
      
      try {
        await fetchDevice(user.id);
      } catch (error) {
        console.error(' [useSensorData] Failed to fetch device:', error);
      }
    };

    // If no device is loaded and we haven't tried yet, load it
    if (devices.length === 0 && !deviceLoadAttempted && user?.id) {
      loadDevice();
    }
  }, [devices.length, deviceLoadAttempted, user?.id, fetchDevice]);

  // Check if Echo is initialized periodically
  useEffect(() => {
    const checkEcho = () => {
      const echo = getEcho();
      if (echo && !echoReady) {
        console.log(' [useSensorData] Echo is now ready');
        setEchoReady(true);
      }
    };

    // Check immediately
    checkEcho();

    // Then check every 500ms until Echo is ready
    const interval = setInterval(checkEcho, 500);

    return () => clearInterval(interval);
  }, [echoReady]);

  // Log when device becomes available (only log once when deviceId changes)
  const previousDeviceIdRef = useRef<number | null>(null);
  useEffect(() => {
    // Only log if deviceId actually changed
    if (deviceId !== previousDeviceIdRef.current) {
      if (deviceId) {
        console.log(' [useSensorData] Device ID available for sensor subscription:', deviceId);
        console.log(' [useSensorData] Will subscribe to channel: sensor.device.' + deviceId);
      } else {
        console.log(' [useSensorData] No device ID available for sensor subscription');
      }
      console.log(' [useSensorData] Echo ready status:', echoReady);
      previousDeviceIdRef.current = deviceId;
    }
  }, [deviceId, echoReady]);

  useEffect(() => {
    // Only proceed if we have a token, device ID, and Echo is ready
    if (!token) {
      console.log('No auth token, skipping sensor data subscription');
      return;
    }

    if (deviceId === null) {
      console.log(' No device ID available, skipping sensor data subscription');
      return;
    }

    if (!echoReady) {
      console.log(' [useSensorData] Echo not ready yet, waiting...');
      return;
    }

    const setupSensorListeners = async () => {
      try {
        if (isListeningRef.current) {
          console.log('Already listening to sensor data');
          return;
        }

        const echo = getEcho();
        if (!echo) {
          console.log('Echo not initialized, cannot setup sensor listeners');
          return;
        }

        // Wait for WebSocket connection
        console.log('⚡ [useSensorData] Waiting for WebSocket connection for sensor data...');
        await waitForConnection();
        console.log('⚡ [useSensorData] WebSocket connected! Setting up sensor listeners...');

        isListeningRef.current = true;

        // Subscribe to the single device channel (NOT separate channels per system)
        // Using PUBLIC channel - change to .private() if backend uses PrivateChannel
        console.log(`🔔 [useSensorData] Subscribing to PUBLIC channel: sensor.device.${deviceId}`);
        console.log(`🔔 [useSensorData] Listening for event: .sensor.data.updated`);
        
        const channel = echo
          .channel(`sensor.device.${deviceId}`)
          .listen('.sensor.data.updated', (data: any) => {
            console.log('📡 [.sensor.data.updated] Sensor Data Received:', data);

            // The backend sends data in this format:
            // {
            //   device_id: 1,
            //   sensor_system_id: 1,
            //   system_type: 'clean_water',
            //   readings: { ph: 7.2, tds: 150, ... },
            //   reading_time: '2026-01-07...',
            //   timestamp: 123456789
            // }

            if (!data || !data.system_type || !data.readings) {
              console.warn('⚠️ Invalid sensor data received:', data);
              return;
            }

            // Helper function to safely parse numeric values
            const parseNumericValue = (value: any): number | null => {
              if (value == null) return null;
              const parsed = parseFloat(value);
              return isNaN(parsed) ? null : parsed;
            };

            // Create the full sensor reading object
            // Parse numeric values to ensure they're numbers, not strings
            const sensorReading: SensorReading = {
              id: data.sensor_system_id, // Use sensor_system_id as id for now
              sensor_system_id: data.sensor_system_id,
              ph: parseNumericValue(data.readings.ph),
              tds: parseNumericValue(data.readings.tds),
              turbidity: parseNumericValue(data.readings.turbidity),
              water_level: parseNumericValue(data.readings.water_level),
              humidity: parseNumericValue(data.readings.humidity),
              temperature: parseNumericValue(data.readings.temperature),
              ec: parseNumericValue(data.readings.ec),
              electric_current: parseNumericValue(data.readings.electric_current),
              ai_classification: data.readings.ai_classification ?? null,
              reading_time: data.reading_time,
              created_at: data.reading_time, // Use reading_time as fallback
              updated_at: data.reading_time,
            };

            // Update the appropriate store based on system_type
            switch (data.system_type) {
              case 'clean_water':
                console.log('🌊 Updating Clean Water:', sensorReading.ph);
                updateCleanWater(sensorReading);
                break;
              case 'dirty_water':
                console.log('🌊 Updating Dirty Water:', sensorReading.ph);
                updateDirtyWater(sensorReading);
                break;
              case 'hydroponics_water':
                console.log('🌿 Updating Hydroponics Water:', sensorReading.ph);
                updateHydroponicsWater(sensorReading);
                break;
              default:
                console.warn('⚠️ Unknown system type:', data.system_type);
            }
          })
          // Try alternative event name without leading dot
          .listen('sensor.data.updated', (data: any) => {
            console.log('📡 [sensor.data.updated] Sensor Data Received (no dot):', data);
            // Process data same way as above
            if (!data || !data.system_type || !data.readings) {
              console.warn('⚠️ Invalid sensor data received:', data);
              return;
            }
            const parseNumericValue = (value: any): number | null => {
              if (value == null) return null;
              const parsed = parseFloat(value);
              return isNaN(parsed) ? null : parsed;
            };
            const sensorReading: SensorReading = {
              id: data.sensor_system_id,
              sensor_system_id: data.sensor_system_id,
              ph: parseNumericValue(data.readings.ph),
              tds: parseNumericValue(data.readings.tds),
              turbidity: parseNumericValue(data.readings.turbidity),
              water_level: parseNumericValue(data.readings.water_level),
              humidity: parseNumericValue(data.readings.humidity),
              temperature: parseNumericValue(data.readings.temperature),
              ec: parseNumericValue(data.readings.ec),
              electric_current: parseNumericValue(data.readings.electric_current),
              ai_classification: data.readings.ai_classification ?? null,
              reading_time: data.reading_time,
              created_at: data.reading_time,
              updated_at: data.reading_time,
            };
            switch (data.system_type) {
              case 'clean_water':
                console.log('🌊 Updating Clean Water:', sensorReading.ph);
                updateCleanWater(sensorReading);
                break;
              case 'dirty_water':
                console.log('🌊 Updating Dirty Water:', sensorReading.ph);
                updateDirtyWater(sensorReading);
                break;
              case 'hydroponics_water':
                console.log('🌿 Updating Hydroponics Water:', sensorReading.ph);
                updateHydroponicsWater(sensorReading);
                break;
              default:
                console.warn('⚠️ Unknown system type:', data.system_type);
            }
          });

        // Store channel for cleanup
        channelRef.current = channel;

        // Add subscription success/error handlers for debugging
        channel.subscription.bind('pusher:subscription_succeeded', () => {
          console.log(`✅ [useSensorData] Successfully subscribed to sensor.device.${deviceId}`);
          console.log(`✅ [useSensorData] Now listening for sensor data broadcasts on this channel`);
        });

        channel.subscription.bind('pusher:subscription_error', (error: any) => {
          console.error(`❌ [useSensorData] Subscription error for sensor.device.${deviceId}:`, error);
        });

        // Listen for ALL events on this channel for debugging
        channel.subscription.bind_global((eventName: string, data: any) => {
          console.log(`📨 [useSensorData] Event received on channel sensor.device.${deviceId}:`, eventName, data);
        });

        console.log(`✅ [useSensorData] Successfully set up subscription to sensor channel for device ${deviceId}`);
        console.log(`  - Channel: sensor.device.${deviceId}`);
        console.log(`  - Event: .sensor.data.updated`);
        console.log(`  - Backend should broadcast to this channel for device_id: ${deviceId}`);
      } catch (error: any) {
        console.error('❌ Error setting up sensor listeners:', error);
        setError(error.message || 'Failed to setup sensor listeners');
        isListeningRef.current = false;
      }
    };

    setupSensorListeners();

    // Cleanup function
    return () => {
      console.log('🧹 [useSensorData] Cleaning up sensor listeners for device:', deviceId);
      
      const echo = getEcho();
      if (echo && channelRef.current && deviceId !== null) {
        try {
          echo.leave(`sensor.device.${deviceId}`);
          console.log(`✅ [useSensorData] Left channel: sensor.device.${deviceId}`);
        } catch (error) {
          console.error('[useSensorData] Error leaving channel:', error);
        }
        channelRef.current = null;
      }
      
      isListeningRef.current = false;
      console.log('✅ [useSensorData] Sensor listeners cleaned up');
    };
  }, [deviceId, token, echoReady, updateCleanWater, updateDirtyWater, updateHydroponicsWater, setError]);

  return {
    // Return the store data for convenience
    cleanWater: useSensorStore((state) => state.cleanWater),
    dirtyWater: useSensorStore((state) => state.dirtyWater),
    hydroponicsWater: useSensorStore((state) => state.hydroponicsWater),
    loading: useSensorStore((state) => state.loading),
    error: useSensorStore((state) => state.error),
    lastUpdated: useSensorStore((state) => state.lastUpdated),
    deviceId, // Include the current device ID
  };
};