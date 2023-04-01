import { CgClose, CgProfile } from "react-icons/cg";
import { Dialog, Transition } from "@headlessui/react";
import { FC, Fragment } from "react";

import { Page } from "../../utils/types";
import { PageContentBlock } from "./PageContentBlock";
import React from "react";

interface Props {
  page: Page;
  isOpen: boolean;
  onClose: () => void;
}
export const PageModal: FC<Props> = ({ page, isOpen, onClose }) => {
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
              <Dialog.Panel className="absolute left-0 top-0 w-screen h-screen transform bg-base-300 transition-all">
                <div className="relative mt-5 ml-5 btn-group">
                  <div className="btn" onClick={onClose}>
                    <CgClose />
                  </div>
                </div>
                <div className={`flex flex-col ${page.className || ""}`}>
                  {page.content.blocks.map((e) => (
                    <PageContentBlock block={e} />
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
