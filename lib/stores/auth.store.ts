"use client";

import { create } from "zustand";

type AuthState = {
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoginOpen: false,
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),
}));
