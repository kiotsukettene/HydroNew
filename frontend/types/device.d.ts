export interface WifiNetwork {
  ssid: string;
  password?: string;
}


interface DeviceStore {
  devices: any[];
  loading: boolean;
  error: string | null;
  connectDevicetoWifi: (ssid: string, password?: string) => Promise<any>;
}