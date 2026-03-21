"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number;
  isPersisted: boolean; // 🔥 FIX: flag đúng chỗ
};

type GuestCartState = {
  cartItems: CartItem[];

  setCartItems: (updater: (prev: CartItem[]) => CartItem[]) => void;

  clearCart: () => void;
  addItem: (item: Omit<CartItem, "isPersisted" | "minQuantity">) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
};

export const useGuestCart = create<GuestCartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      /**
       * 🔥 SETTER
       */
      setCartItems: (updater) =>
        set((state) => ({
          cartItems: updater(state.cartItems),
        })),

      /**
       * 🔥 ADD ITEM (LOCAL → isPersisted = false)
       */
      addItem: (item) => {
        const current = get().cartItems;

        const exist = current.find((i) => i.productId === item.productId);

        if (exist) {
          set({
            cartItems: current.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          });
          return;
        }

        set({
          cartItems: [
            ...current,
            {
              ...item,
              quantity: 1,
              minQuantity: 0,
              isPersisted: false, // 🔥 KEY
            },
          ],
        });
      },

      /**
       * 🔥 UPDATE QUANTITY
       */
      updateQuantity: (productId, quantity) => {
        const current = get().cartItems;

        set({
          cartItems: current.map((item) => {
            if (item.productId !== productId) return item;

            if (quantity < item.minQuantity) return item;

            return { ...item, quantity };
          }),
        });
      },

      /**
       * 🔥 REMOVE ITEM
       * ❌ KHÔNG xoá nếu item từ server
       */
      removeItem: (productId) => {
        const current = get().cartItems;

        set({
          cartItems: current.filter(
            (item) => item.productId !== productId || item.isPersisted,
          ),
        });
      },

      /**
       * 🔥 CLEAR
       */
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "guest-cart-storage",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    },
  ),
);
