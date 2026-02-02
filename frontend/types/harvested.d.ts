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
  data: HarvestItem[];
  has_more: boolean;
  total: number;
  offset: number;
  limit: number;
};

export type HarvestedStore = {
  items: HarvestItem[];
  statistics: HarvestStatistics | null;
  total: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  searchQuery: string;
  filterMonth: string | null;
  cache: {
    items: HarvestItem[];
    statistics: HarvestStatistics | null;
    total: number;
    hasMore: boolean;
  } | null;
  lastFetchTime: number | null;

  fetchHarvested: (reset?: boolean, useCache?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  searchHarvested: (search: string) => Promise<void>;
  filterByMonth: (month: string | null) => Promise<void>;
  clearCache: () => void;
  resetError: () => void;
};

