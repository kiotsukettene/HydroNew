export interface HelpCenterItem {
  id: number;
  question: string;
  answer: string;
}

export interface PaginationLinks {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface HelpCenterResponse {
  data: HelpCenterItem[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
  per_page: number;
  links: PaginationLinks[];
}

export interface HelpCenterState {
  items: HelpCenterItem[];
  currentPage: number;
  lastPage: number;
  loading: boolean;
  filters: any[];
  searchQuery: string;
  error: string | null;
  fetchHelpCenter: (page?: number, search?: string) => Promise<void>;
  searchHelpCenter: (search: string) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
}