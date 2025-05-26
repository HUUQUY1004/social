import { create } from "zustand";

export const useTokenStringee = create((set) => ({
  token: null,
  isConnected: false,
  setToken: (newToken) => set(() => ({ token: newToken })),
  setIsConnected: (newIsConnected) =>
    set(() => ({ isConnected: newIsConnected })),
}));
