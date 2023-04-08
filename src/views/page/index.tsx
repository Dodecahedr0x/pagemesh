// Next, React

import { AiFillEdit, AiFillEye } from "react-icons/ai";
import { FC, useEffect, useState } from "react";
import { Page, Profile } from "../../utils/types";

import { PageModal } from "../../components/page/PageModal";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { shortAddress } from "../../utils";
import { useGumSDK } from "../../hooks/useGumSDK";
import { usePage } from "../../hooks/usePage";
import { useRouter } from "next/router";

export const PageView: FC = ({}) => {
  const { query } = useRouter();
  const sdk = useGumSDK();
  const [isOpen, setIsOpen] = useState(false);
  const { page } = usePage(query?.id.toString());

  return (
    <div className="mx-auto p-4">
      <PageModal page={page} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <div className="flex flex-col">
        <div>
          {page ? (
            <div className="flex flex-col gap-3 p-3 bg-base-100 rounded-xl shadow-xl w-fit m-auto">
              <div className="flex flex-col gap-2 justify-between bg-base-200 rounded p-2">
                <div className="text-xl font-bold py-2">
                  {page.text_preview}
                </div>
                {page?.author ? (
                  <div className="flex gap-1">
                    <div>
                      <img
                        className="rounded-full w-6 h-6 m-auto"
                        src={page.author.avatar}
                      />
                    </div>
                    <div>{page.author.name}</div>
                    <div className="text-sm opacity-60 font-bold my-auto">
                      @{page.author.username}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm opacity-60 font-bold p-2">
                    {shortAddress(page.profilePublicKey)}
                  </div>
                )}
                <div className="btn-group py-1">
                  <div
                    className="btn btn-secondary"
                    onClick={() => {
                      setIsOpen(true);
                    }}
                  >
                    <AiFillEdit />
                  </div>
                  <div
                    className="btn btn-primary"
                    onClick={() => {
                      setIsOpen(true);
                    }}
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
