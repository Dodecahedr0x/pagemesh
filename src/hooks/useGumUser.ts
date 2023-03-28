import { useEffect, useState } from 'react';

import { GumDecodedUser } from '@gumhq/sdk/lib/user';
import { useGumSDK } from './useGumSDK';
import useGumStore from '../stores/useGumStore';
import useUserProfileStore from '../stores/useGumStore';
import { useWallet } from '@solana/wallet-adapter-react';

export function useGumUser(): GumDecodedUser | undefined {
  return useGumStore(state => state.user)
}