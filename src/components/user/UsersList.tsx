import { FC, useEffect, useState } from 'react';

import { CgProfile } from 'react-icons/cg';
import { GumDecodedUser } from '@gumhq/sdk/lib/user';
import { PublicKey } from '@solana/web3.js';
import React from "react"
import { UserItem } from './UserItem';
import { useCreateUser } from '@gumhq/react-sdk';
import { useGumSDK } from '../../hooks/useGumSDK';
import useGumStore from '../../stores/useGumStore';
import { useWallet } from '@solana/wallet-adapter-react';

export const UsersList: FC = () => {
  const { publicKey } = useWallet();
  const sdk = useGumSDK()
  const { user } = useGumStore()
  const [users, setUsers] = useState<GumDecodedUser[]>()
  const { create } = useCreateUser(sdk)

  useEffect(() => {
    async function fetchProfiles() {
      if(!user || !sdk || !publicKey || users) return

      setUsers(await sdk.user.getUserAccountsByAuthority(new PublicKey(publicKey)))
    }

    fetchProfiles()
  }, [user, sdk, publicKey, users])

  return (
    <div className="flex flex-col justify-center bg-base-200 p-3 rounded-xl shadow-xl">
      <div>
        Select the default user
      </div>
      {users && users.length > 0 ? <div className='flex flex-col rounded bg-base-100 rounded p-1'>
        {users?.map(user => <UserItem key={user.cl_pubkey} user={user} />)}
      </div> : null}
      <div className="flex flex-row justify-center">
        <div className="relative group items-center">
          <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
          <button
            className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
            onClick={() => create(publicKey)} disabled={!publicKey}
          >
            <CgProfile />
            <div className="hidden group-disabled:block ">
            Wallet not connected
            </div>
            <div className="block group-disabled:hidden" >
            Create User
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
