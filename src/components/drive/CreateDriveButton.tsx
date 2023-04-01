import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment, useState } from "react";

import { GrDatabase } from "react-icons/gr";
import React from "react";
import numeral from "numeral";
import { useAsyncActionsModal } from "../../hooks/useAsyncActionsModal";
import { useShdwDrive } from "../../hooks/useShdwDrive";
import { useWallet } from "@solana/wallet-adapter-react";

export const CreateDriveButton: FC = () => {
  const { publicKey } = useWallet();
  const drive = useShdwDrive();
  const [storage, setStorage] = useState(2 ** 15);
  const [isOpen, setIsOpen] = useState(false);

  const { setActions, nextStep, setError, modal } = useAsyncActionsModal({
    onSuccess: () => setIsOpen(false),
  });

  const handleCreate = async () => {
    setActions([
      {
        title: "Creating storage account",
        description: "Creating a new storage account on ShdwDrive",
      },
    ]);

    try {
      const createStorageResponse = await drive.createStorageAccount(
        `Bookmark account`,
        `${storage}KB`,
        "v2"
      );
      nextStep();
    } catch (err) {
      setError();
    }
  };

  return (
    <div className="flex flex-row justify-center">
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}
        >
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg text-left shadow-xl bg-base-300 transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  {modal}
                  <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary sm:mx-0 sm:h-10 sm:w-10">
                        <GrDatabase
                          className="h-6 w-6 text-primary-content"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 text-center flex flex-col gap-2 w-full sm:mt-0 sm:ml-4 sm:text-left">
                        <Dialog.Title
                          as="div"
                          className="text-base font-semibold leading-6"
                        >
                          Create your profile
                        </Dialog.Title>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="label">
                            <span className="label-text">Storage size</span>
                          </label>
                          <input
                            className="range"
                            min={0}
                            max={2 ** 16}
                            type="range"
                            onChange={(event) =>
                              setStorage(Number(event.target.value))
                            }
                          />
                          <div>{numeral(storage * 1000).format("0.00b")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className={`btn btn-primary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto`}
                      onClick={handleCreate}
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                      onClick={() => setIsOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="relative group items-center">
        <div
          className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"
        ></div>
        <button
          className="flex flex-row gap-2 group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
          onClick={() => setIsOpen(true)}
          disabled={!publicKey}
        >
          <GrDatabase />
          <div className="hidden group-disabled:block ">
            Wallet not connected
          </div>
          <div className="block group-disabled:hidden">Create drive</div>
        </button>
      </div>
    </div>
  );
};
