export interface TDSRecommendation {
  ppm: number;
  stage: string;
  description: string;
}

export interface TDSDetails {
  id: number;
  title: string;
  recommendations: TDSRecommendation[];
  note: string;
  description: string;
}

export interface TDSApiResponse {
  success: boolean;
  data: TDSDetails;
  message?: string;
}
