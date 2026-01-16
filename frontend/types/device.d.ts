export interface WifiNetwork {
  ssid: string;
  password?: string;
}

export interface DeviceStore {
  devices: any[];
  loading: boolean;
  error: string | null;

  connectDeviceToWifi: (ssid: string, password?: string, pairingToken?: string) => Promise<any>;
  getPairingToken: () => Promise<string | undefined>;
}


export type Device = {
  id: number;
  device_name: string;
  serial_number: string;
  model: string;
  firmware_version: string;
  status: string;
};

