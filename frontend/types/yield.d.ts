interface YieldGrade {
  id?: number;
  grade: "selling" | "consumption" | "disposal";
  count: number;
  weight: number | null;
}

interface YieldData {
  id?: number;
  hydroponic_setup_id?: number;
  total_count: number;
  total_weight: number | null;
  notes: string | null;
  grades: YieldGrade[];
}

interface YieldPayload {
  total_count: number;
  total_weight: number | null;
  notes: string | null;
  grades: {
    grade: "selling" | "consumption";
    count: number;
    weight: number | null;
  }[];
}

interface YieldSummary {
  total_crops_in_setup: number;
  total_harvested: number;
  total_disposed: number;
}

interface YieldResponse {
  status: string;
  message: string;
  data: {
    yield: YieldData;
    summary: YieldSummary;
  };
}

interface YieldStore {
  loading: boolean;
  error: string | null;
  yieldData: YieldData | null;
  yieldSaved: boolean;
  storeYield: (setupId: number, payload: YieldPayload) => Promise<void>;
  markAsHarvested: (setupId: number) => Promise<void>;
  resetYieldState: () => void;
  resetError: () => void;
}

