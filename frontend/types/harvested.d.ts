export type YieldGrade = {
  id: number;
  grade: string;
  count: number;
  weight: number | null;
};

export type Yield = {
  id: number;
  total_count: number;
  total_weight: number;
  notes: string | null;
  grades: YieldGrade[];
};

export type HarvestItem = {
  id: number;
  crop_name: string;
  number_of_crops: number;
  bed_size: string;
  setup_date: string;
  harvest_date: string;
  duration_days: number;
  yield: Yield | null;
  status: string;
};

export type HarvestStatistics = {
  total_harvested_setups: number;
  total_sold: number;
  total_consumed: number;
  total_disposed: number;
};

export type HarvestedResponse = {
  status: string;
  statistics: HarvestStatistics;
  data: {
    current_page: number;
    data: HarvestItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: any[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
};

export type HarvestedStore = {
  items: HarvestItem[];
  statistics: HarvestStatistics | null;
  currentPage: number;
  lastPage: number;
  total: number;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterMonth: string | null;
  cache: Record<string, any>;

  fetchHarvested: (
    page?: number,
    search?: string,
    month?: string | null,
    forceRefresh?: boolean
  ) => Promise<void>;
  searchHarvested: (search: string) => Promise<void>;
  filterByMonth: (month: string | null) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  clearCache: () => void;
};

