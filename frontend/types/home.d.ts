export type WaterQuality = {
    pHLevel: number;
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

interface NearestToHarvest {
  setup_id: number;
  crop_name: string;
  growth_percentage: number;
}

interface DashboardData {
  user: string;
  pHLevel: number | null;
  unit: string | null;
  status: string | null;
  nearest_to_harvest: NearestToHarvest | null;
}

interface DashboardState {
  data: DashboardData | null;
  loading: boolean;
  error: string | null;
  fetchDashboard: () => Promise<void>;
}