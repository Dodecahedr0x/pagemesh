import { FC, useState } from 'react';

import { CgProfile } from "react-icons/cg"
import { CreateProfileModal } from './CreateProfileModal';
import Image from 'next/image';
import { Profile } from '../../utils/types';
import { ProfileMetadataType } from '@gumhq/sdk/lib/profileMetadata';
import React from "react"
import useGumStore from '../../stores/useGumStore';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
  profile: Profile
}
export const ProfileItem: FC<Props> = ({ profile }) => {
  const { profile: selectedProfile, setDefaultProfile } = useGumStore()
  console.log(profile, selectedProfile);
  
  return (
    <div className={`flex flex-row gap-2 w-full justify-between p-1 min-w-48 ${selectedProfile?.profile === profile.profile ? "bg-success" : ""}`} onClick={() => setDefaultProfile(profile)}>
      <div className='my-auto w-16'>
        <img src={profile.avatar}/>
      </div>
      <div className='flex flex-col justify-start text-start w-full'>
        <div>{profile.name}</div>
        <div className='text-xs opacity-60'>@{profile.username}</div>
      </div>
      <div className="my-auto">
        {profile.profileNamespace.toUpperCase()}
      </div>
      {/* <div>{selectedProfile?.name || "???"}</div> */}
    </div>
  );
};
