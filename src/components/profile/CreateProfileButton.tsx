import { FC, useState } from 'react';

import { CgProfile } from "react-icons/cg"
import { CreateProfileModal } from './CreateProfileModal';
import React from "react"
import { useWallet } from '@solana/wallet-adapter-react';

export const CreateProfileButton: FC = () => {
  const { publicKey } = useWallet();
  const [isOpen, setIsOpen ] = useState(false)

  return (
    <div className="flex flex-row justify-center">
      {isOpen ? <CreateProfileModal isOpen={isOpen} onClose={() => setIsOpen(false)} /> : null}
      <div className="relative group items-center">
        <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
        <button
          className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={() => setIsOpen(true)} disabled={!publicKey}
        >
          <CgProfile />
          <div className="hidden group-disabled:block ">
            Wallet not connected
          </div>
          <div className="block group-disabled:hidden" >
            Create profile
          </div>
        </button>
      </div>
    </div>
  );
};
