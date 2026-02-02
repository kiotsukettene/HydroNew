import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { handleAxiosError } from '@/api/handleAxiosError';
import type {
  TreatmentStore,
  SaveTreatmentResponse,
  UpdateTreatmentResponse,
  SaveStagePayload,
  SaveStageResponse,
  UpdateStagePayload,
  UpdateStageResponse,
  TreatmentStageRecord,
} from '@/types/treatment';

export const useTreatmentStore = create<TreatmentStore>((set, get) => ({
  loading: false,
  error: null,
  currentTreatment: null,

  saveTreatment: async () => {
    set({ loading: true, error: null });
    const url = '/treatment';
    const fullUrl = `${axiosInstance.defaults.baseURL ?? ''}${url}`;
    console.log('[Treatment] saveTreatment: calling POST', fullUrl);

    try {
      const response = await axiosInstance.post(url);
      console.log('[Treatment] saveTreatment: response status', response.status, 'data', JSON.stringify(response.data));

      const { success, message, data } = response.data;
      if (!success || !data) {
        console.warn('[Treatment] saveTreatment: backend returned success=false or no data', { success, message, data });
        set({ error: message || 'Failed to start treatment', loading: false });
        return null;
      }

      set({ currentTreatment: data, loading: false });
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data?: { message?: string; error?: string } }; request?: unknown; message?: string };
      const responseData = axiosErr.response?.data;
      const backendError = responseData && typeof responseData === 'object' && 'error' in responseData ? (responseData as { error?: string }).error : undefined;
      console.error('[Treatment] saveTreatment: request failed', {
        status: axiosErr.response?.status,
        backendMessage: responseData && typeof responseData === 'object' && 'message' in responseData ? (responseData as { message?: string }).message : undefined,
        backendError,
        responseData: axiosErr.response?.data,
      });
      if (backendError) {
        console.error('[Treatment] saveTreatment: backend exception (check server logs)', backendError);
      }
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
      return null;
    }
  },

  updateTreatment: async (total_cycles: number) => {
    set({ loading: true, error: null });
    const url = '/treatment/update-treatment';
    const fullUrl = `${axiosInstance.defaults.baseURL ?? ''}${url}`;
    const payload = { total_cycles };
    console.log('[Treatment] updateTreatment: calling PUT', fullUrl, 'payload', payload);

    try {
      const response = await axiosInstance.put(url, payload);
      console.log('[Treatment] updateTreatment: response status', response.status, 'data', JSON.stringify(response.data));

      const { success, message, data } = response.data;

      if (!success || !data) {
        console.warn('[Treatment] updateTreatment: backend returned success=false or no data', { success, message, data });
        set({ error: message || 'Failed to update treatment', loading: false });
        return null;
      }

      set({ currentTreatment: data, loading: false });
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data?: unknown }; request?: unknown; message?: string };
      console.error('[Treatment] updateTreatment: request failed', {
        hasResponse: !!axiosErr.response,
        status: axiosErr.response?.status,
        responseData: axiosErr.response?.data,
        hasRequest: !!axiosErr.request,
        message: axiosErr.message,
        fullError: err,
      });
      const { message } = handleAxiosError(err);
      console.error('[Treatment] updateTreatment: handleAxiosError message', message);
      set({ error: message, loading: false });
      return null;
    }
  },

  saveStage: async (payload: SaveStagePayload) => {
    set({ loading: true, error: null });
    const url = '/treatment/stages';
    const fullUrl = `${axiosInstance.defaults.baseURL ?? ''}${url}`;
    console.log('[Treatment] saveStage: calling POST', fullUrl, 'payload', payload);

    try {
      const response = await axiosInstance.post<SaveStageResponse>(url, payload);
      console.log('[Treatment] saveStage: response status', response.status, 'data', JSON.stringify(response.data));

      const { success, message, data } = response.data;
      if (!success || !data) {
        console.warn('[Treatment] saveStage: backend returned success=false or no data', { success, message, data });
        set({ error: message || 'Failed to save stage', loading: false });
        return null;
      }

      set({ loading: false });
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data?: { message?: string; error?: string } }; request?: unknown; message?: string };
      const responseData = axiosErr.response?.data;
      const backendError = responseData && typeof responseData === 'object' && 'error' in responseData ? (responseData as { error?: string }).error : undefined;
      console.error('[Treatment] saveStage: request failed', {
        status: axiosErr.response?.status,
        backendMessage: responseData && typeof responseData === 'object' && 'message' in responseData ? (responseData as { message?: string }).message : undefined,
        backendError,
        responseData: axiosErr.response?.data,
      });
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
      return null;
    }
  },

  updateStage: async (payload: UpdateStagePayload) => {
    set({ loading: true, error: null });
    const url = '/treatment/update-stages';
    const fullUrl = `${axiosInstance.defaults.baseURL ?? ''}${url}`;
    console.log('[Treatment] updateStage: calling PUT', fullUrl, 'payload', payload);

    try {
      const response = await axiosInstance.put<UpdateStageResponse>(url, payload);
      console.log('[Treatment] updateStage: response status', response.status, 'data', JSON.stringify(response.data));

      const { success, message, data } = response.data;
      if (!success || !data) {
        console.warn('[Treatment] updateStage: backend returned success=false or no data', { success, message, data });
        set({ error: message || 'Failed to update stage', loading: false });
        return null;
      }

      set({ loading: false });
      return data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data?: { message?: string; error?: string } }; request?: unknown; message?: string };
      const responseData = axiosErr.response?.data;
      const backendError = responseData && typeof responseData === 'object' && 'error' in responseData ? (responseData as { error?: string }).error : undefined;
      console.error('[Treatment] updateStage: request failed', {
        status: axiosErr.response?.status,
        backendMessage: responseData && typeof responseData === 'object' && 'message' in responseData ? (responseData as { message?: string }).message : undefined,
        backendError,
        responseData: axiosErr.response?.data,
      });
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
      return null;
    }
  },

  resetError: () => set({ error: null }),
  clearCurrentTreatment: () => set({ currentTreatment: null }),
}));
