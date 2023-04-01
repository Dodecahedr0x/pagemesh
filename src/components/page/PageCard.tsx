import { FC, useState } from "react";

import { CgProfile } from "react-icons/cg";
import { ExternalLinkIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { Page } from "../../utils/types";
import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

interface Props {
  page: Page;
}
export const PageCard: FC<Props> = ({ page }) => {
  console.log(page);

  return (
    <div className="flex flex-row justify-between gap-1 p-2 m-1 bg-neutral border-4 border-secondary-focus rounded-xl shadow-xl">
      <div className="text-xl font-xl my-auto">{page.text_preview}</div>
      <Link href={`/page?id=${page.postPublicKey}`}>
        <div className="btn btn-ghost-accent">
          <ExternalLinkIcon className="w-6 h-6" />
        </div>
      </Link>
    </div>
  );
};
