// Sensor reading types matching Laravel backend structure
type SensorReading = {
  id: number;
  sensor_system_id: number;
  ph: number | null;
  tds: number | null;
  turbidity: number | null;
  water_level: number | null;
  humidity: number | null;
  temperature: number | null;
  ec: number | null;
  electric_current: number | null;
  reading_time: string;
  created_at: string;
  updated_at: string;
  sensor_system?: SensorSystem;
};

type SensorSystem = {
  id: number;
  device_id: number;
  system_type: 'clean_water' | 'dirty_water' | 'hydroponics_water';
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

// Real-time broadcast data structure
type SensorDataBroadcastPayload = {
  reading: SensorReading;
  device_id: number;
  system_type: 'clean_water' | 'dirty_water' | 'hydroponics_water';
};

// Store state structure
type SensorDataState = {
  cleanWater: SensorReading | null;
  dirtyWater: SensorReading | null;
  hydroponicsWater: SensorReading | null;
  loading: boolean;
  error: string | null;
  lastUpdated: {
    cleanWater: Date | null;
    dirtyWater: Date | null;
    hydroponicsWater: Date | null;
  };
  
  // Actions
  updateCleanWater: (reading: SensorReading) => void;
  updateDirtyWater: (reading: SensorReading) => void;
  updateHydroponicsWater: (reading: SensorReading) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
};

