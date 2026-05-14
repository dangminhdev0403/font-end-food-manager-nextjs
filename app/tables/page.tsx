"use client";

import LuxuryLoading from "@/components/loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import envConfig from "@/config/env.config";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";
import { useClientListTableQuery } from "@/queries/customers/useClientTable";
import { ArrowLeft, ChevronLeft, ChevronRight, QrCode, Utensils } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function TableSelectionPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useClientListTableQuery({
    page: currentPage,
    size: 20,
  });
  const { data: session } = useSession();
  if (isLoading) return <LuxuryLoading text="Đang lấy danh sách bàn" />;
  const listTable = data?.items || [];
  const pageable = data?.meta || { totalItems: 0, totalPages: 1, pageSize: 20 };
  const { totalItems, totalPages } = pageable;

  logger.info({ listTable, pageable }, "Fetched table list:");
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-sticky border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex min-h-10 items-center gap-2 rounded-md text-foreground transition-opacity duration-base hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Quay lại trang chủ"
          >
            <ArrowLeft aria-hidden className="size-5 text-primary" />
            <span className="text-base font-bold tracking-wide sm:text-lg">
              {envConfig.NEXT_PUBLIC_NAME_RESTARANT}
            </span>
          </Link>

          <h1 className="text-sm font-semibold tracking-wide sm:text-base lg:text-lg">
            Lựa chọn bàn
          </h1>

          <div className="size-6" aria-hidden />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <section className="mx-auto mb-12 max-w-3xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <QrCode aria-hidden className="size-5 text-primary sm:size-6" />
            <h2 className="text-xl font-semibold tracking-wide text-foreground sm:text-2xl lg:text-3xl">
              Hướng dẫn bắt đầu
            </h2>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg">
            Hãy lựa chọn một bàn còn trống (được hiển thị sáng trên màn hình).{" "}
            Khi đã ổn định chỗ ngồi, vui lòng quét mã QR tại bàn để bắt đầu trải
            nghiệm ẩm thực.
          </p>

          <div
            className="mx-auto mt-6 h-px w-full max-w-md bg-border"
            aria-hidden
          />
        </section>

        <p className="mb-6 text-center text-sm text-muted-foreground">
          Hiển thị {listTable.length} / {totalItems} bàn
        </p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
          {listTable.map((table) => {
            const isOccupied = table.status === "OCCUPIED";
            const isDisabled = isOccupied || !isAuthenticated;

            return (
              <Link
                key={table.id}
                href={isDisabled ? "#" : `/tables/detail/${table.id}`}
                aria-disabled={isDisabled}
                aria-label={`Bàn ${table.name} - ${
                  isOccupied ? "Đã có khách" : "Sẵn sàng phục vụ"
                }`}
                tabIndex={isDisabled ? -1 : 0}
                className={cn(
                  "group block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isDisabled && "pointer-events-none",
                )}
              >
                <Card
                  className={cn(
                    "transition-all duration-base",
                    isOccupied
                      ? "border-destructive/30 bg-card/60 opacity-70"
                      : "hover:-translate-y-px hover:border-primary hover:shadow-md",
                  )}
                >
                  <CardContent className="flex flex-col items-center justify-center gap-3 p-4 text-center sm:gap-4 sm:p-6">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-md transition-colors duration-base sm:size-14",
                        isOccupied
                          ? "bg-destructive/10 text-destructive"
                          : "bg-primary/10 text-primary group-hover:bg-primary/20",
                      )}
                    >
                      <Utensils
                        aria-hidden
                        className="size-6 sm:size-7"
                      />
                    </div>

                    <h3 className="text-base font-semibold tracking-wide text-foreground sm:text-lg lg:text-xl">
                      Bàn {table.name}
                    </h3>

                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {table.capacity} chỗ ngồi
                    </p>

                    <Badge
                      variant={isOccupied ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {isOccupied ? "Đã có khách" : "Sẵn sàng phục vụ"}
                    </Badge>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Phân trang danh sách bàn"
            className="mt-12 flex flex-wrap items-center justify-center gap-2"
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              aria-label="Trang trước"
              className="h-10 gap-1"
            >
              <ChevronLeft aria-hidden className="size-4" />
              Trước
            </Button>

            <div className="flex flex-wrap gap-2" aria-label="Số trang">
              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;
                const isActive = page === currentPage;

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={isActive ? "page" : undefined}
                    aria-label={`Trang ${page}`}
                    className={cn(
                      "size-10 rounded-md border text-sm font-medium transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card hover:bg-accent",
                    )}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              aria-label="Trang sau"
              className="h-10 gap-1"
            >
              Sau
              <ChevronRight aria-hidden className="size-4" />
            </Button>
          </nav>
        )}
      </div>
    </div>
  );
}
