import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { DashboardState } from '@/types/home';
import { useDeviceStore } from '@/store/device/deviceStore';


export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set({ loading: true, error: null });

      // Fetch devices first to ensure device store is populated (backup if not loaded in _layout)
      const devicesResponse = await axiosInstance.get('/devices');
      console.log('📱 [Dashboard] Devices API Response:', JSON.stringify(devicesResponse.data, null, 2));
      
      // Ensure device store is populated with the correct device
      if (devicesResponse.data?.status === 'success' && devicesResponse.data?.devices?.length > 0) {
        const firstDevice = devicesResponse.data.devices[0];
        const userDeviceId = firstDevice.id;
        console.log('📱 [Dashboard] User\'s device ID from /devices endpoint:', userDeviceId);
        
        // Update device store if needed
        const currentDevices = useDeviceStore.getState().devices;
        if (currentDevices.length === 0 || currentDevices[0]?.id !== userDeviceId) {
          console.log('📱 [Dashboard] Updating device store with device from /devices endpoint');
          useDeviceStore.getState().setDevice({
            id: firstDevice.id,
            device_name: firstDevice.device_name,
            serial_number: firstDevice.serial_number,
            model: firstDevice.model,
            firmware_version: firstDevice.firmware_version,
            status: firstDevice.status,
          });
        }
      }

      // Fetch dashboard data (ignore device_id from this endpoint, use /devices endpoint instead)
      const response = await axiosInstance.get('/dashboard'); 

      console.log('📊 [Dashboard] Dashboard API Response:', JSON.stringify(response.data, null, 2));

      const { user, ph_levels, nearest_to_harvest } = response.data;

      // Check if ph_levels exists and has clean_water data
      if (!ph_levels || !ph_levels.clean_water) {
        console.error('Invalid response structure:', response.data);
        set({
          loading: false,
          error: 'Invalid data structure from server',
        });
        return;
      }

      set({
        data: {
          user,
          pHLevel: parseFloat(ph_levels.clean_water.value),
          unit: ph_levels.clean_water.unit,
          status: ph_levels.clean_water.status,
          nearest_to_harvest: nearest_to_harvest || null,
        },
        loading: false,
      });
    } catch (error: any) {
      console.error('Dashboard fetch error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      set({
        loading: false,
        error: error.response?.data?.message || error.message || 'Failed to load dashboard data',
      });
    }
  },
}));