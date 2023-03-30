import { FC, useEffect, useState } from 'react';

import { CreateProfileButton } from './CreateProfileButton';
import { Profile } from '../../utils/types';
import { ProfileItem } from './ProfileItem';
import { PublicKey } from '@solana/web3.js';
import React from "react"
import axios from 'axios'
import { useGumSDK } from '../../hooks/useGumSDK';
import useGumStore from '../../stores/useGumStore';
import { useWallet } from '@solana/wallet-adapter-react';

export const ProfilesList: FC = () => {
  const { publicKey } = useWallet();
  const sdk = useGumSDK()
  const { user } = useGumStore()
  const [profiles, setProfiles] = useState<Profile[]>()

  useEffect(() => {
    async function fetchProfiles() {
      if(!user || !sdk || !publicKey || profiles) return

      const accounts = await sdk.profile.getProfilesByUser(new PublicKey(publicKey))
      setProfiles(await Promise.all(accounts.map(async account => {
        const graphMetadata = await sdk.profileMetadata.getProfileMetadataByProfile(new PublicKey(account.cl_pubkey))
        const { data } = await axios.get(graphMetadata.metadatauri)
        
        return {
          ...account,
          ...graphMetadata,
          ...data,
        }
      })))
      // setProfiles()
    }

    fetchProfiles()
  }, [user, sdk, publicKey, profiles])

  return (
    <div className="flex flex-col justify-center bg-base-200 p-3 rounded-xl shadow-xl">
      <div className='flex flex-col rounded bg-base-100 rounded p-1'>
        {profiles?.map(profile => <ProfileItem key={profile.profile} profile={profile} />)}
      </div>
      <CreateProfileButton />
    </div>
  );
};
