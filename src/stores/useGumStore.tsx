import { StateStorage, persist } from 'zustand/middleware'
import create, { State } from "zustand";

import { GumDecodedUser } from "@gumhq/sdk/lib/user";
import { ProfileMetadata } from "@gumhq/sdk/src/profileMetadata"
import produce from "immer";

interface GumStore extends State {
  profile?: ProfileMetadata
  user?: GumDecodedUser | undefined
  users?: GumDecodedUser[]
  setDefaultUser: (x: GumDecodedUser) => void
}

const useGumStore = create<GumStore>(persist((set, _get) => ({
  setDefaultUser: (newUser: GumDecodedUser) => set(produce<GumStore>(state => {
    state.user = newUser
  }))
}), {
  name: 'bookmark-gum-store', // name of the item in the storage (must be unique)
  // storage: () => {}, // (optional) by default, 'localStorage' is used
}))

export default useGumStore
