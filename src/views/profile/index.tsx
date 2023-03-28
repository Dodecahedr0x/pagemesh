import { FC, useEffect, useState } from "react";

import { CreateProfileButton } from "../../components/profile/CreateProfileButton";
import { GumDecodedProfile } from "@gumhq/sdk/lib/profile";
import { PublicKey } from "@solana/web3.js";
import React from "react"
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useProfile } from "@gumhq/react-sdk"
import { useWallet } from "@solana/wallet-adapter-react";

export const ProfileView: FC = ({ }) => {
  const { publicKey } = useWallet()
  const sdk = useGumSDK()
  const { user } = useGumStore()
  const [profiles, setProfiles] = useState<GumDecodedProfile[]>()
  const data = useProfile(sdk, publicKey)

  useEffect(() => {
    async function fetchProfiles() {
      if(!user) return

      setProfiles(await sdk.profile.getProfilesByUser(new PublicKey(publicKey)))
    }

    fetchProfiles()
  }, [user, sdk.profile, publicKey])

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Basics
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <div>
            {profiles?.map(profile => <div key={profile.cl_pubkey}>{profile.cl_pubkey}</div>)}
          </div>
          <CreateProfileButton />
        </div>
      </div>
    </div>
  );
};
