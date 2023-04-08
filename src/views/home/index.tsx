// Next, React

import { APP_NAME, ContentBlockType } from "../../utils/constants";
import { FC, useEffect, useState } from "react";

import { Page } from "../../utils/types";
import { PageCard } from "../../components/page/PageCard";
import { PublicKey } from "@solana/web3.js";
import { RequestAirdrop } from "../../components/RequestAirdrop";
import { useAsyncActionsModal } from "../../hooks/useAsyncActionsModal";
import { useCreatePost } from "@gumhq/react-sdk";
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useShdwDrive } from "../../hooks/useShdwDrive";
import useShdwDriveStore from "../../stores/useShdwDriveStore";
import { useWallet } from "@solana/wallet-adapter-react";

export const HomeView: FC = ({}) => {
  const { publicKey, signMessage } = useWallet();
  const sdk = useGumSDK();
  const { profile } = useGumStore();
  const drive = useShdwDrive();
  const { bucket } = useShdwDriveStore();
  const { create } = useCreatePost(sdk);
  const [pages, setPages] = useState<Page[]>();
  const { setActions, nextStep, setError, modal } = useAsyncActionsModal({});

  useEffect(() => {
    if (publicKey && sdk && profile) {
      async function fetch() {
        const posts = await sdk.post.getPostsByProfile(
          new PublicKey(profile.profilePublicKey)
        );

        setPages(
          posts
            .map((post) => ({
              postPublicKey: post.cl_pubkey,
              metadataUri: post.metadatauri,
              ...(post.metadata as any).data,
            }))
            .filter((post) => post.contentType === "personal_page")
        );
      }
      fetch();
    }
  }, [publicKey, sdk]);

  const handleCreate = async () => {
    setActions([
      {
        title: "Sign",
        description: "Sign the default page",
      },
      {
        title: "Upload",
        description: "Uploading the default page",
      },
      {
        title: "Creating post",
        description: "Creating the Gum post",
      },
    ]);

    try {
      const filename = `page-${new Date().toISOString()}.json`;
      const postContent = {
        content: { blocks: [] },
        type: "blocks",
        contentType: ContentBlockType.PersonalPage,
        text_preview: "Default Bookmark page",
      };
      const signature = await signMessage(
        Buffer.from(JSON.stringify(postContent))
      );
      nextStep();
      await drive.uploadFile(
        new PublicKey(bucket),
        new File(
          [
            JSON.stringify({
              ...postContent,
              authorship: { signature, publicKey: publicKey.toString() },
            }),
          ],
          filename
        )
      );
      nextStep();
      await create(
        `https://shdw-drive.genesysgo.net/${bucket}/${filename}`,
        new PublicKey(profile.profilePublicKey),
        new PublicKey(profile.userPublicKey),
        publicKey
      );
      nextStep();
    } catch (err) {
      setError();
    }
  };

  return (
    <div className="md:hero mx-auto p-4">
      {modal}
      <div className="md:hero-content flex flex-col">
        <div className="mt-6">
          <h1 className="text-center text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-fuchsia-500 mb-4">
            {APP_NAME}
          </h1>
        </div>
        <div>
          {pages ? pages.map((page) => <PageCard page={page} />) : null}
        </div>
        <div className="flex flex-row justify-center">
          <div className="relative group items-center">
            <div
              className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
            ></div>
            <button
              className="flex flex-row gap-2  group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
              onClick={() => handleCreate()}
            >
              <div className="hidden group-disabled:block ">
                Wallet not connected
              </div>
              <div className="block group-disabled:hidden">
                Create a new page
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-2">
          <RequestAirdrop />
        </div>
      </div>
    </div>
  );
};
