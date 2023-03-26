import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

import { GumDecodedUser } from '@gumhq/sdk/lib/user';
import { useGum } from '@gumhq/react-sdk';
import { useGumSDK } from './useGumSDK';
import { useNetworkConfiguration } from '../contexts/NetworkConfigurationProvider';

export function useGumUsers() {
  const sdk = useGumSDK()
  const {publicKey} = useWallet()
  const [users, setUsers] = useState<GumDecodedUser[]>()

  useEffect(() => {
    async function fetch() {
      setUsers(await sdk.user.getUserAccountsByAuthority(publicKey))
    }

    fetch()
  }, [sdk, publicKey])

  return gumSDK
}