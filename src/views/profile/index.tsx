import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useGum, useUser } from "@gumhq/react-sdk"

import { Cluster } from "@solana/web3.js";
import { CreateProfileButton } from "../../components/profile/CreateProfileButton";
import { FC } from "react";
import { SendTransaction } from '../../components/SendTransaction';
import { SendVersionedTransaction } from '../../components/SendVersionedTransaction';
import { SignMessage } from '../../components/SignMessage';
import { useGumSDK } from "../../hooks/useGumSDK";
import { useNetworkConfiguration } from "../../contexts/NetworkConfigurationProvider";

export const ProfileView: FC = ({ }) => {
  const wallet = useWallet()
  const gumSDK = useGumSDK()
  const data = useUser(gumSDK, wallet.publicKey)
  console.log(data);

  return (
    <div className="md:hero mx-auto p-4">
      <div className="md:hero-content flex flex-col">
        <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mt-10 mb-8">
          Basics
        </h1>
        {/* CONTENT GOES HERE */}
        <div className="text-center">
          <CreateProfileButton />
          <SendTransaction />
          <SendVersionedTransaction />
        </div>
      </div>
    </div>
  );
};
