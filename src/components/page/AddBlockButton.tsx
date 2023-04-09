import { CgClose, CgProfile } from "react-icons/cg";
import { Combobox, Dialog, Listbox, Transition } from "@headlessui/react";
import { ContentBlock, Page } from "../../utils/types";
import { FC, Fragment, useState } from "react";

import { ContentBlockType } from "../../utils/constants";
import { PageContentBlock } from "./PageContentBlock";
import { PageContentBlockInput } from "./PageContentBlockInput";
import { PlusCircleIcon } from "@heroicons/react/outline";
import React from "react";

const blockTypes: { name: string; id: ContentBlockType }[] = [
  { name: "Tweet", id: ContentBlockType.Microblog },
  // { name: "YouTube", id: "video" },
];

interface Props {
  choice: (block: ContentBlock) => void;
}
export const AddBlockButton: FC<Props> = ({ choice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(blockTypes[0]);

  return (
    <>
      <div className="">
        {/* <hr className="relative divider" /> */}
        <div
          className="btn btn-primary btn-circle"
          onClick={() => setIsOpen(true)}
        >
          <PlusCircleIcon className=" w-8 h-8" />
        </div>
      </div>
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
                <Dialog.Panel className="relative transform bg-base-300 transition-all rounded shadow p-3">
                  <div className="flex flex-col gap-5 justify-center rounded">
                    <div className="text-xl">Add a block</div>
                    <div>
                      <div className="text-start text-xs opacity-60">
                        Block type
                      </div>
                      <div className="rounded bg-base-100">
                        <Listbox
                          value={selectedType}
                          onChange={setSelectedType}
                        >
                          <Listbox.Button
                            className={`p-2 bg-accent w-full rounded`}
                          >
                            {selectedType.name}
                          </Listbox.Button>
                          <Listbox.Options>
                            {blockTypes.map((t) => (
                              <Listbox.Option key={t.id} value={t}>
                                {({ active, selected }) => (
                                  <div
                                    className={`bg-base-100 hover:bg-base-200 p-2 rounded ${
                                      selected ? "bg-base-300" : ""
                                    }`}
                                  >
                                    {t.name}
                                  </div>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Listbox>
                      </div>
                    </div>
                    <PageContentBlockInput
                      type={selectedType.id}
                      choice={choice}
                      onClose={() => setIsOpen(false)}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};
