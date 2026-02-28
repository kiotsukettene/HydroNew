export interface WifiNetwork {
  ssid: string;
  password?: string;
}

export interface DeviceStore {
  devices: any[];
  loading: boolean;
  error: string | null;

  connectDeviceToWifi: (ssid: string, password?: string, pairingToken?: string) => Promise<any>;
  generateQrPayload: () => Promise<any>;
  pairDeviceByQr: (payload: { serial_number: string; device_name: string; model: string }) => Promise<any>;
  getPairingToken: () => Promise<string | undefined>;
  fetchDevice: (userId: number) => Promise<void>;
  setDevice: (device: any) => void;
  setDeviceAndPersist: (device: any, userId: number) => Promise<void>;
  unpairDevice: () => Promise<{ success: boolean; message: string }>;
}


export type Device = {
  id: number;
  device_name: string;
  serial_number: string;
  model: string;
  firmware_version: string;
  status: string;
};
