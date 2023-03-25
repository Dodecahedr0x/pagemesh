import create, { State } from "zustand";

import { ProfileMetadata } from "@gumhq/sdk/src/profileMetadata"
import produce from "immer";

interface UserProfileStore extends State {
  profile?: ProfileMetadata
  set: (x: any) => void
}

const useUserProfileStore = create<UserProfileStore>((set, _get) => ({
  set: (fn) => set(produce(fn)),
}))

export default useUserProfileStore
