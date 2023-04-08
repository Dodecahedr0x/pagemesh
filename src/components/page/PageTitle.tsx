import { CgCheck, CgClose, CgCross, CgProfile } from "react-icons/cg";
import { ContentBlock, Page } from "../../utils/types";
import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useCallback, useState } from "react";
import { MdEdit, MdEditOff } from "react-icons/md";

import { AddBlockButton } from "./AddBlockButton";
import { CheckIcon } from "@heroicons/react/outline";
import { GrEdit } from "react-icons/gr";
import Link from "next/link";
import { PageContentBlock } from "./PageContentBlock";
import { PublicKey } from "@solana/web3.js";
import React from "react";
import { notify } from "../../utils/notifications";
import { useAsyncActionsModal } from "../../hooks/useAsyncActionsModal";
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useShdwDrive } from "../../hooks/useShdwDrive";
import useShdwDriveStore from "../../stores/useShdwDriveStore";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  page?: Page;
  edit?: boolean;
}
export const PageTitle: FC<Props> = ({ page, edit }) => {
  const wallet = useWallet();
  const drive = useShdwDrive();
  const { bucket } = useShdwDriveStore();
  const sdk = useGumSDK();
  const { user } = useGumStore();
  const { setActions, nextStep, setError, modal } = useAsyncActionsModal({});
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(page?.text_preview);

  const handleChangeTitle = useCallback(async () => {
    setActions([
      {
        title: "Signing",
        description: "Signing the updated page",
      },
      {
        title: "Upload",
        description: "Uploading the updated page",
      },
      // {
      //   title: "Update",
      //   description: "Updating the Gum post",
      // },
    ]);

    try {
      const { authorship, ...unsignedContent } = page;
      unsignedContent.text_preview = title;
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
          page.metadataUri.split("/").pop()
        ),
        "v2"
      );
      nextStep();
      // const call = await sdk.post.update(
      //   page.metadataUri,
      //   page.postPublicKey,
      //   page.profilePublicKey,
      //   new PublicKey(user.cl_pubkey),
      //   wallet.publicKey
      // );
      // await call.rpc();
      // nextStep();
      setIsEditing(false);
    } catch (err) {
      notify({ type: "error", message: String(err) });
      setError();
    }
  }, [title, page]);

  return (
    <div className="flex flex-row m-auto gap-2 my-5">
      {modal}
      {isEditing ? (
        <div className="flex flex-row m-auto gap-2">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search…"
              className="input input-bordered"
              defaultValue={page?.text_preview}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button
              className="btn btn-square btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              <CgClose className="w-6 h-6" />
            </button>
            <button
              className="btn btn-square btn-success"
              onClick={() => handleChangeTitle()}
            >
              <CgCheck className="w-8 h-8" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="text-2xl font-bold">
            {page?.text_preview || "???"}
          </div>
          {edit ? (
            <div
              className="btn btn-ghost btn-xs my-auto"
              onClick={() => setIsEditing(true)}
            >
              <MdEdit />
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
