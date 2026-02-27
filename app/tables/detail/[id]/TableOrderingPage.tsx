"use client";

import NotFound from "@/app/not-found";
import LuxuryLoading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { logger } from "@/lib/logger";
import { useGetListTableClientQuery } from "@/queries/products/useProductClient";
import { Table } from "@/services/internal/customers/customer.types";
import { ProductItem } from "@/services/internal/products/product.types";
import {
  ArrowLeft,
  Check,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useReadLocalStorage } from "usehooks-ts";

interface TableOrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
type Props = {
  table: Table;
};
export default function TableOrderingPage({ table }: Props) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: listTableResponse, isLoading } = useGetListTableClientQuery({
    page: currentPage,
    size: 18,
  });
  const [cartItems, setCartItems] = useState<TableOrderItem[]>([]);
  const [justAdded, setJustAdded] = useState<number | null>(null);
  const tokenGuest = useReadLocalStorage<string | null>("guestToken");
  const { data, status } = useSession();

  if (status === "loading") {
    return null; // hoặc spinner
  }
  const user = data?.user;

  if (!user && !tokenGuest) {
    return <NotFound />;
  }
  const products = listTableResponse?.items ?? [];
  const addToCart = (item: ProductItem) => {
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
          price: item.price.virtual,
          quantity: 1,
        },
      ];
    });

    setJustAdded(item.id);
    setTimeout(() => setJustAdded(null), 1200);
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      setCartItems((prev) => prev.filter((i) => i.productId !== id));
    } else {
      setCartItems((prev) =>
        prev.map((i) => (i.productId === id ? { ...i, quantity } : i)),
      );
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== id));
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const handleOrder = () => {
    logger.info({ cartItems, tokenGuest }, "Check cart item");
  };
  if (isLoading) {
    return <LuxuryLoading text="Đang chuẩn bị bàn..." />;
  }
  return (
    <div className="relative min-h-screen bg-[#1a120c] text-[#f5f1e8] overflow-hidden">
      {/* VIGNETTE */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6))]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#f08a00]/10 to-transparent" />

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#140e09]/90 backdrop-blur-md border-b border-[#f08a00]/20">
        <div className="mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/table"
            className="flex items-center gap-2 hover:opacity-70 transition"
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

          <span className="text-md font-semibold bg-[#f08a00] text-black px-3 py-1 rounded-full shadow-lg">
            {cartItems.length} món
          </span>
        </div>
      </div>

      {/* MAIN */}
      <div className="mx-auto px-10 py-10 pb-32 grid grid-cols-1  xl:grid-cols-4 gap-8 relative z-10 text-lg">
        {/* MENU */}
        <div className="xl:col-span-3">
          <h1 className="text-3xl font-serif mb-2">Menu Nhà Hàng</h1>
          <p className="text-[#c9b8a6] mb-8">Chọn món ăn yêu thích của bạn</p>

          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
            {products.map((item) => (
              <Card
                key={item.id}
                className={`relative bg-gradient-to-br from-[#2a1a12] to-[#1f140e]
                border transition-all duration-500 group overflow-hidden
                ${
                  justAdded === item.id
                    ? "border-[#f08a00] ring-2 ring-[#f08a00]/40 shadow-[0_0_25px_rgba(240,138,0,0.3)]"
                    : "border-[#f08a00]/20 hover:border-[#f08a00] hover:shadow-[0_0_30px_rgba(240,138,0,0.25)]"
                }`}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition duration-500"
                  />

                  {/* <Badge className="absolute top-3 left-3 bg-[#f08a00] text-black text-xs shadow">
                    {item.category}
                  </Badge> */}

                  {justAdded === item.id && (
                    <div className="absolute inset-0 bg-[#f08a00]/40 flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold mb-2">{item.name}</h3>

                  {/* SHIMMER PRICE */}
                  <p className="relative text-lg font-bold text-[#f08a00] mb-4 overflow-hidden group">
                    <span className="relative z-10">
                      {item.price.virtual.toLocaleString()}đ
                    </span>
                    <span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                    translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"
                    />
                  </p>

                  <Button
                    onClick={() => addToCart(item)}
                    className="w-full "
                    variant="food"
                  >
                    {justAdded === item.id ? "Đã thêm" : "Thêm vào giỏ"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* CART */}
        <div className="xl:col-span-1 text-xl">
          <div
            className="sticky top-28 bg-gradient-to-b from-[#2a1a12] to-[#1b120c]
          border border-[#f08a00]/20 rounded-xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          >
            <h2 className="text-2xl font-serif mb-6 flex items-center gap-2">
              <ShoppingCart size={20} className="text-[#f08a00]" />
              Giỏ hàng
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-[#c9b8a6] text-center py-10">Giỏ hàng trống</p>
            ) : (
              <>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div
                      key={item.productId}
                      className="bg-[#2a1a12]/70 p-3 rounded-lg border border-[#f08a00]/10"
                    >
                      <div className="flex justify-between">
                        <span className="font-semibold">{item.name}</span>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-[#ff5c5c] "
                        >
                          <Trash2 size={25} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="text-[#f08a00] font-semibold">
                          {(item.price * item.quantity).toLocaleString()}đ
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            className="hover:text-[#f08a00]"
                          >
                            <Minus size={25} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            className="hover:text-[#f08a00]"
                          >
                            <Plus size={25} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  className="border-t border-[#f08a00]/20 pt-4 space-y-4"
                  id="checkout-section"
                >
                  <div className="flex justify-between font-semibold">
                    <span>Tổng cộng</span>
                    <span className="text-[#f08a00]">
                      {totalAmount.toLocaleString()}đ
                    </span>
                  </div>

                  <Button className="w-full bg-[#f08a00] hover:bg-[#ff8c1a] text-black hover:shadow-[0_0_20px_rgba(240,138,0,0.5)]">
                    Gọi phục vụ
                  </Button>

                  <Button
                    className="w-full bg-[#2a1a12] border border-[#f08a00]/40 hover:bg-[#3a241a]"
                    onClick={() => handleOrder()}
                  >
                    Đặt món
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Cart Button */}
      {/* Mobile Cart Floating Button */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[92%] max-w-md lg:hidden z-40">
          <Button
            onClick={() => {
              const el = document.getElementById("checkout-section");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="
      w-full 
      bg-gradient-to-r from-[#f08a00] to-[#ff9d2f]
      text-black font-semibold tracking-wide
      py-5 text-base gap-3
      rounded-2xl
      shadow-[0_10px_40px_rgba(240,138,0,0.45)]
      hover:shadow-[0_15px_50px_rgba(240,138,0,0.65)]
      transition-all duration-300
      "
          >
            <ShoppingCart size={22} />
            <span>
              Xem giỏ ({cartItems.length}) • {totalAmount.toLocaleString()}đ
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}
