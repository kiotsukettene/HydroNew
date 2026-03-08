import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { handleAxiosError } from '@/api/handleAxiosError';
import type {
  TreatmentStore,
  SaveStagePayload,
  SaveStageResponse,
  UpdateStagePayload,
  UpdateStageResponse,
  TreatmentStageRecord,
  LatestTreatmentData,
  FiltrationCommandResponse,
  TreatmentReportListItem,
  TreatmentReportsResponse,
} from '@/types/treatment';

export const useTreatmentStore = create<TreatmentStore>((set, get) => ({
  loading: false,
  error: null,
  currentTreatment: null,
  reports: null,

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


  resetError: () => set({ error: null }),
  clearCurrentTreatment: () => set({ currentTreatment: null }),

  startProcess: async () => {
    const url = '/filtration/commands/start-process';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      const ok = response.data?.success === true;
      if (!ok) console.warn('[Treatment] startProcess: backend returned success=false', response.data);
      return ok;
    } catch (err) {
      console.error('[Treatment] startProcess failed', err);
      return false;
    }
  },

  openValve1: async () => {
    const url = '/filtration/commands/open-valve-1';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      return response.data?.success === true;
    } catch (err) {
      console.error('[Treatment] openValve1 failed', err);
      return false;
    }
  },

  closeValve1: async () => {
    const url = '/filtration/commands/close-valve-1';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      return response.data?.success === true;
    } catch (err) {
      console.error('[Treatment] closeValve1 failed', err);
      return false;
    }
  },

  openDrainValve: async () => {
    const url = '/filtration/commands/open-drain-valve';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      return response.data?.success === true;
    } catch (err) {
      console.error('[Treatment] openDrainValve failed', err);
      return false;
    }
  },

  closeDrainValve: async () => {
    const url = '/filtration/commands/close-drain-valve';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      return response.data?.success === true;
    } catch (err) {
      console.error('[Treatment] closeDrainValve failed', err);
      return false;
    }
  },

  restartFiltration: async () => {
    const url = '/filtration/commands/restart';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      return response.data?.success === true;
    } catch (err) {
      console.error('[Treatment] restartFiltration failed', err);
      return false;
    }
  },

  openPump4: async () => {
    const url = '/filtration/commands/open-pump-4';
    try {
      const response = await axiosInstance.post<FiltrationCommandResponse>(url);
      return response.data?.success === true;
    } catch (err) {
      console.error('[Treatment] openPump4 failed', err);
      return false;
    }
  },

  fetchLatestTreatment: async () => {
    set({ loading: true, error: null });
    const url = '/treatment/latest';
    const fullUrl = `${axiosInstance.defaults.baseURL ?? ''}${url}`;
    console.log('[Treatment] fetchLatestTreatment: calling GET', fullUrl);

    try {
      const response = await axiosInstance.get(url);
      console.log('[Treatment] fetchLatestTreatment: response status', response.status, 'data', JSON.stringify(response.data));

      const { success, message, data } = response.data;
      if (!success || !data) {
        console.warn('[Treatment] fetchLatestTreatment: backend returned success=false or no data', { success, message, data });
        set({ loading: false });
        return null;
      }

      set({ loading: false });
      return data as LatestTreatmentData;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data?: unknown }; request?: unknown; message?: string };
      console.error('[Treatment] fetchLatestTreatment: request failed', {
        hasResponse: !!axiosErr.response,
        status: axiosErr.response?.status,
        responseData: axiosErr.response?.data,
      });
      const { message } = handleAxiosError(err);
      set({ error: message, loading: false });
      return null;
    }
  },

  fetchTreatmentReports: async () => {
    set({ loading: true, error: null });
    const url = '/treatment/reports';
    const fullUrl = `${axiosInstance.defaults.baseURL ?? ''}${url}`;
    console.log('[Treatment] fetchTreatmentReports: calling GET', fullUrl);

    try {
      const response = await axiosInstance.get<TreatmentReportsResponse>(url);
      console.log('[Treatment] fetchTreatmentReports: response status', response.status, 'data', JSON.stringify(response.data));

      const { success, data } = response.data;
      if (!success || !Array.isArray(data)) {
        console.warn('[Treatment] fetchTreatmentReports: backend returned success=false or non-array data', { success, data });
        set({ reports: null, loading: false });
        return null;
      }

      set({ reports: data, loading: false });
      return data as TreatmentReportListItem[];
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number; data?: unknown }; request?: unknown; message?: string };
      console.error('[Treatment] fetchTreatmentReports: request failed', {
        hasResponse: !!axiosErr.response,
        status: axiosErr.response?.status,
        responseData: axiosErr.response?.data,
      });
      const { message } = handleAxiosError(err);
      set({ error: message, reports: null, loading: false });
      return null;
    }
  },
}));
