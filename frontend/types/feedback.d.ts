export type FeedbackCategory = 
  | 'bug_report' 
  | 'feature_request' 
  | 'general_feedback' 
  | 'device_issue' 
  | 'other';

export interface Feedback {
  id: number;
  user_id: number;
  device_id: number;
  category: FeedbackCategory;
  subject: string | null;
  message: string;
  created_at: string;
  updated_at: string;
}

export interface FeedbackSubmitRequest {
  category: FeedbackCategory;
  subject?: string;
  message: string;
}

export interface FeedbackResponse {
  status: string;
  data: Feedback[];
  has_more: boolean;
  total: number;
  offset: number;
  limit: number;
}

export interface FeedbackSubmitResponse {
  status: string;
  message: string;
  data: Feedback;
}

export interface FeedbackState {
  feedbacks: Feedback[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  offset: number;
  limit: number;
  
  fetchFeedbacks: (offset?: number, limit?: number, deviceId?: number) => Promise<void>;
  submitFeedback: (data: FeedbackSubmitRequest) => Promise<void>;
  loadMore: () => Promise<void>;
  reset: () => void;
}