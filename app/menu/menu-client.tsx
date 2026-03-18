"use client";

import { AnimatedSection } from "@/components/animated-section";
import LuxuryLoading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import envConfig from "@/config/env.config";
import { PaginationResponse } from "@/constants/types/page.type";
import { formatCurrency } from "@/lib/utils";
import {
  ListProductResponse,
  ProductItem,
} from "@/services/internal/products/product.types";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

interface Props {
  listProduct: ListProductResponse["items"];
  meta: PaginationResponse<ProductItem>["meta"];
}

export default function MenuClient({ listProduct, meta }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);
  const changePage = (page: number) => {
    router.push(`/menu?page=${page}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const totalPages = meta.totalPages;

  return (
    <Suspense fallback={<LuxuryLoading text="Đang chuẩn bị MENU..." />}>
      <div className="min-h-screen bg-background dark">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="w-full px-6 py-4 flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 hover:opacity-70 transition-opacity"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
              <span className="text-xl font-bold tracking-tight text-foreground">
                BIG BOY
              </span>
            </Link>
          </div>
        </div>

        {/* Hero */}
        <section className="pt-32 pb-16 px-6 bg-gradient-to-b from-background to-background/50">
          <div className="container mx-auto text-center">
            <AnimatedSection animation="fade-in-up">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Thực Đơn
              </h1>
            </AnimatedSection>

            <AnimatedSection animation="fade-in-up" delay={100}>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
                Khám phá các món ăn đặc sắc của nhà hàng
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Menu Grid */}
        <section className="py-16 px-6">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {listProduct?.map((item, index) => (
                <AnimatedSection
                  key={item.id}
                  animation="fade-in-up"
                  delay={index * 50}
                  className="h-full"
                >
                  <Card className="group overflow-hidden h-full flex flex-col bg-gradient-to-br from-amber-950/20 to-orange-950/10 border-amber-900/20 hover:border-amber-700/40 hover:shadow-lg hover:shadow-amber-900/10 transition-all duration-500">
                    <div className="relative h-56 overflow-hidden flex-shrink-0">
                      <Image
                        src={item.images?.[0] ?? "/placeholder.svg"}
                        alt={item.name ?? "Sản phẩm"}
                        fill
                        className="object-cover group-hover:scale-105 transition-all duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    <CardContent className="p-5 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-semibold text-amber-400">
                          {formatCurrency(item.basePrice)}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold line-clamp-2">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-xs text-muted-foreground line-clamp-2 flex-1">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            {listProduct?.length === 0 && (
              <AnimatedSection
                animation="fade-in-up"
                className="text-center py-16"
              >
                <p className="text-muted-foreground text-lg">Không có món ăn</p>
              </AnimatedSection>
            )}
          </div>
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <section className="py-8 px-6 border-t border-border">
            <div className="container mx-auto flex items-center justify-between">
              <Button
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                variant="outline"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Trang trước
              </Button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => changePage(page)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all duration-300 ${
                        currentPage === page
                          ? "bg-amber-600 text-white shadow-lg shadow-amber-600/30"
                          : "bg-foreground/5 text-foreground hover:bg-amber-600/20"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}
              </div>

              <Button
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
              >
                Trang sau
              </Button>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-linear-to-b from-background to-amber-950/20 border-t border-amber-900/20 py-16 px-6">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <AnimatedSection animation="fade-in-left">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold tracking-tight text-foreground">
                    {envConfig.NEXT_PUBLIC_NAME_RESTARANT}
                  </h3>
                  <p className="mt-2 text-amber-200/60 text-sm">
                    Vị ngon, trọn khoảnh khắc
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection
                animation="fade-in"
                className="flex gap-8 text-sm text-muted-foreground"
              >
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Instagram
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-amber-400 transition-colors">
                  TikTok
                </a>
              </AnimatedSection>

              <AnimatedSection animation="fade-in-right">
                <p className="text-xs text-muted-foreground">
                  © 2026 Big Boy Restaurant. All rights reserved.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </div>
    </Suspense>
  );
}
