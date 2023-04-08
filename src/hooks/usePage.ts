import { useEffect, useMemo, useState } from "react";

import { Page } from "../utils/types";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { useGumSDK } from "./useGumSDK";

export function usePage(key?: PublicKey | string) {
  const sdk = useGumSDK();
  const publicKey = useMemo(() => {
    try {
      return new PublicKey(key?.toString());
    } catch (err) {}
  }, [key]);
  const [page, setPage] = useState<Page>();

  useEffect(() => {
    async function fetch() {
      if (!sdk || !publicKey) return;

      try {
        const postAccount = await sdk.post.get(publicKey);
        const { data } = await axios.get(postAccount.metadataUri);

        setPage({
          postPublicKey: key,
          profilePublicKey: postAccount.profile,
          metadataUri: postAccount.metadataUri,
          ...data,
        });
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, [publicKey, sdk]);

  useEffect(() => {
    async function fetch() {
      if (!sdk || !page?.profilePublicKey) return;

      try {
        const { metadata, ...postAccount } =
          await sdk.profileMetadata.getProfileMetadataByProfile(
            page.profilePublicKey
          );

        setPage((old) => ({
          ...old,
          author: { ...postAccount, ...(metadata as any).data },
        }));
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, [sdk]);

  return { page };
}
