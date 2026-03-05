"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { LOCAL_STORAGE_KEY } from "@/constants/keys/localStorage.key";
import { useGuestGetListOrderQuery } from "@/queries/guests/useGuest";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  minQuantity: number;
}

export const useGuestCart = () => {
  const { data } = useGuestGetListOrderQuery();

  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    LOCAL_STORAGE_KEY.GUEST_CART,
    [],
  );

  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!data?.data || initialized) return;

    const items = data.data.items.map((item) => ({
      productId: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      minQuantity: item.quantity,
    }));

    setCartItems(items);
    setInitialized(true);
  }, [data, initialized, setCartItems]);

  return {
    cartItems,
    setCartItems,
  };
};
