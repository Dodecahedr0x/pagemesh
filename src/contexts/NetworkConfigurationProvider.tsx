import { FC, ReactNode, createContext, useContext } from 'react';

import { Cluster } from '@solana/web3.js';
import { useLocalStorage } from '@solana/wallet-adapter-react';

export interface NetworkConfigurationState {
  networkConfiguration: Cluster;
  setNetworkConfiguration(networkConfiguration: Cluster): void;
}

export const NetworkConfigurationContext = createContext<NetworkConfigurationState>({} as NetworkConfigurationState);

export function useNetworkConfiguration(): NetworkConfigurationState {
  return useContext(NetworkConfigurationContext);
}

export const NetworkConfigurationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [networkConfiguration, setNetworkConfiguration] = useLocalStorage<Cluster>("network", "devnet");

  return (
    <NetworkConfigurationContext.Provider value={{ networkConfiguration, setNetworkConfiguration }}>{children}</NetworkConfigurationContext.Provider>
  );
};