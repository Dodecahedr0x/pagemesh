import {
  AiFillCheckCircle,
  AiFillClockCircle,
  AiFillCloseCircle,
} from "react-icons/ai";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";

import { CgProfile } from "react-icons/cg";
import React from "react";
import { notify } from "../utils/notifications";

export interface Action {
  title?: string;
  description?: string;
}
type Status = "idle" | "running" | "finished" | "failed";

export const useAsyncActionsModal = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void;
  onError?: () => void;
}) => {
  const cancelButtonRef = useRef(null);
  const [actions, setActions] = useState<Action[] | undefined>();
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<Status[]>(
    Array(actions?.length || 0).fill("idle")
  );

  useEffect(() => {
    if (actions && actions.length > 0) {
      setCurrentStep(0);
      setStatus((old) => {
        old = Array(actions?.length || 0).fill("idle");
        old[0] = "running";
        return old;
      });
    }
  }, [actions]);
  const reset = () => {
    setStatus(Array(actions?.length || 0).fill("idle"));
    setCurrentStep(0);
    setActions(undefined);
  };

  const nextStep = async () => {
    setCurrentStep((oldStep) => {
      setStatus((old) => {
        old[oldStep] = "finished";
        old[oldStep + 1] = "running";
        return [...old];
      });
      return oldStep + 1;
    });
  };

  const statusSymbol = (s: Status) => {
    switch (s) {
      case "idle":
        return <AiFillClockCircle className="w-10 h-10 m-auto" />;
      case "running":
        return <div className="btn btn-circle loading m-auto"></div>;
      case "failed":
        return <AiFillCloseCircle className="w-10 h-10 m-auto text-error" />;
      case "finished":
        return <AiFillCheckCircle className="w-10 h-10 m-auto text-success" />;
      default:
        return <AiFillCloseCircle className="w-10 h-10 m-auto text-error" />;
    }
  };

  const modal = (
    <Transition.Root show={!!actions} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={reset}
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
                <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary sm:mx-0 sm:h-10 sm:w-10">
                      <CgProfile
                        className="h-6 w-6 text-primary-content"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="mt-3 w-full text-center flex flex-col gap-2 sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="div"
                        className="text-base font-semibold leading-6"
                      >
                        Create your profile
                      </Dialog.Title>
                      <table className="table w-full rounded">
                        <thead>
                          <tr className="rounded-none">
                            <th>Status</th>
                            <th>Description</th>
                          </tr>
                        </thead>
                        <tbody>
                          {actions?.map((e, i) => (
                            <tr key={e.description + i}>
                              <th>{statusSymbol(status[i])}</th>
                              <th>
                                <div className="flex flex-col gap-1">
                                  <div className="">
                                    {e.title || ""} {i}
                                  </div>
                                  <div className="text-xs opacity-60">
                                    {e.description || ""}
                                  </div>
                                </div>
                              </th>
                            </tr>
                          )) || null}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  {currentStep === actions?.length || 0 ? (
                    <button
                      type="button"
                      className="btn btn-secondary mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                      onClick={() => {
                        reset();
                        onSuccess && onSuccess();
                      }}
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary mt-3 inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:mt-0 sm:w-auto"
                      onClick={reset}
                      ref={cancelButtonRef}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );

  return {
    actions,
    modal,
    nextStep,
    setActions,
    setError: () => {
      setCurrentStep((oldStep) => {
        setStatus((old) => {
          old[oldStep] = "failed";
          return [...old];
        });
        return oldStep;
      });
    },
  };
};
