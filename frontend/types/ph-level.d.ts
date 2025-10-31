export interface PHCondition {
  type: 'ideal' | 'low' | 'high';
  icon: string;
  description: string;
}

export interface PHLevelDetails {
  id: number;
  title: string;
  description: string;
  idealRange: string;
  conditions: PHCondition[];
  note: string;
}

export interface PHLevelApiResponse {
  success: boolean;
  data: PHLevelDetails;
  message?: string;
}
