import { create } from "zustand";

export const useUser = create((set) => ({
  currentUser: null,
  setCurrentUser: (newUser) => set(() => ({ currentUser: newUser })),
}));
