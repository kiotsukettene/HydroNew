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
  harvest_date: string;
  setup_date: string;
  status: string;
  is_archived: boolean;
  created_at: string | null;
  updated_at: string | null;
  plant_age: number;
  days_left: number;
  growth_percentage?: number;
}

interface PaginationLinks {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

interface HydroponicSetupsResponse {
  data: HydroponicSetup[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
  per_page: number;
  links: PaginationLinks[];
}

interface HydroponicSetupStore {
  loading: boolean;
  error: string | null;
  hydroponicSetups: HydroponicSetup[]; 
  currentSetup: HydroponicSetup | null; // For detailed view
  currentPage: number;
  lastPage: number;
  total: number;
  cache: Record<string, any>;
  createHydroponicSetup: (data: HydroponicSetupPayload) => Promise<void>;
  fetchHydroponicSetups: (page?: number) => Promise<void>; 
  fetchSetupById: (setupId: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  resetError: () => void;
}