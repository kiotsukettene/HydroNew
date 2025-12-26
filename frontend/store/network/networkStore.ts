// store/networkStore.ts
import { create } from "zustand";
import { NetInfoState } from "@react-native-community/netinfo";

interface NetworkState {
  isConnected: boolean;
  isInternetReachable: boolean | null;
  type: string | null;
  details: NetInfoState["details"] | null;
  setNetworkState: (state: Partial<NetworkState>) => void;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  isInternetReachable: null,
  type: null,
  details: null,

  setNetworkState: (state) =>
    set((prev) => {
      const next = { ...prev, ...state };
      console.log("[NetworkStore]", next);
      return next;
    }),
}));
