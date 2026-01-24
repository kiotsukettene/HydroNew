// store/networkStore.ts
import { create } from "zustand";
import { NetInfoState } from "@react-native-community/netinfo";

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  details: NetInfoState["details"] | null;
  isPairingDevice: boolean; // Flag to ignore network alert during device pairing
  setNetworkState: (state: Partial<NetworkState>) => void;
  setIsPairingDevice: (isPairing: boolean) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  isInternetReachable: null,
  type: null,
  details: null,
  isPairingDevice: false,

  setNetworkState: (state) =>
    set((prev) => {
      const next = { ...prev, ...state };
      console.log("[NetworkStore]", next);
      return next;
    }),

  setIsPairingDevice: (isPairing) => {
    console.log("[NetworkStore] Setting isPairingDevice:", isPairing);
    set({ isPairingDevice: isPairing });
  },
}));