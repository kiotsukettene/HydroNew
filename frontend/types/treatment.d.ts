/**
 * Treatment report as returned by the backend (save/update).
 */
export interface TreatmentReport {
  id: number;
  device_id: number;
  start_time: string;
  end_time: string | null;
  final_status: 'on progress' | 'success';
  total_cycles: number | null;
  created_at?: string;
  updated_at?: string;
}

/** Response shape for POST /treatment (save). */
export interface SaveTreatmentResponse {
  success: boolean;
  message: string;
  data: TreatmentReport;
}

/** Response shape for POST /treatment/update-treatment (update). */
export interface UpdateTreatmentResponse {
  success: boolean;
  message: string;
  data: TreatmentReport;
}

/** Payload for updating a treatment (total_cycles required). */
export interface UpdateTreatmentPayload {
  total_cycles: number;
}

export interface TreatmentStore {
  loading: boolean;
  error: string | null;
  /** Last created or updated treatment report (e.g. current "on progress" or just finished). */
  currentTreatment: TreatmentReport | null;

  /** Start a new treatment — POST /treatment. */
  saveTreatment: () => Promise<TreatmentReport | null>;
  /** End the active treatment with cycle count — POST /treatment/update-treatment. */
  updateTreatment: (total_cycles: number) => Promise<TreatmentReport | null>;
  resetError: () => void;
  clearCurrentTreatment: () => void;
}
