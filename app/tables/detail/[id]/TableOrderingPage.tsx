"use client";

import LuxuryLoading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { LOCAL_STORAGE_KEY } from "@/constants/keys/localStorage.key";
import { useGuestCart } from "@/lib/hooks/useGuestCart";
import { useGuestUpdateOrderMutation } from "@/queries/guests/useGuest";
import { useGetListTableClientQuery } from "@/queries/products/useProductClient";
import { Table } from "@/services/internal/customers/customer.types";
import { ProductItem } from "@/services/internal/products/product.types";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";

type Props = {
  table: Table;
};

export default function TableOrderingPage({ table }: Props) {
  const router = useRouter();
  const { data, status } = useSession();

  const tokenGuest = useReadLocalStorage<string | null>(
    LOCAL_STORAGE_KEY.GUEST_TOKEN,
  );

  const orderId = useReadLocalStorage<number | null>(
    LOCAL_STORAGE_KEY.ORDER_ID,
  );

  const tableId = useReadLocalStorage<number | null>(
    LOCAL_STORAGE_KEY.TABLE_ID,
  );

  const { cartItems, setCartItems } = useGuestCart();

  const { mutateAsync: updateOrder, isPending } = useGuestUpdateOrderMutation();

  const { data: listTableResponse, isLoading } = useGetListTableClientQuery({
    page: 1,
    size: 18,
  });

  const products = listTableResponse?.items ?? [];

  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const cartContainerRef = useRef<HTMLDivElement>(null);

  /* ---------------- AUTH CHECK ---------------- */

  useEffect(() => {
    if (!data?.user && !tokenGuest) {
      return notFound();
    }

    if (tableId && tableId !== Number(table.id)) {
      router.replace(`/tables/detail/${tableId}`);
    }
  }, [data, tokenGuest, tableId, table.id, router]);

  /* ---------------- ADD TO CART ---------------- */

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

      /* scroll cart xuống cuối */

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

  /* ---------------- UPDATE QUANTITY ---------------- */

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

  /* ---------------- REMOVE ---------------- */

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

  /* ---------------- ORDER ---------------- */

  const handleOrder = async () => {
    if (isPending) return;

    try {
      await updateOrder({
        orderId: orderId || 0,
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

  if (status === "loading") return null;

  if (isLoading) {
    return <LuxuryLoading text="Đang chuẩn bị bàn..." />;
  }

  return (
    <div className="min-h-screen bg-[#1a120c] text-[#f5f1e8]">
      {/* HEADER */}

      <div className="sticky top-0 z-40 bg-[#140e09]/90 border-b border-[#f08a00]/20">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
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

          <span className="bg-[#f08a00] text-black px-3 py-1 rounded-full">
            {cartItems.length} món
          </span>
        </div>
      </div>

      {/* MAIN */}

      <div className="mx-auto px-10 py-10 grid xl:grid-cols-4 gap-8">
        {/* MENU */}

        <div className="xl:col-span-3 grid grid-cols-3 gap-6">
          {products.map((item) => (
            <Card
              key={item.id}
              className="bg-[#2a1a12] border border-[#f08a00]/20"
            >
              <div className="relative h-40">
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name || ""}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h3>{item.name}</h3>

                <p className="text-[#f08a00] font-bold mb-3">
                  {item.virtualPrice.toLocaleString()}đ
                </p>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(item);
                  }}
                  className="w-full"
                  variant="food"
                >
                  Thêm vào giỏ
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* CART */}

        <div className="xl:col-span-1">
          <div className="sticky top-28 bg-[#2a1a12] p-6 rounded-xl">
            <h2 className="flex items-center gap-2 mb-6">
              <ShoppingCart size={20} />
              Giỏ hàng
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-center text-[#c9b8a6]">Giỏ hàng trống</p>
            ) : (
              <>
                <div
                  ref={cartContainerRef}
                  className="space-y-4 mb-6 max-h-[420px] overflow-y-auto pr-2 scroll-smooth"
                >
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className={`p-3 rounded-lg transition-all duration-300 ${
                        lastAddedId === item.productId
                          ? "bg-[#f08a00]/20 ring-2 ring-[#f08a00]"
                          : "bg-[#1f140e]"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{item.name}</span>

                        {item.minQuantity === 0 && (
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="p-1 rounded-md hover:bg-red-500/10"
                          >
                            <Trash2 size={18} className="text-red-500" />
                          </button>
                        )}
                      </div>

                      <div className="flex justify-between mt-2">
                        <span className="text-[#f08a00]">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            disabled={item.quantity <= item.minQuantity}
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="p-1 rounded-md hover:bg-[#f08a00]/10 disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus size={18} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="p-1 rounded-md hover:bg-[#f08a00]/10"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between font-semibold mb-4">
                    <span>Tổng</span>
                    <span className="text-[#f08a00]">
                      {totalAmount.toLocaleString()}đ
                    </span>
                  </div>

                  <Button
                    onClick={handleOrder}
                    className="w-full bg-[#f08a00] text-black"
                  >
                    Đặt món
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
