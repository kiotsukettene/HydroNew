interface PumpConfig {
  pumpA: boolean;
  pumpB: boolean;
}

interface HydroponicSetupStore {
  loading: boolean;
  error: string | null;
  hydroponicSetups: HydroponicSetupPayload[]; 
  createHydroponicSetup: (data: HydroponicSetupPayload) => Promise<void>;
  fetchHydroponicSetups: (page?: number) => Promise<void>; 
  resetError: () => void;
}
