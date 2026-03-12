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

      const hasDevice = devicesResponse.data?.status === 'success' && devicesResponse.data?.devices?.length > 0;

      // Ensure device store is populated with the correct device only when user has a device
      if (hasDevice) {
        const firstDevice = devicesResponse.data.devices[0];
        const userDeviceId = firstDevice.id;
        console.log('📱 [Dashboard] User\'s device ID from /devices endpoint:', userDeviceId);

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
      } else {
        // Clear device store when user has no device
        console.log('📱 [Dashboard] No device found, clearing device store');
        useDeviceStore.getState().setDevice(null);
        useDeviceStore.setState({ devices: [] });
      }

      // Fetch dashboard data (user, nearest_to_harvest; pH only when user has a device)
      const response = await axiosInstance.get('/dashboard');

      console.log('📊 [Dashboard] Dashboard API Response:', JSON.stringify(response.data, null, 2));

      const { user, ph_levels, nearest_to_harvest } = response.data ?? {};

      // When no device, show -- for pH (don't use API ph_levels)
      if (!hasDevice) {
        console.log('📊 [Dashboard] User has no device, setting pH to null');
        set({
          data: {
            user: user ?? 'User',
            pHLevel: null,
            unit: null,
            status: null,
            nearest_to_harvest: null,
          },
          loading: false,
        });
        return;
      }

      // When device exists, use ph_levels from API if present
      if (!ph_levels?.clean_water) {
        set({
          data: {
            user: user ?? 'User',
            pHLevel: null,
            unit: null,
            status: null,
            nearest_to_harvest: nearest_to_harvest ?? null,
          },
          loading: false,
        });
        return;
      }

      const value = parseFloat(ph_levels.clean_water.value);
      set({
        data: {
          user: user ?? 'User',
          pHLevel: Number.isNaN(value) ? null : value,
          unit: ph_levels.clean_water.unit ?? null,
          status: ph_levels.clean_water.status ?? null,
          nearest_to_harvest: nearest_to_harvest ?? null,
        },
        loading: false,
      });
    } catch (error: any) {
      if (error.__authRedirect) {
        set({ loading: false });
        return;
      }
      console.error('Dashboard fetch error:', error);
      set({
        loading: false,
        error: error.response?.data?.message || error.message || 'Failed to load dashboard data',
      });
    }
  },
}));