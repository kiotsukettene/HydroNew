export interface TipItem {
  heading: string;
  tips: string[];
}

export interface TipsSuggestion {
  category: string;
  title: string;
  description: string;
  bullet_points: TipItem[];
}

export interface TipsResponse {
  category: string;
  title: string;
  description: string;
  warnings: string[];
  bullet_points: TipItem[];
}

export interface BackendTipsResponse {
  system_type: string;
  device_id: number | null;
  current_reading: any;
  insights: TipsResponse;
  statuses: any;
  missing_sensors: string[];
  evidence: any[];
  retrieved_context: any;
  cached: boolean;
  cached_at?: string;
  expires_at?: string;
  note: string;
}

