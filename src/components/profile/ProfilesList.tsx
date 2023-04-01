import { FC, useEffect, useState } from "react";

import { CreateProfileButton } from "./CreateProfileButton";
import { Profile } from "../../utils/types";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useWallet } from "@solana/wallet-adapter-react";

export const ProfilesList: FC = () => {
  const { publicKey } = useWallet();
  const sdk = useGumSDK();
  const { user, profile: selectedProfile, setDefaultProfile } = useGumStore();
  const [profiles, setProfiles] = useState<Profile[]>();

  useEffect(() => {
    setProfiles(undefined);
  }, [user, publicKey]);

  useEffect(() => {
    console.log("fetch profiles");
    async function fetchProfiles() {
      console.log(
        profiles,
        profiles?.filter((p) => p.userPublicKey === user.cl_pubkey)
      );

      if (!user || !sdk || !publicKey || profiles) return;

      const accounts = await sdk.profile.getProfilesByUser(
        new PublicKey(publicKey)
      );
      console.log(accounts);

      setProfiles(
        await Promise.all(
          accounts
            .map((e) => ({
              userPublicKey: e.username,
              profileNamespace: Object.keys(JSON.parse(e.namespace))[0],
              profilePublicKey: e.cl_pubkey,
            }))
            .filter((e) => e.userPublicKey === user.cl_pubkey)
            .map(async (account) => {
              const { metadata, ...graphMetadata } =
                await sdk.profileMetadata.getProfileMetadataByProfile(
                  new PublicKey(account.profilePublicKey)
                );

              return {
                ...user,
                ...account,
                ...graphMetadata,
                ...(metadata as any).data,
              };
            })
        )
      );
    }

    fetchProfiles();
  }, [user, sdk, publicKey, profiles]);

  return (
    <div className="flex flex-col justify-center bg-base-200 p-3 rounded-xl shadow-xl">
      <div className="text-lg font-bold">Select the default profile</div>
      {profiles && profiles.length > 0 ? (
        <div className="flex flex-col rounded bg-base-100 rounded p-1">
          {profiles?.map((profile) => (
            <div
              className={`flex flex-row gap-2 justify-between m-1 rounded p-1 ${
                selectedProfile?.profile === profile.profile ? "bg-success" : ""
              }`}
              onClick={() => setDefaultProfile(profile)}
            >
              <div className="my-auto w-16">
                <img className="rounded" src={profile.avatar} />
              </div>
              <div className="flex flex-col justify-start text-start w-full">
                <div>{profile.name}</div>
                <div className="text-xs opacity-60">@{profile.username}</div>
              </div>
              <div className="my-auto">
                {profile.profileNamespace.toUpperCase()}
              </div>
              {/* <div>{selectedProfile?.name || "???"}</div> */}
            </div>
          ))}
        </div>
      ) : null}
      <CreateProfileButton />
    </div>
  );
};
