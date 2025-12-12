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


      const { user, ph_level } = response.data;

      set({
        data: {
          user,
          pHLevel: ph_level.value,
          unit: ph_level.unit,
          status: ph_level.status,
        },
        loading: false,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Failed to load dashboard data',
      });
    }
  },
}));