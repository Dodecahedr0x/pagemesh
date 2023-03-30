import React, { useEffect, useState } from "react"
import { useCreateUser, useUser } from "@gumhq/react-sdk";

import { CgProfile } from "react-icons/cg";
import { GumDecodedUser } from "@gumhq/sdk/lib/user";
import { Menu } from "@headlessui/react";
import { notify } from "../../utils/notifications";
import { shortAddress } from "../../utils";
import { useCallback } from "react";
import { useGumSDK } from "../../hooks/useGumSDK";
import useGumStore from "../../stores/useGumStore";
import { useWallet } from "@solana/wallet-adapter-react";

export function UserPicker() {  
  const { user, setDefaultUser } = useGumStore()
  const { publicKey } = useWallet()
  const sdk = useGumSDK()
  const { create, userPDA, isCreatingUser } = useCreateUser(sdk)
  const [users, setUsers] = useState<GumDecodedUser[]>()

  const fetchUsers = useCallback(async function() {
    if(!publicKey || !sdk) return

    setUsers((await sdk.user.getUserAccountsByAuthority(publicKey)).sort((a,b) => a.cl_pubkey > b.cl_pubkey ? 1 : -1))
  }, [sdk, publicKey])

  const handleCreateUser = useCallback(async () => {
    try {
      await create(publicKey)
      await fetchUsers()
    } catch(err) {
      notify({ type: "error", message: `Failed to create user: ${String(err)}` })
    }
  }, [create, publicKey, fetchUsers])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  if(!publicKey) {
    return null
  }
  if(!users || users.length === 0) {
    return <div className="btn btn-primary btn-sm" onClick={handleCreateUser}>Create user</div>
  }
  
  return <Menu>
    {({ open }) => (
      <>
        <Menu.Button
          className={`btn btn-primary btn-sm flex flex-row justify-between`}
        >
          <CgProfile className="w-6 h-6" />
          <div>{user && user.authority === publicKey.toString() ? shortAddress(user.cl_pubkey) : "Pick a user"}</div>
        </Menu.Button>
        <Menu.Items
          className={`${
            open ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-primary ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          {users.map(u => 
            <Menu.Item key={u.cl_pubkey.toString()} disabled={u.cl_pubkey === user?.cl_pubkey}>
              <button
                className={`block px-4 py-2 text-sm text-primary-content w-full text-left hover:bg-primary-focus`}
                onClick={() => setDefaultUser(u)}
              >
                {shortAddress(u.cl_pubkey)}
              </button>
            </Menu.Item>
          )}
        </Menu.Items>
      </>
    )}
  </Menu>
}