import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useEffect, useState } from "react";

import { Connection } from "@solana/web3.js";
import { ShdwDrive } from "@shadow-drive/sdk";

export function useShdwDrive() {
  const wallet = useWallet()
  const [drive, setDrive] = useState<ShdwDrive>();

  useEffect(() => {
    (async () => {
      if (wallet) {
        const drive = await new ShdwDrive(new Connection("https://rpc.helius.xyz/?api-key=d1593552-6d2e-4ef5-b897-856c3d96c316"), wallet).init();
        setDrive(drive);
      }
    })();
  }, [wallet.publicKey])

  return drive
}