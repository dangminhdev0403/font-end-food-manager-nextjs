import { create } from "zustand";
import { persist } from "zustand/middleware";

type SessionState = {
  guestToken?: string;
  orderId?: number;
  tableId?: number;
  tableName?: string;
  hasHydrated: boolean;

  setSession: (data: Partial<SessionState>) => void;
  setHasHydrated: (state: boolean) => void;
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      guestToken: undefined,
      orderId: undefined,
      tableId: undefined,
      tableName: undefined,
      hasHydrated: false,

      setSession: (data) => set((state) => ({
          ...state,
          ...data,
        })),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "session-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
