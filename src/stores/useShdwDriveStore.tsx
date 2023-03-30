import create, { State } from "zustand";

import { persist } from 'zustand/middleware'
import produce from "immer";

interface ShdwDriveStore extends State {
  bucket?: string
  owner?: string
  setBucket: (bucket: string, owner: string) => void
}

const useShdwDriveStore = create<ShdwDriveStore>(persist((set, _get) => ({
  setBucket: (bucket: string, owner: string) => set(produce<ShdwDriveStore>(state => {
    state.bucket = bucket
    state.owner = owner
  }))
}), {
  name: 'bookmark-shdw-drive-store', // name of the item in the storage (must be unique)
}))

export default useShdwDriveStore
