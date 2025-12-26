// src/context/NetworkContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

interface NetworkContextProps {
  isConnected: boolean;
  type: string;
  state: NetInfoState | null;
}

export const NetworkContext = createContext<NetworkContextProps>({
  isConnected: true,
  type: "unknown",
  state: null,
});

export const NetworkProvider = ({ children }: { children: ReactNode }) => {
  const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState(state);
      console.log("Network change:", state); // logs every change
    });

    // fetch initial state
    NetInfo.fetch().then(state => {
      setNetworkState(state);
      console.log("Initial network state:", state);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected: networkState?.isConnected ?? false,
        type: networkState?.type ?? "unknown",
        state: networkState,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
