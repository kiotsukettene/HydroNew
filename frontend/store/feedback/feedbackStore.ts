import { create } from 'zustand';
import axiosInstance from '@/api/axiosInstance';
import { FeedbackState, FeedbackSubmitRequest, FeedbackResponse, FeedbackSubmitResponse } from '@/types/feedback';
import { toast } from 'sonner-native';

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  feedbacks: [],
  loading: false,
  submitting: false,
  error: null,
  hasMore: false,
  total: 0,
  offset: 0,
  limit: 20,

  fetchFeedbacks: async (offset = 0, limit = 20, deviceId?: number) => {
    try {
      set({ loading: true, error: null });

      const params = new URLSearchParams({
        offset: offset.toString(),
        limit: limit.toString(),
      });

      if (deviceId) {
        params.append('device_id', deviceId.toString());
      }

      const response = await axiosInstance.get<FeedbackResponse>(`/feedback?${params.toString()}`);
      const data = response.data;

      if (data.status === 'success') {
        set({
          feedbacks: offset === 0 ? data.data : [...get().feedbacks, ...data.data],
          hasMore: data.has_more,
          total: data.total,
          offset: data.offset,
          limit: data.limit,
          loading: false,
        });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to load feedback';
      set({ loading: false, error: errorMessage });
      toast.error(errorMessage);
    }
  },

  submitFeedback: async (data: FeedbackSubmitRequest) => {
    try {
      set({ submitting: true, error: null });

      const response = await axiosInstance.post<FeedbackSubmitResponse>('/feedback', data);
      
      if (response.data.status === 'success') {
        toast.success(response.data.message);
        
        // Refresh the feedback list after successful submission
        await get().fetchFeedbacks(0, get().limit);
        
        set({ submitting: false });
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit feedback';
      set({ submitting: false, error: errorMessage });
      toast.error(errorMessage);
      throw error;
    }
  },

  loadMore: async () => {
    const { offset, limit, hasMore, loading } = get();
    if (!hasMore || loading) return;

    const newOffset = offset + limit;
    await get().fetchFeedbacks(newOffset, limit);
  },

  reset: () => {
    set({
      feedbacks: [],
      loading: false,
      submitting: false,
      error: null,
      hasMore: false,
      total: 0,
      offset: 0,
      limit: 20,
    });
  },
}));

