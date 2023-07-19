import { create } from "zustand";
import { IUser } from "../types";

type Store = {
  authUser: IUser | null;
  setAuthUser: (user: IUser | null) => void;
};

const useStore = create<Store>((set) => ({
  authUser: null,
  setAuthUser: (user) => set((state) => ({ ...state, authUser: user })),
}));

export default useStore;
