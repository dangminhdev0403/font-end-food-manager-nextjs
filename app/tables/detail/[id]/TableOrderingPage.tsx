"use client";

import LuxuryLoading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGuestCart } from "@/lib/hooks/useGuestCart";
import { useSessionStore } from "@/lib/stores/session.store";
import { useGuestUpdateOrderMutation } from "@/queries/guests/useGuest";
import { useGetListProductClientQuery } from "@/queries/products/useProductClient";
import { Table } from "@/services/internal/customers/customer.types";
import { ProductItem } from "@/services/internal/products/product.types";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  table: Table;
};

export default function TableOrderingPage({ table }: Props) {
  const router = useRouter();
  const { data, status } = useSession();

  const { guestToken, orderId, tableId, hasHydrated } = useSessionStore();

  const { cartItems, setCartItems } = useGuestCart();

  const { mutateAsync: updateOrder, isPending } = useGuestUpdateOrderMutation();

  const { data: listTableResponse, isLoading } = useGetListProductClientQuery({
    page: 1,
    size: 18,
  });

  const products = listTableResponse?.items ?? [];

  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const cartContainerRef = useRef<HTMLDivElement>(null);
  const mobileCartBarRef = useRef<HTMLDivElement>(null);

  /* AUTH CHECK */

  // TABLE REDIRECT
  useEffect(() => {
    if (!hasHydrated) return;
    if (tableId && tableId !== Number(table.id)) {
      router.replace(`/tables/detail/${tableId}`);
    }
  }, [tableId, table.id, router, hasHydrated]);

  /* ADD TO CART */

  const addToCart = useCallback(
    (item: ProductItem) => {
      setCartItems((prev) => {
        const existing = prev.find((i) => i.productId === item.id);

        if (existing) {
          return prev.map((i) =>
            i.productId === item.id ? { ...i, quantity: i.quantity + 1 } : i,
          );
        }

        return [
          ...prev,
          {
            productId: item.id,
            name: item.name ?? "Không tên",
            price: item.virtualPrice,
            quantity: 1,
            minQuantity: 0,
          },
        ];
      });

      setLastAddedId(item.id);
      setTimeout(() => setLastAddedId(null), 1200);

      navigator.vibrate?.(40);

      setTimeout(() => {
        const el = cartContainerRef.current;
        if (el) {
          el.scrollTo({
            top: el.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 120);
    },
    [setCartItems],
  );

  /* UPDATE QUANTITY */

  const updateQuantity = useCallback(
    (id: number, quantity: number) => {
      setCartItems((prev) =>
        prev.map((item) => {
          if (item.productId !== id) return item;
          if (quantity < item.minQuantity) return item;

          return { ...item, quantity };
        }),
      );
    },
    [setCartItems],
  );

  /* REMOVE */

  const removeFromCart = useCallback(
    (id: number) => {
      setCartItems((prev) =>
        prev.filter((item) => item.productId !== id || item.minQuantity > 0),
      );
    },
    [setCartItems],
  );

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  /* SCROLL TO MOBILE CART */

  const scrollToCart = () => {
    if (mobileCartBarRef.current) {
      mobileCartBarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  /* ORDER */

  const handleOrder = async () => {
    if (isPending) return;
    if (!hasHydrated) return;
    if (!orderId) {
      toast({
        description: "Không tìm thấy order",
        variant: "destructive",
      });
      return;
    }
    try {
      await updateOrder({
        orderId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      toast({
        description: "Đặt món thành công",
        variant: "success",
      });

      router.push("/orders/guest");
    } catch {
      toast({
        description: "Đặt món thất bại",
        variant: "error",
      });
    }
  };

  // AUTH GUARD

  if (isLoading || status === "loading" || !hasHydrated) {
    return <LuxuryLoading text="Đang tải Thực Đơn" />;
  }
  if (!data?.user && !guestToken) {
    return notFound();
  }
  return (
    <div className="min-h-screen bg-[#1a120c] text-[#f5f1e8]">
      {/* HEADER */}

      <div className="sticky top-0 z-40 bg-[#140e09]/90 border-b border-[#f08a00]/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
          {/* DESKTOP HEADER */}
          <div className="hidden sm:flex items-center justify-between gap-4">
            <Link
              href="/table"
              className="flex items-center gap-2 hover:opacity-70"
            >
              <ArrowLeft className="w-5 h-5 text-[#f08a00]" />
              <span className="text-lg font-serif font-bold">
                Bàn {table.name}
              </span>
            </Link>

            <div className="text-center">
              <p className="text-xs text-[#c9b8a6]">Tổng tiền</p>
              <p className="text-lg font-bold text-[#f08a00]">
                {totalAmount.toLocaleString()}đ
              </p>
            </div>

            <span className="bg-[#f08a00] text-black px-3 py-1 rounded-full text-sm font-medium flex justify-center align-center">
              {cartItems.length} món
            </span>
          </div>

          {/* MOBILE HEADER */}
          <div className="sm:hidden space-y-2">
            <Link
              href="/table"
              className="flex items-center gap-2 hover:opacity-70 w-fit"
            >
              <ArrowLeft className="w-5 h-5 text-[#f08a00]" />
              <span className="text-base font-serif font-bold">
                Bàn {table.name}
              </span>
            </Link>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-[#c9b8a6]">Tổng tiền</p>
                <p className="text-xl font-bold text-[#f08a00]">
                  {totalAmount.toLocaleString()}đ
                </p>
              </div>

              <span className="bg-[#f08a00] text-black px-3 py-1 rounded-full text-xs font-medium">
                {cartItems.length} món
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* MENU */}

        <div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((item) => (
            <Card
              key={item.id}
              className="bg-[#2a1a12] border border-[#f08a00]/20"
            >
              <div className="relative h-44 sm:h-40">
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name || ""}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3 className="font-semibold mb-1">{item.name}</h3>

                <p className="text-[#f08a00] font-bold mb-3">
                  {item.virtualPrice.toLocaleString()}đ
                </p>

                <Button
                  onClick={() => addToCart(item)}
                  className="w-full active:scale-95 transition"
                  variant="food"
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CART DESKTOP */}

        <div className="hidden xl:block">
          <div className="sticky top-28 bg-[#2a1a12] p-6 rounded-xl">
            <h2 className="flex items-center gap-2 mb-6">
              <ShoppingCart size={20} />
              Giỏ hàng
            </h2>

            <div
              ref={cartContainerRef}
              className="space-y-4 mb-6 max-h-[420px] overflow-y-auto pr-2"
            >
              {cartItems.map((item) => (
                <div
                  key={item.productId}
                  className={`p-3 rounded-lg ${
                    lastAddedId === item.productId
                      ? "bg-[#f08a00]/20 ring-2 ring-[#f08a00]"
                      : "bg-[#1f140e]"
                  }`}
                >
                  <div className="flex justify-between">
                    <span>{item.name}</span>

                    <button onClick={() => removeFromCart(item.productId)}>
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-[#f08a00]">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </span>

                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button
              onClick={handleOrder}
              className="w-full bg-[#f08a00] text-black"
            >
              Đặt món
            </Button>
          </div>
        </div>
      </div>

      {/* MOBILE CART BAR */}

      {cartItems.length > 0 && (
        <div
          ref={mobileCartBarRef}
          className="xl:hidden w-full p-4 bg-[#1a120c] border-t border-[#f08a00]/20 mt-12 mb-20"
        >
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={item.productId}
                className={`p-3 rounded-lg ${
                  lastAddedId === item.productId
                    ? "bg-[#f08a00]/20 ring-2 ring-[#f08a00]"
                    : "bg-[#1f140e]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <span className="ext-orange-300 font-semibold">
                      {item.name}
                    </span>
                    <p className="text-[#f08a00] font-bold text-sm">
                      {(item.price * item.quantity).toLocaleString()}đ
                    </p>
                  </div>

                  <button onClick={() => removeFromCart(item.productId)}>
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>

                <div className="flex gap-2 items-center justify-end mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                  >
                    <Minus size={14} />
                  </button>

                  <span className="text-sm">{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-3 pb-3 border-t border-[#f08a00]/20">
            <p className="text-xs text-[#c9b8a6]">Tổng tiền</p>
            <p className="text-lg font-bold text-[#f08a00]">
              {totalAmount.toLocaleString()}đ
            </p>
          </div>

          <Button
            onClick={handleOrder}
            disabled={isPending}
            className="w-full bg-[#f08a00] text-black"
          >
            Đặt món
          </Button>
        </div>
      )}

      {/* FLOATING CHECKOUT BUTTON MOBILE */}

      {cartItems.length > 0 && (
        <button
          onClick={scrollToCart}
          disabled={isPending}
          className="xl:hidden fixed bottom-8 right-6 z-40 w-16 h-16 rounded-full bg-gradient-to-br from-[#f08a00] to-[#e07a00] text-black shadow-2xl hover:shadow-[0_0_30px_rgba(240,138,0,0.6)] active:scale-95 transition-all duration-300 flex items-center justify-center font-bold text-sm"
        >
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-xs leading-none">Đặt</span>
            <span className="text-xs leading-none">món</span>
          </div>
        </button>
      )}
    </div>
  );
}
