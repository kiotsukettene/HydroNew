export type HydroponicYield = {
  id: number;
  hydroponic_setup_id: number;
  harvest_status: "harvested" | "not_harvested";
  growth_stage: string;
  health_status: string;
  actual_yield: number | null;
  harvest_date: string | null;
  plant_age: number;
  humidity: number;
  days_left: number;
  water_level: number;
  created_at: string;
  updated_at: string;
  notes: string | null;
  system_generated: boolean;
};

export type HydroponicYieldState = {
  yields: HydroponicYield[];
  loading: boolean;
  error: string | null;
  fetchYields: () => Promise<void>;
  fetchYieldBySetup: (setupId: number) => Promise<void>;
  updateActualYield: (
    yieldId: number,
    payload: { actual_yield: number; notes?: string }
  ) => Promise<void>;
  clearYields: () => void;
};
