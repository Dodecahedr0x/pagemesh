// Next, React

import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { FC, useEffect, useState } from "react";
import { Page, Profile } from "../../utils/types";

import { PageCard } from "../../components/page/PageCard";
import { PageModal } from "../../components/page/PageModal";
import { PublicKey } from "@solana/web3.js";
import { RequestAirdrop } from "../../components/RequestAirdrop";
import axios from "axios";
import { shortAddress } from "../../utils";
import { useAsyncActionsModal } from "../../hooks/useAsyncActionsModal";
import { useCreatePost } from "@gumhq/react-sdk";
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useRouter } from "next/router";
import { useShdwDrive } from "../../hooks/useShdwDrive";
import useShdwDriveStore from "../../stores/useShdwDriveStore";
import { useWallet } from "@solana/wallet-adapter-react";

export const PageView: FC = ({}) => {
  const { query } = useRouter();
  const { publicKey, signMessage } = useWallet();
  const sdk = useGumSDK();
  const { profile } = useGumStore();
  const drive = useShdwDrive();
  const { bucket } = useShdwDriveStore();
  const { create } = useCreatePost(sdk);
  const [page, setPage] = useState<Page>();
  const [author, setAuthor] = useState<Profile>();
  const [isOpen, setIsOpen] = useState(false);
  const { setActions, nextStep, setError, modal } = useAsyncActionsModal({});

  useEffect(() => {
    async function fetch() {
      if (!sdk || !query?.id || page) return;

      try {
        const key = new PublicKey(query.id);
        const postAccount = await sdk.post.get(key);
        const { data } = await axios.get(postAccount.metadataUri);
        console.log(postAccount, data, key);

        setPage({
          postPublicKey: key,
          profilePublicKey: postAccount.profile,
          metadatauri: postAccount.metadatauri,
          ...data,
        });
        setIsOpen(true);
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, [query, sdk]);

  useEffect(() => {
    async function fetch() {
      if (!sdk || !page?.profilePublicKey) return;

      try {
        const key = new PublicKey(query.id);
        const { metadata, ...postAccount } =
          await sdk.profileMetadata.getProfileMetadataByProfile(
            page.profilePublicKey
          );
        const { data } = await axios.get(postAccount.metadatauri);
        console.log(postAccount, data, key);

        setAuthor({ ...postAccount, ...(metadata as any).data });
      } catch (err) {
        console.log(err);
      }
    }

    fetch();
  }, [query, sdk]);

  console.log(page, author);

  return (
    <div className="mx-auto p-4">
      {modal}
      <PageModal page={page} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex flex-col">
        <div>
          {page ? (
            <div className="flex flex-col gap-3 p-3 bg-base-100 rounded-xl shadow-xl w-fit m-auto">
              <div className="flex flex-col gap-2 justify-between bg-base-200 rounded p-2">
                <div className="text-xl font-bold py-2">
                  {page.text_preview}
                </div>
                {author ? (
                  <div className="flex gap-1">
                    <div>
                      <img
                        className="rounded-full w-6 h-6 m-auto"
                        src={author.avatar}
                      />
                    </div>
                    <div>{author.name}</div>
                    <div className="text-sm opacity-60 font-bold my-auto">
                      @{author.username}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm opacity-60 font-bold p-2">
                    {shortAddress(page.profilePublicKey)}
                  </div>
                )}
                <div className="btn-group py-1">
                  <div className="btn btn-secondary">
                    <AiFillEdit />
                  </div>
                  <div
                    className="btn btn-primary"
                    onClick={() => setIsOpen(true)}
                  >
                    <AiFillEye />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-row justify-center">
          <div className="relative group items-center"></div>
        </div>
      </div>
    </div>
  );
};
