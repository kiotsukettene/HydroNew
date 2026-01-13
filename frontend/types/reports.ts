// ============================================
// Crop Analytics Types
// ============================================

interface CropSetup {
  id: number;
  crop_name: string;
  health_status: 'good' | 'moderate' | 'poor';
  growth_stage: 'seedling' | 'vegetative' | 'flowering' | 'harvest-ready';
  current_parameters: {
    ph: number;
    tds: number;
    ec: number;
    humidity: number;
  };
  target_parameters: {
    ph_min: number;
    ph_max: number;
    tds_min: number;
    tds_max: number;
  };
}

interface ParameterCompliance {
  compliant: number;
  total: number;
  percentage: number;
}

export interface CropPerformanceData {
  setups: CropSetup[];
  growth_stage_distribution: Record<string, number>;
  health_status_distribution: Record<string, number>;
  parameter_compliance: Record<string, ParameterCompliance>;
}

interface HarvestedSetup {
  id: number;
  crop_name: string;
  harvested_date: string;
  total_weight: number;
  selling_grade_weight: number;
  consumption_grade_weight: number;
  disposal_grade_weight: number;
}

export interface YieldSummaryData {
  total_harvested_setups: number;
  weight_by_crop: Record<string, number>;
  grade_distribution: {
    selling: {
      count: number;
      percentage: number;
    };
    consumption: {
      count: number;
      percentage: number;
    };
    disposal: {
      count: number;
      percentage: number;
    };
    total_count: number;
    total_weight: number;
  };
  average_yield: {
    average_weight_per_setup: number;
    average_count_per_setup: number;
  };
  sellable_yield_percentage: number;
  waste_percentage: number;
  month_over_month: any;
}

interface CropComparisonItem {
  crop_name: string;
  total_weight: number;
  avg_duration: number;
  avg_quality_score: number;
  selling_percentage: number;
  consumption_percentage: number;
  disposal_percentage: number;
  harvest_count: number;
}

export interface CropComparisonData {
  crops: CropComparisonItem[];
  best_performer: {
    crop_name: string;
    metric: string;
    value: number;
  };
  metric: 'weight' | 'duration' | 'quality';
}

// ============================================
// Water Quality Types
// ============================================

interface WaterQualityReading {
  timestamp: string;
  ph: number | null;
  tds: number | null;
  ec: number | null;
  turbidity: number | null;
  temperature: number | null;
  humidity: number | null;
}

interface StatisticalSummary {
  min: number;
  max: number;
  average: number;
}

export interface WaterQualityHistoricalData {
  system_type: 'dirty_water' | 'clean_water' | 'hydroponics_water';
  interval: 'hourly' | 'daily' | 'weekly';
  readings: WaterQualityReading[];
  statistics: {
    ph: StatisticalSummary;
    tds: StatisticalSummary;
    ec: StatisticalSummary;
    turbidity: StatisticalSummary;
    temperature: StatisticalSummary;
    humidity: StatisticalSummary;
  };
  out_of_range_count?: number;
}

interface TrendAnalysis {
  current_value: number;
  historical_avg: number;
  trend: 'improving' | 'stable' | 'declining';
  deviation_count: number;
  percentage_change: number;
}

interface ParameterDataset {
  label: string;
  data: number[];
  target_min: number | null;
  target_max: number | null;
  unit: string;
  current_reading: string;
  historical_average: number;
  deviation_count: number;
}

interface ParameterStatistics {
  min: number;
  max: number;
  average: number;
  median: number;
}

export interface WaterQualityTrendsData {
  labels: string[];
  datasets: {
    [key: string]: ParameterDataset;
  };
  statistics: {
    [key: string]: ParameterStatistics;
  };
  trends: {
    [key: string]: 'improving' | 'stable' | 'declining';
  };
  recommendations: string[];
}

// Legacy type for backwards compatibility
export interface WaterQualityTrendsDataLegacy {
  system_type: 'dirty_water' | 'clean_water' | 'hydroponics_water';
  parameter: 'ph' | 'tds' | 'ec' | 'turbidity' | 'temperature' | 'humidity';
  days: number;
  trend_data: Array<{
    date: string;
    value: number;
  }>;
  analysis: TrendAnalysis;
  target_range?: {
    min: number;
    max: number;
  };
  recommendations: string[];
}

// ============================================
// Treatment Performance Types
// ============================================

interface StageEfficiency {
  stage_name: string;
  success_count: number;
  failure_count: number;
  success_rate: number;
  avg_duration: number;
  avg_turbidity_reduction: number;
  avg_tds_reduction: number;
}

interface FailureAnalysis {
  most_common_stage: string;
  failure_count: number;
  failure_reasons: Array<{
    reason: string;
    count: number;
  }>;
}

export interface TreatmentPerformanceData {
  device_id: number;
  total_cycles: number;
  success_count: number;
  failure_count: number;
  success_rate: number;
  failure_rate: number;
  performance_score: number;
  avg_cycle_duration: number;
  avg_turbidity_improvement: number;
  avg_tds_improvement: number;
  stage_efficiency: StageEfficiency[];
  failure_analysis: FailureAnalysis;
}

interface WaterQualityImprovement {
  parameter: string;
  avg_before: number;
  avg_after: number;
  improvement_percentage: number;
}

interface CycleTrend {
  date: string;
  cycle_count: number;
  success_rate: number;
}

export interface TreatmentEfficiencyData {
  device_id: number;
  days: number;
  total_cycles: number;
  avg_cycles_per_day: number;
  overall_success_rate: number;
  efficiency_trend: 'improving' | 'stable' | 'declining';
  water_quality_improvements: WaterQualityImprovement[];
  cycle_trends: CycleTrend[];
  maintenance_recommendations: string[];
}

// ============================================
// Store Types
// ============================================

export interface ReportsStore {
  // State
  loading: boolean;
  error: string | null;
  cropPerformance: CropPerformanceData | null;
  yieldSummary: YieldSummaryData | null;
  cropComparison: CropComparisonData | null;
  waterQualityHistorical: WaterQualityHistoricalData | null;
  waterQualityTrends: WaterQualityTrendsData | null;
  treatmentPerformance: TreatmentPerformanceData | null;
  treatmentEfficiency: TreatmentEfficiencyData | null;

  // Actions
  fetchCropPerformance: (filters: {
    status?: string;
    crop_name?: string;
    start_date?: string;
    end_date?: string;
  }) => Promise<void>;
  
  fetchYieldSummary: (filters: {
    start_date?: string;
    end_date?: string;
  }) => Promise<void>;
  
  fetchCropComparison: (
    cropNames: string[],
    metric: 'weight' | 'duration' | 'quality'
  ) => Promise<void>;
  
  fetchWaterQualityHistorical: (
    systemType: 'dirty_water' | 'clean_water' | 'hydroponics_water',
    params: {
      interval: 'hourly' | 'daily' | 'weekly';
      start_date?: string;
      end_date?: string;
    }
  ) => Promise<void>;
  
  fetchWaterQualityTrends: (
    systemType: 'dirty_water' | 'clean_water' | 'hydroponics_water',
    parameter: 'ph' | 'tds' | 'ec' | 'turbidity' | 'temperature' | 'humidity' | '',
    days: number
  ) => Promise<void>;
  
  fetchTreatmentPerformance: (
    deviceId: number,
    dateRange: {
      start_date?: string;
      end_date?: string;
    }
  ) => Promise<void>;
  
  fetchTreatmentEfficiency: (
    deviceId: number,
    days: number
  ) => Promise<void>;
  
  resetError: () => void;
}

// ============================================
// Filter Types
// ============================================

export interface DateRangeFilter {
  start_date: string;
  end_date: string;
}

export type SystemType = 'dirty_water' | 'clean_water' | 'hydroponics_water';
export type WaterParameter = 'ph' | 'tds' | 'ec' | 'turbidity' | 'temperature' | 'humidity';
export type TrendDirection = 'improving' | 'stable' | 'declining' | 'insufficient_data';
export type HealthStatus = 'good' | 'moderate' | 'poor';
export type GrowthStage = 'seedling' | 'vegetative' | 'flowering' | 'harvest-ready';

