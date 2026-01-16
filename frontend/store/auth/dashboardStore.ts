import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { DashboardState } from '@/types/home';


export const useDashboardStore = create<DashboardState>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchDashboard: async () => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get('/dashboard'); 

      console.log('Dashboard API Response:', JSON.stringify(response.data, null, 2));

      const { user, ph_levels } = response.data;

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