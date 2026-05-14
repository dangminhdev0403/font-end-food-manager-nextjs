"use client";

import LuxuryLoading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { useGuestCart } from "@/lib/hooks/useGuestCart";
import { logger } from "@/lib/logger";
import { useSessionStore } from "@/lib/stores/session.store";
import { cn, formatCurrency } from "@/lib/utils";
import {
  useGuestGetListOrderQuery,
  useGuestUpdateOrderMutation,
} from "@/queries/guests/useGuest";
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

export default function TableOrderingPage({ table }: Readonly<Props>) {
  const router = useRouter();
  const { data, status } = useSession();

  const { guestToken, orderId, tableId, hasHydrated } = useSessionStore();

  const { cartItems, setCartItems } = useGuestCart();
  const { data: order, isLoading: isLoadingOrder } =
    useGuestGetListOrderQuery();

  useEffect(() => {
    if (!order?.data?.items) return;

    setCartItems(() =>
      order.data.items.map((item) => ({
        ...item,
        quantity: item.quantity,
        minQuantity: item.quantity,
        isPersisted: true,
      })),
    );
  }, [order?.data?.items, setCartItems]);

  const { mutateAsync: updateOrder, isPending } = useGuestUpdateOrderMutation();

  const { data: listTableResponse, isLoading } = useGetListProductClientQuery({
    page: 1,
    size: 18,
  });

  const products = listTableResponse?.items ?? [];

  const [lastAddedId, setLastAddedId] = useState<number | null>(null);

  const cartContainerRef = useRef<HTMLDivElement>(null);
  const mobileCartBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasHydrated) return;
    if (tableId && tableId !== Number(table.id)) {
      router.replace(`/tables/detail/${tableId}`);
    }
  }, [tableId, table.id, router, hasHydrated]);

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
            isPersisted: false,
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
  logger.info(cartItems);

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

  const scrollToCart = () => {
    if (mobileCartBarRef.current) {
      mobileCartBarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

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

  if (isLoading || isLoadingOrder || status === "loading" || !hasHydrated) {
    return <LuxuryLoading text="Đang tải thực đơn" />;
  }
  if (!data?.user && !guestToken) {
    return notFound();
  }
  return (
    <div className="relative min-h-dvh overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_42%),radial-gradient(circle_at_85%_20%,rgba(249,115,22,0.12),transparent_38%),linear-gradient(to_bottom,rgba(10,10,10,0.96),rgba(6,6,6,1))]"
      />

      <header className="sticky top-0 z-sticky border-b border-amber-900/30 bg-background/75 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-amber-900/30 bg-card/40 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-r from-amber-500/10 via-transparent to-orange-500/10"
            />

            <Link
              href="/"
              className="relative flex min-h-10 w-fit items-center gap-2 rounded-md text-amber-50 transition-all duration-base hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={`Quay lại - Bàn ${table.name}`}
            >
              <ArrowLeft aria-hidden className="size-5 text-amber-300" />
              <span className="text-base font-bold sm:text-lg">
                Bàn {table.name}
              </span>
            </Link>

            <div className="relative flex items-end justify-between gap-3 sm:items-center">
              <div className="text-left sm:text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-100/70">
                  Tổng tiền
                </p>
                <p className="text-lg font-bold tabular-nums text-amber-300 sm:text-xl">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <Badge className="whitespace-nowrap border border-amber-700/30 bg-amber-500/10 px-2.5 text-xs text-amber-100 sm:text-sm">
                {cartItems.length} món
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="relative container mx-auto grid grid-cols-1 gap-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:grid-cols-4">
        <section
          aria-label="Thực đơn"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:col-span-3"
        >
          {products.map((item) => (
            <Card
              key={item.id}
              className="group overflow-hidden border-amber-900/30 bg-card/55 shadow-lg transition-all duration-base hover:-translate-y-0.5 hover:border-amber-700/45 hover:shadow-xl"
            >
              <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
                <Image
                  src={item.images?.[0] || "/placeholder.png"}
                  alt={item.name || "Sản phẩm"}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="max-w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-linear-to-t from-background/70 via-background/10 to-transparent"
                />
              </div>

              <CardContent className="space-y-3 bg-linear-to-r from-amber-950/20 to-orange-950/10 p-4">
                <h3 className="line-clamp-2 text-sm font-semibold text-foreground sm:text-base">
                  {item.name}
                </h3>

                <p className="text-base font-bold tabular-nums text-amber-300 sm:text-lg">
                  {formatCurrency(item.virtualPrice)}
                </p>

                <Button
                  onClick={() => addToCart(item)}
                  className="h-11 w-full border border-amber-700/40 bg-linear-to-r from-amber-700/85 to-orange-700/85 text-amber-50 shadow-md transition-all duration-base hover:from-amber-600 hover:to-orange-600 hover:shadow-lg"
                  variant="default"
                  aria-label={`Thêm ${item.name} vào giỏ hàng`}
                >
                  <Plus aria-hidden className="size-4" />
                  Thêm vào giỏ
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <aside className="hidden xl:block" aria-label="Giỏ hàng">
          <Card className="sticky top-24 overflow-hidden border-amber-900/30 bg-card/55 shadow-xl backdrop-blur-md">
            <CardContent className="space-y-4 p-6">
              <h2 className="flex items-center gap-2 text-base font-semibold text-amber-100 sm:text-lg">
                <ShoppingCart aria-hidden className="size-5 text-amber-300" />
                Giỏ hàng
              </h2>

              <div
                ref={cartContainerRef}
                className="max-h-[60dvh] space-y-3 overflow-y-auto pr-1"
              >
                {cartItems.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    Chưa có món nào
                  </p>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className={cn(
                        "rounded-xl border p-3 transition-all duration-base",
                        lastAddedId === item.productId
                          ? "border-amber-500/70 bg-amber-500/15 shadow-[0_0_14px_rgba(251,191,36,0.3)]"
                          : "border-amber-900/30 bg-linear-to-r from-amber-950/25 to-orange-950/10 hover:border-amber-700/45",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">
                          {item.name}
                        </span>
                        {!item.isPersisted && (
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.productId)}
                            aria-label={`Xoá ${item.name}`}
                            className="flex size-8 items-center justify-center rounded-md text-destructive transition-colors duration-base hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Trash2 aria-hidden className="size-4" />
                          </button>
                        )}
                      </div>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold tabular-nums text-amber-300">
                          {formatCurrency(item.price * item.quantity)}
                        </span>

                        <div className="flex items-center gap-2">
                          {(item.isPersisted
                            ? item.quantity > item.minQuantity
                            : item.quantity > 1) && (
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                )
                              }
                              aria-label="Giảm số lượng"
                              className="flex size-8 items-center justify-center rounded-md border border-amber-900/35 bg-card/80 transition-colors duration-base hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            >
                              <Minus aria-hidden className="size-4" />
                            </button>
                          )}

                          <span
                            className="min-w-6 text-center text-sm tabular-nums text-amber-50"
                            aria-label={`Số lượng ${item.quantity}`}
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            aria-label="Tăng số lượng"
                            className="flex size-8 items-center justify-center rounded-md border border-amber-900/35 bg-card/80 transition-colors duration-base hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <Plus aria-hidden className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <Button
                onClick={handleOrder}
                disabled={isPending || cartItems.length === 0}
                className="h-11 w-full border border-amber-700/40 bg-linear-to-r from-amber-700/85 to-orange-700/85 text-amber-50 shadow-md transition-all duration-base hover:from-amber-600 hover:to-orange-600 hover:shadow-lg"
              >
                Đặt món
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      {cartItems.length > 0 && (
        <div
          ref={mobileCartBarRef}
          className="container mx-auto mb-20 mt-12 px-4 sm:px-6 lg:px-8 xl:hidden"
        >
          <Card className="overflow-hidden border-amber-900/30 bg-card/55 shadow-xl backdrop-blur-md">
            <CardContent className="space-y-4 p-4 sm:p-6">
              <div className="max-h-64 space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item.productId}
                    className={cn(
                      "rounded-xl border p-3 transition-all duration-base",
                      lastAddedId === item.productId
                        ? "border-amber-500/70 bg-amber-500/15 shadow-[0_0_14px_rgba(251,191,36,0.3)]"
                        : "border-amber-900/30 bg-linear-to-r from-amber-950/25 to-orange-950/10",
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <span className="text-sm font-semibold text-foreground">
                          {item.name}
                        </span>
                        <p className="mt-1 text-sm font-bold tabular-nums text-amber-300">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>

                      {item.quantity === item.minQuantity && (
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Xoá ${item.name}`}
                          className="flex size-8 items-center justify-center rounded-md text-destructive transition-colors duration-base hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Trash2 aria-hidden className="size-4" />
                        </button>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-2">
                      {item.quantity > item.minQuantity && (
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          aria-label="Giảm số lượng"
                          className="flex size-8 items-center justify-center rounded-md border border-amber-900/35 bg-card/80 transition-colors duration-base hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <Minus aria-hidden className="size-4" />
                        </button>
                      )}

                      <span
                        className="min-w-6 text-center text-sm tabular-nums text-amber-50"
                        aria-label={`Số lượng ${item.quantity}`}
                      >
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        aria-label="Tăng số lượng"
                        className="flex size-8 items-center justify-center rounded-md border border-amber-900/35 bg-card/80 transition-colors duration-base hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <Plus aria-hidden className="size-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-900/30 pt-3">
                <p className="text-xs uppercase tracking-[0.2em] text-amber-100/70">
                  Tổng tiền
                </p>
                <p className="text-lg font-bold tabular-nums text-amber-300">
                  {formatCurrency(totalAmount)}
                </p>
              </div>

              <Button
                onClick={handleOrder}
                disabled={isPending}
                className="h-11 w-full border border-amber-700/40 bg-linear-to-r from-amber-700/85 to-orange-700/85 text-amber-50 shadow-md transition-all duration-base hover:from-amber-600 hover:to-orange-600 hover:shadow-lg"
              >
                Đặt món
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {cartItems.length > 0 && (
        <button
          type="button"
          onClick={scrollToCart}
          disabled={isPending}
          aria-label="Cuộn xuống giỏ hàng"
          className="fixed bottom-6 right-4 z-sticky flex size-14 flex-col items-center justify-center rounded-full border border-amber-700/50 bg-linear-to-br from-amber-600 to-orange-600 text-amber-50 shadow-[0_12px_30px_rgba(251,146,60,0.35)] transition-transform duration-base hover:shadow-[0_16px_36px_rgba(251,146,60,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-95 sm:bottom-8 sm:right-6 sm:size-16 xl:hidden"
        >
          <span className="text-xs font-bold leading-none">Đặt</span>
          <span className="mt-0.5 text-xs font-bold leading-none">món</span>
        </button>
      )}
    </div>
  );
}
