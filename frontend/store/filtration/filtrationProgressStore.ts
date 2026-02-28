import { create } from 'zustand';
import { useTreatmentStore } from '@/store/treatment/treatmentStore';
import type { LatestTreatmentStage } from '@/types/treatment';

export interface FiltrationProgressState {
  progress: number;
  statusText: string;
  isActive: boolean;
  isProcessFailed: boolean;
  setProgress: (
    progress: number,
    statusText: string,
    isActive: boolean,
    isProcessFailed: boolean
  ) => void;
  syncFromApi: () => Promise<void>;
}

const mapBackendToCompleted = (s: string): boolean => s === 'passed';

export const useFiltrationProgressStore = create<FiltrationProgressState>((set) => ({
  progress: 0,
  statusText: 'Not Started',
  isActive: false,
  isProcessFailed: false,

  setProgress: (progress, statusText, isActive, isProcessFailed) =>
    set({ progress, statusText, isActive, isProcessFailed }),

  syncFromApi: async () => {
    const data = await useTreatmentStore.getState().fetchLatestTreatment?.();
    if (!data || !data.stages || data.final_status !== 'pending') {
      set({
        progress: 0,
        statusText: 'Not Started',
        isActive: false,
        isProcessFailed: false,
      });
      return;
    }

    const completedCount = data.stages.filter((s: LatestTreatmentStage) =>
      mapBackendToCompleted(s.status)
    ).length;
    const progress = (completedCount / 4) * 100;
    const hasProcessing = data.stages.some((s: LatestTreatmentStage) => s.status === 'processing');
    const stage4Failed = data.stages.some(
      (s: LatestTreatmentStage) => s.stage_order === 4 && s.status === 'failed'
    );
    const allPassed = data.stages.every((s: LatestTreatmentStage) => s.status === 'passed');

    let statusText = 'Not Started';
    if (allPassed && data.stages.length === 4) statusText = 'Complete';
    else if (stage4Failed) statusText = 'Restart Required';
    else if (hasProcessing) statusText = 'In Progress...';

    const isActive = hasProcessing || allPassed || stage4Failed;

    set({
      progress,
      statusText,
      isActive,
      isProcessFailed: stage4Failed,
    });
  },
}));
