interface PumpConfig {
  pumpA: boolean;
  pumpB: boolean;
}

interface HydroponicSetupPayload {
  crop_name: string;
  number_of_crops: number;
  bed_size: "small" | "medium" | "large" | "custom";
  nutrient_solution?: string | null;
  target_ph_min: number;
  target_ph_max: number;
  target_tds_min: number;
  target_tds_max: number;
  water_amount: string;
  harvest_date: string;
  pump_config?: PumpConfig | null;
}

// Complete setup response from API
interface HydroponicSetup extends HydroponicSetupPayload {
  id: number;
  user_id: number;
  harvest_status: string;
  harvest_date: string | null;
  setup_date: string;
  status: string;
  is_archived: boolean;
  created_at: string | null;
  updated_at: string | null;
  plant_age: number;
  days_left: number;
}

interface HydroponicSetupStore {
  loading: boolean;
  error: string | null;
  hydroponicSetups: HydroponicSetup[]; 
  currentSetup: HydroponicSetup | null; // For detailed view
  createHydroponicSetup: (data: HydroponicSetupPayload) => Promise<void>;
  fetchHydroponicSetups: (page?: number) => Promise<void>; 
  fetchSetupById: (setupId: number) => Promise<void>; // New function
  resetError: () => void;
}