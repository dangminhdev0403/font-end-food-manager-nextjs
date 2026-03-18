"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number;
};

type GuestCartState = {
  cartItems: CartItem[];

  setCartItems: (updater: (prev: CartItem[]) => CartItem[]) => void;

  clearCart: () => void;

  addItem: (item: CartItem) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
};

export const useGuestCart = create<GuestCartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      /**
       * 🔥 SETTER (GIỐNG useState)
       */
      setCartItems: (updater) =>
        set((state) => ({
          cartItems: updater(state.cartItems),
        })),

      /**
       * 🔥 ADD ITEM
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
          cartItems: [...current, item],
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
       */
      removeItem: (productId) => {
        const current = get().cartItems;

        set({
          cartItems: current.filter(
            (item) => item.productId !== productId || item.minQuantity > 0,
          ),
        });
      },

      /**
       * 🔥 CLEAR CART
       */
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "guest-cart-storage",

      /**
       * 🔥 QUAN TRỌNG
       * dùng localStorage nhưng SSR-safe
       */
      storage: createJSONStorage(() => localStorage),

      /**
       * 🔥 OPTIONAL: chỉ persist cartItems
       */
      partialize: (state) => ({
        cartItems: state.cartItems,
      }),
    },
  ),
);
