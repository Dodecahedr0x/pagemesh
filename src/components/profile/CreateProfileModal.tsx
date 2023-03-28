import { Dialog, Transition } from '@headlessui/react'
import { FC, Fragment, useRef, useState } from 'react';
import { useCreateProfile, useUser } from '@gumhq/react-sdk';

import { CgProfile } from "react-icons/cg"
import Image from 'next/image';
import { PublicKey } from '@solana/web3.js';
import React from "react"
import { ShadowFile } from "@shadow-drive/sdk"
import { notify } from '../../utils/notifications';
import { useGumSDK } from '../../hooks/useGumSDK';
import useGumStore from '../../stores/useGumStore';
import { useShdwDrive } from '../../hooks/useShdwDrive';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
  isOpen: boolean,
  onClose: () => void
}
export const CreateProfileModal: FC<Props> = ({ isOpen, onClose }) => {
  const cancelButtonRef = useRef(null)
  const { publicKey } = useWallet();
  const drive = useShdwDrive()
  const sdk = useGumSDK()
  const store = useGumStore()
  const [name, setName] = useState("")
  const [nickname, setNickname] = useState("")
  const [bio, setBio] = useState("")
  const [avatar, setAvatar] = useState<File>()
  const [avatarImage, setAvatarImage] = useState("")
  const [creating, setCreating] = useState(false)
  const { create, isCreatingProfile, createProfileError } = useCreateProfile(sdk)

  const validProfile = avatarImage && drive && publicKey

  console.log(publicKey, isCreatingProfile, createProfileError, avatar)
  const handleCreate = async () => {
    if (!validProfile) return

    setCreating(true)
    console.log(`${Math.ceil(avatarImage.length / 1000)}KB`);

    try {
      const storageResponse = await drive.createStorageAccount(`Bookmark profile ${avatar.name}`, `${Math.ceil(avatarImage.length / 1000) + 2}KB`, "v2")
      console.log(storageResponse)
      const uploadAvatarResponse = await drive.uploadFile(new PublicKey(storageResponse.shdw_bucket), avatar)
      const uploadProfileResponse = await drive.uploadFile(new PublicKey(storageResponse.shdw_bucket), new File([JSON.stringify({
        name,
        bio,
        username: nickname,
        avatar: `https://shdw-drive.genesysgo.net/${storageResponse.shdw_bucket}/${avatar.name}`
      })], `profile.json`))
      console.log(uploadProfileResponse, `https://shdw-drive.genesysgo.net/${storageResponse.shdw_bucket}/profile.json`)
      await create(`https://shdw-drive.genesysgo.net/${storageResponse.shdw_bucket}/profile.json`, "Personal", new PublicKey(store.user.cl_pubkey), publicKey)
    } catch (err) {
      console.log(String(err))
      notify({ type: "error", message: `Error: ${err}` })
    } finally {
      setCreating(false)
    }
  }

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
                      <CgProfile className="h-6 w-6 text-primary-content" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center flex flex-col gap-2 sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title as="div" className="text-base font-semibold leading-6">
                        Create your profile
                      </Dialog.Title>
                      <div className='flex flex-col'>
                        <label className='label'>
                          <span className='label-text'>Name</span>
                        </label>
                        <input className="input" placeholder='Name...' onChange={e => setName(e.target.value)} />
                      </div>
                      <div className='flex flex-col'>
                        <label className='label'>
                          <span className='label-text'>Nickname</span>
                        </label>
                        <input className="input" placeholder='Nickname...' onChange={e => setNickname(e.target.value)} />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='label'>
                          <span className='label-text'>Biography</span>
                        </label>
                        <input className="input" placeholder='Biography...' onChange={e => setBio(e.target.value)} />
                      </div>
                      <div className='flex flex-col gap-1'>
                        <label className='label'>
                          <span className='label-text'>Avatar</span>
                        </label>
                        {avatar ? <Image className='rounded' src={avatarImage} alt={"Chosen avatar"} width={200} height={200} /> : null}
                        <input
                          className="block w-full text-sm text-secondary-content file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0 file:text-sm file:font-semibold
                            file:bg-secondary file:text-secondary-content hover:file:bg-secondary-focus"
                          type="file"
                          onChange={event => {
                            const file = event.target.files[0];
                            setAvatar(file)
                            const reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onloadend = () => {
                              setAvatarImage(reader.result.toString());
                            };
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className={`btn btn-primary ${isCreatingProfile ? "loading" : ""} ${validProfile ? "" : "disabled"} inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm sm:ml-3 sm:w-auto`}
                    onClick={handleCreate}
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
