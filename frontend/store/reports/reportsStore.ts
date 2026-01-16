import { create } from "zustand";
import axiosInstance from "@/api/axiosInstance";
import { handleAxiosError } from "@/api/handleAxiosError";
import {
  ReportsStore,
} from "@/types/reports";

export const useReportsStore = create<ReportsStore>((set, get) => ({
  // State
  loading: false,
  error: null,
  cropPerformance: null,
  yieldSummary: null,
  cropComparison: null,
  waterQualityHistorical: null,
  waterQualityTrends: null,
  treatmentPerformance: null,
  treatmentEfficiency: null,

  // Crop Performance
  fetchCropPerformance: async (filters) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.crop_name) params.append('crop_name', filters.crop_name);
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await axiosInstance.get(`reports/crop-performance?${params.toString()}`);
      set({ 
        cropPerformance: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Yield Summary
  fetchYieldSummary: async (filters) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (filters.start_date) params.append('start_date', filters.start_date);
      if (filters.end_date) params.append('end_date', filters.end_date);

      const response = await axiosInstance.get(`reports/yield-summary?${params.toString()}`);
      set({ 
        yieldSummary: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Crop Comparison
  fetchCropComparison: async (cropNames, metric) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      cropNames.forEach(name => params.append('crop_names[]', name));
      params.append('metric', metric);

      const response = await axiosInstance.get(`reports/crop-comparison?${params.toString()}`);
      set({ 
        cropComparison: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Water Quality Historical
  fetchWaterQualityHistorical: async (systemType, params) => {
    set({ loading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('system_type', systemType);
      queryParams.append('interval', params.interval);
      if (params.start_date) queryParams.append('start_date', params.start_date);
      if (params.end_date) queryParams.append('end_date', params.end_date);

      const response = await axiosInstance.get(`reports/water-quality/historical?${queryParams.toString()}`);
      set({ 
        waterQualityHistorical: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Water Quality Trends
  fetchWaterQualityTrends: async (systemType, parameter, days) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('system_type', systemType);
      params.append('parameter', parameter);
      params.append('days', days.toString());

      const response = await axiosInstance.get(`reports/water-quality/trends?${params.toString()}`);
      set({ 
        waterQualityTrends: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Treatment Performance
  fetchTreatmentPerformance: async (deviceId, dateRange) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('device_id', deviceId.toString());
      if (dateRange.start_date) params.append('start_date', dateRange.start_date);
      if (dateRange.end_date) params.append('end_date', dateRange.end_date);

      const response = await axiosInstance.get(`reports/treatment-performance?${params.toString()}`);
      set({ 
        treatmentPerformance: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Treatment Efficiency
  fetchTreatmentEfficiency: async (deviceId, days) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams();
      params.append('device_id', deviceId.toString());
      params.append('days', days.toString());

      const response = await axiosInstance.get(`reports/treatment-efficiency?${params.toString()}`);
      set({ 
        treatmentEfficiency: response.data.data,
        loading: false 
      });
    } catch (err: any) {
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
    }
  },

  // Reset error
  resetError: () => set({ error: null }),
}));

