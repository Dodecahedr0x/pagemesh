import { ContentBlock, Page } from "../../utils/types";
import { FC, useCallback } from "react";

import { AddBlockButton } from "./AddBlockButton";
import { MdEdit } from "react-icons/md";
import { PageContentBlock } from "./PageContentBlock";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { useAsyncActionsModal } from "../../hooks/useAsyncActionsModal";
import useGumStore from "../../stores/useGumStore";
import { usePage } from "../../hooks/usePage";
import { useRouter } from "next/router";
import { useShdwDrive } from "../../hooks/useShdwDrive";
import useShdwDriveStore from "../../stores/useShdwDriveStore";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  page?: Page;
  pageKey?: PublicKey | string;
}
export const PageContent: FC<Props> = ({ page, pageKey }) => {
  const wallet = useWallet();
  const { profile } = useGumStore();
  const { query } = useRouter();
  const drive = useShdwDrive();
  const { bucket } = useShdwDriveStore();
  const { setActions, nextStep, setError, modal } = useAsyncActionsModal({});
  const { page: fetchedPage } = usePage(page ? undefined : pageKey);
  page = fetchedPage || page;

  const edit =
    query?.edit === "true" &&
    page?.profilePublicKey.toString() == profile?.profilePublicKey.toString();

  const handleCreateBlock = useCallback(
    async (block: ContentBlock, index: number) => {
      setActions([
        {
          title: "Signing",
          description: "Signing the updated page",
        },
        {
          title: "Upload",
          description: "Uploading the updated page",
        },
      ]);

      try {
        page.content.blocks.splice(index, 0, block);
        const { authorship, ...unsignedContent } = page;
        const signature = await wallet.signMessage(
          Buffer.from(JSON.stringify(unsignedContent, null, 2))
        );
        nextStep();
        await drive.editFile(
          new PublicKey(bucket),
          page.metadataUri,
          new File(
            [
              JSON.stringify({
                ...unsignedContent,
                authorship: {
                  signature,
                  publicKey: wallet.publicKey.toString(),
                },
              }),
            ],
            page.metadataUri.split("/").reduce((a, b) => b)
          ),
          "v2"
        );
        nextStep();
      } catch (err) {
        setError();
      }
    },
    []
  );

  return (
    <div className={`flex flex-col ${page?.className || ""}`}>
      {modal}
      <div className="flex flex-row m-auto gap-2">
        <div className="text-2xl font-bold my-5">
          {page?.text_preview || "???"}
        </div>
        {edit ? (
          <div className="btn btn-ghost btn-xs my-auto">
            <MdEdit />
          </div>
        ) : null}
      </div>
      {edit ? (
        <AddBlockButton choice={(block) => handleCreateBlock(block, 0)} />
      ) : null}
      {page
        ? page.content?.blocks.map((e, i) =>
            edit ? (
              <>
                <PageContentBlock block={e} />
                <AddBlockButton
                  choice={(block) => handleCreateBlock(block, i + 1)}
                />
              </>
            ) : (
              <PageContentBlock key={i} block={e} />
            )
          )
        : null}
    </div>
  );
};
