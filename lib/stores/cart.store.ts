"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number; // 🔥 giữ lại
};

type CartState = {
  guestToken?: string;
  tableId?: number;
  tableName?: string;
  items: CartItem[];
  orderId?: number;

  initialized: boolean;

  setGuestToken: (token: string) => void;
  setTableId: (id: number) => void;
  setTableName: (name: string) => void;
  setOrderId: (id: number) => void;

  initFromServer: (items: CartItem[]) => void;

  addItem: (item: Omit<CartItem, "minQuantity">) => void;
  updateQuantity: (id: number, quantity: number) => void;
  removeItem: (id: number) => void;

  clearCart: () => void;

  total: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderId: undefined,
      initialized: false,
      setGuestToken: (token) => set({ guestToken: token }),
      setTableId: (id) => set({ tableId: id }),
      setTableName: (name) => set({ tableName: name }),
      setOrderId: (id) => set({ orderId: id }),

      /* 🔥 INIT từ backend */
      initFromServer: (serverItems) => {
        if (get().initialized) return;

        set({
          items: serverItems.map((item) => ({
            ...item,
            minQuantity: item.quantity,
          })),
          initialized: true,
        });
      },

      /* ➕ ADD */
      addItem: (item) => {
        const items = get().items;
        const exist = items.find((i) => i.productId === item.productId);

        if (exist) {
          set({
            items: items.map((i) =>
              i.productId === item.productId
                ? { ...i, quantity: i.quantity + 1 }
                : i,
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                ...item,
                minQuantity: 0, // 🔥 item mới
              },
            ],
          });
        }
      },

      /* 🔄 UPDATE */
      updateQuantity: (id, quantity) => {
        set({
          items: get().items.map((i) => {
            if (i.productId !== id) return i;
            if (quantity < i.minQuantity) return i;

            return { ...i, quantity };
          }),
        });
      },

      /* ❌ REMOVE */
      removeItem: (id) => {
        set({
          items: get().items.filter(
            (i) => i.productId !== id || i.minQuantity > 0,
          ),
        });
      },

      clearCart: () => set({ items: [], orderId: undefined }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "restaurant-cart",
    },
  ),
);
