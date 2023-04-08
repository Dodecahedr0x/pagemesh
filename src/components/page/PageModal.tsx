import { CgClose, CgProfile } from "react-icons/cg";
import { ContentBlock, Page } from "../../utils/types";
import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useCallback } from "react";
import { MdEdit, MdEditOff } from "react-icons/md";

import { AddBlockButton } from "./AddBlockButton";
import { GrEdit } from "react-icons/gr";
import Link from "next/link";
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
  isOpen: boolean;
  onClose: () => void;
}
export const PageModal: FC<Props> = ({ page, pageKey, isOpen, onClose }) => {
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

  console.log(page);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-secondary bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="absolute left-0 top-0 w-screen min-h-screen transform bg-base-300 transition-all">
                {modal}
                <div className="absolute mt-5 ml-5 btn-group">
                  <div className="btn" onClick={onClose}>
                    <CgClose />
                  </div>
                  {edit ? (
                    <Link
                      href={`/page?id=${query.id}&edit=${false}`}
                      className="btn btn-secondary"
                    >
                      <MdEditOff />
                    </Link>
                  ) : (
                    <Link
                      href={`/page?id=${query.id}&edit=${true}`}
                      className="btn btn-secondary"
                    >
                      <MdEdit />
                    </Link>
                  )}
                </div>
                <div className={`flex flex-col ${page?.className || ""}`}>
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
                    <AddBlockButton
                      choice={(block) => handleCreateBlock(block, 0)}
                    />
                  ) : null}
                  {page
                    ? page.content?.blocks.map((e, i) =>
                        edit ? (
                          <>
                            <PageContentBlock block={e} />
                            <AddBlockButton
                              choice={(block) =>
                                handleCreateBlock(block, i + 1)
                              }
                            />
                          </>
                        ) : (
                          <PageContentBlock key={i} block={e} />
                        )
                      )
                    : null}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
