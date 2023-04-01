import { FC, useEffect, useState } from "react";

import { CreateDriveButton } from "./CreateDriveButton";
import { Decimal } from "decimal.js";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { StorageAccount } from "@shadow-drive/sdk";
import axios from "axios";
import numeral from "numeral";
import { shortAddress } from "../../utils";
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useShdwDrive } from "../../hooks/useShdwDrive";
import useShdwDriveStore from "../../stores/useShdwDriveStore";
import { useWallet } from "@solana/wallet-adapter-react";

export const DrivesList: FC = () => {
  const { publicKey } = useWallet();
  const sdk = useGumSDK();
  const { user } = useGumStore();
  const drive = useShdwDrive();
  const { setBucket, bucket } = useShdwDriveStore();
  const [storageAccounts, setStorageAccounts] =
    useState<(StorageAccount & { publicKey: PublicKey })[]>();

  useEffect(() => {
    setStorageAccounts(undefined);
  }, [user, publicKey]);

  useEffect(() => {
    async function fetch() {
      if (!publicKey || !drive) return;

      const accounts = await drive.getStorageAccounts("v2");

      setStorageAccounts(
        accounts.map((account) => ({
          ...account.account,
          publicKey: account.publicKey,
        }))
      );
    }

    fetch();
  }, [user, sdk, publicKey, drive]);

  console.log(storageAccounts);

  return (
    <div className="flex flex-col justify-center bg-base-200 p-3 rounded-xl shadow-xl">
      <div className="text-lg font-bold">Select the default Shdw Drive</div>
      {storageAccounts && storageAccounts.length > 0 ? (
        <div className="flex flex-col rounded bg-base-100 rounded p-1">
          {storageAccounts?.map((account) => (
            <div
              key={account.publicKey.toString()}
              className={`flex flex-row gap-3 justify-between rounded p-1 hover:bg-accent-focus ${
                account.publicKey.toString() === bucket ? "bg-accent" : ""
              }`}
              onClick={() =>
                setBucket(account.publicKey.toString(), publicKey.toString())
              }
            >
              <div className="flex flex-col text-start">
                <div className="text-ellipsis">{account.identifier}</div>
                <div className="text-xs opacity-60">
                  {shortAddress(account.publicKey)}
                </div>
              </div>
              <div>
                {numeral(
                  new Decimal(account.storage?.toString() || "0").toString()
                ).format("0.00b")}
              </div>
            </div>
          ))}
        </div>
      ) : null}
      <CreateDriveButton />
    </div>
  );
};
