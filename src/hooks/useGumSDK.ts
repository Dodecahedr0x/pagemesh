import { useConnection, useWallet } from '@solana/wallet-adapter-react';

import { GRAPHQL_ENDPOINTS } from '@gumhq/sdk';
import { GraphQLClient } from "graphql-request"
import { useGum } from '@gumhq/react-sdk';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

export function useGumSDK() {
  const wallet = useWallet()
  const { connection } = useConnection()
  const { networkConfiguration } = useNetworkConfiguration()
  const gqlClient = new GraphQLClient(GRAPHQL_ENDPOINTS.devnet)
  const gumSDK = useGum(wallet, connection, {}, networkConfiguration, gqlClient)

  return gumSDK
}