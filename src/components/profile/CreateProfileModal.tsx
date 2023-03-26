import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useRef, useState } from 'react';

import { CgProfile } from "react-icons/cg"
import React from "react"
import { useGumSDK } from '../../hooks/useGumSDK';
import { useUser } from '@gumhq/react-sdk';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
  isOpen: boolean,
  onClose: () => void 
}
export const CreateProfileModal: FC<Props> = ({ isOpen, onClose }) => {
  const { publicKey } = useWallet();
  const sdk = useGumSDK()
  // const { user } = useUser(sdk)
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
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
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary sm:mx-0 sm:h-10 sm:w-10">
                      <CgProfile className="h-6 w-6 text-primary-content" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="h3" className="text-base font-semibold leading-6">
                        Create your 
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm">
                          Are you sure you want to deactivate your account? All of your data will be permanently
                          removed. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="btn btn-primary inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto"
                    onClick={onClose}
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                    onClick={onClose}
                    ref={cancelButtonRef}
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
  );
};
