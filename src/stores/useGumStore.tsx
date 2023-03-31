import create, { State } from "zustand";

import { GumDecodedUser } from "@gumhq/sdk/lib/user";
import { Profile } from "../utils/types";
import { ProfileMetadataType } from '@gumhq/sdk/lib/profileMetadata';
import { persist } from 'zustand/middleware'
import produce from "immer";

interface GumStore extends State {
  profile?: Profile
  user?: GumDecodedUser | undefined
  setDefaultUser: (x: GumDecodedUser) => void
  setDefaultProfile: (x: Profile) => void
  reset: () => void
}

const useGumStore = create<GumStore>(persist((set, _get) => ({
  setDefaultUser: (newUser: GumDecodedUser) => set(produce<GumStore>(state => {
    state.user = newUser
    state.profile = undefined
  })),
  setDefaultProfile: (newProfile: Profile) => set(produce<GumStore>(state => {
    state.profile = newProfile
  })),
  reset: () => set(produce<GumStore>(state => {
    state.user = undefined
    state.profile = undefined
  }))
}), {
  name: 'bookmark-gum-store', // name of the item in the storage (must be unique)
  // storage: () => {}, // (optional) by default, 'localStorage' is used
}))

export default useGumStore
