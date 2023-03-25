import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { useGum } from '@gumhq/react-sdk';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

export function useGumSDK() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { networkConfiguration } = useNetworkConfiguration()
  const gumSDK = useGum(wallet, connection, {}, networkConfiguration)

  return gumSDK
}