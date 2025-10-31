export type WaterQuality = {
    pHLevel: numnber;
    status: 'Good' | 'Poor';
    level: 'Low' | 'Medium' | 'High';
}

export type GrowthProgess = {
    plantType: string;
    percentage: number;
}

export type HomeProps = {
  waterQuality: WaterQuality;
  growth: GrowthProgress;
};

interface DashboardData {
  user: string;
  pHLevel: number;
  unit: string;
  status: string;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}