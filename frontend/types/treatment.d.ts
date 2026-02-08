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


export type TreatmentStageName = 'MFC' | 'Natural Filter' | 'UV Filter' | 'Clean Water Tank';


export type TreatmentStageStatus = 'processing';


export interface SaveStagePayload {
  stage_name: TreatmentStageName;
  stage_order: number; 
  status: TreatmentStageStatus;
}


export interface TreatmentStageRecord {
  id?: number;
  stage_name: TreatmentStageName;
  stage_order: number;
  status: TreatmentStageStatus;
  created_at?: string;
  updated_at?: string;
}

export interface SaveStageResponse {
  success: boolean;
  message: string;
  data: TreatmentStageRecord;
}

/** Status for PUT /treatment/update-stages (completed = passed, failed = failed). */
export type UpdateStageStatus = 'passed' | 'failed';

/** Payload for PUT /treatment/update-stages (update stage by stage_order). */
export interface UpdateStagePayload {
  stage_order: number; // 0–3 for stages 1–4
  status: UpdateStageStatus;
}

/** Response shape for PUT /treatment/update-stages. */
export interface UpdateStageResponse {
  success: boolean;
  message: string;
  data: TreatmentStageRecord;
}

/** Filtration command API response (success/error only). */
export interface FiltrationCommandResponse {
  success: boolean;
  message?: string;
}

export interface TreatmentStore {
  loading: boolean;
  error: string | null;

  currentTreatment: TreatmentReport | null;

  saveTreatment: () => Promise<TreatmentReport | null>;
  updateTreatment: (total_cycles: number) => Promise<TreatmentReport | null>;
  fetchLatestTreatment: () => Promise<LatestTreatmentData | null>;
  resetError: () => void;
  clearCurrentTreatment: () => void;

  /** Filtration commands (call backend API; toasts shown when MQTT state is received in UI). */
  startProcess: () => Promise<boolean>;
  openValve1: () => Promise<boolean>;
  closeValve1: () => Promise<boolean>;
  openDrainValve: () => Promise<boolean>;
  closeDrainValve: () => Promise<boolean>;
  restartFiltration: () => Promise<boolean>;
}

/** Stage data from GET /treatment/latest */
export interface LatestTreatmentStage {
  id: number;
  stage_name: TreatmentStageName;
  stage_order: number;
  status: 'passed' | 'processing' | 'pending' | 'failed';
  ph: number | null;
  tds: number | null;
  turbidity: number | null;
  notes: string | null;
}

/** Treatment data from GET /treatment/latest */
export interface LatestTreatmentData {
  id: number;
  device_id: number;
  start_time: string;
  end_time: string | null;
  final_status: 'pending' | 'success' | 'failed';
  total_cycles: number | null;
  stages: LatestTreatmentStage[];
}
