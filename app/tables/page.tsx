"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { logger } from "@/lib/logger";
import { useClientListTableQuery } from "@/queries/customers/useClientTable";
import { ArrowLeft, QrCode, Utensils } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const TABLES = [
  { id: 1, seats: 2, status: "available" },
  { id: 2, seats: 2, status: "available" },
  { id: 3, seats: 4, status: "available" },
  { id: 4, seats: 4, status: "occupied" },
  { id: 5, seats: 6, status: "available" },
  { id: 6, seats: 8, status: "available" },
  { id: 7, seats: 4, status: "available" },
  { id: 8, seats: 6, status: "occupied" },
];

export default function TableSelectionPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useClientListTableQuery({
    page: currentPage,
    size: 12,
  });
  const { data: session } = useSession();
  if (isLoading) return <div>Loading...</div>;
  const listTable = data?.items || [];
  const pageable = data?.meta || { totalItems: 0, totalPages: 1, pageSize: 20 };
  const { totalItems, totalPages } = pageable;

  logger.info({ listTable, pageable }, "Fetched table list:");
  const isAuthenticated = !!session?.user;
  return (
    <div className="relative min-h-screen bg-[#1a120c] text-[#f5f1e8] overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6))]" />
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#f08a00]/10 to-transparent" />

      {/* HEADER */}
      <div className="sticky top-0 z-40 bg-[#140e09]/90 backdrop-blur-md border-b border-[#f08a00]/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-70 transition"
          >
            <ArrowLeft className="w-5 h-5 text-[#f08a00]" />
            <span className="text-xl  font-bold tracking-wide">BIG BOY</span>
          </Link>

          <h1 className="text-2xl  tracking-wide">
            {" "}
            Lựa Chọn Không Gian Của Quý Khách
          </h1>

          <div className="w-8" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* INSTRUCTION SECTION */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <QrCode className="w-6 h-6 text-[#f08a00]" />
            <h2 className="text-3xl  tracking-wide">Hướng dẫn bắt đầu</h2>
          </div>

          <p className="text-[#c9b8a6] text-lg leading-relaxed">
            Hãy lựa chọn một bàn còn trống (được hiển thị sáng trên màn hình).
            <br />
            Khi đã ổn định chỗ ngồi, vui lòng quét mã QR tại bàn để bắt đầu trải
            nghiệm ẩm thực.
          </p>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-[#f08a00]/60 to-transparent" />
        </div>
        <div className="text-center text-[#c9b8a6] mt-8 mb-10">
          Hiển thị {listTable.length} / {totalItems} bàn
        </div>
        {/* TABLE GRID */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listTable.map((table) => {
            const isOccupied = table.status === "OCCUPIED";
            const isDisabled = isOccupied || !isAuthenticated;

            return (
              <Link
                key={table.id}
                href={!isDisabled ? `/tables/detail/${table.id}` : "#"}
                className={`group ${isDisabled ? "pointer-events-none" : ""}`}
              >
                <Card
                  className={`
                    relative p-8 rounded-xl border transition-all duration-500
                    ${
                      isOccupied
                        ? "bg-[#24160f]/60 border-[#ff4d4d]/30 opacity-60"
                        : `
                          bg-gradient-to-br from-[#2a1a12] to-[#1f140e]
                          border-[#f08a00]/20
                          hover:border-[#f08a00]
                          hover:shadow-[0_0_30px_rgba(240,138,0,0.35)]
                          hover:-translate-y-1
                        `
                    }
                  `}
                >
                  {!isOccupied && (
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 bg-[radial-gradient(circle_at_center,rgba(240,138,0,0.15),transparent_70%)]" />
                  )}

                  <div className="relative flex flex-col items-center justify-center gap-4">
                    <div
                      className={`p-4 rounded-lg transition-all duration-300 ${
                        isOccupied
                          ? "bg-[#ff4d4d]/20"
                          : "bg-[#f08a00]/20 group-hover:bg-[#f08a00]/30"
                      }`}
                    >
                      <Utensils
                        className={`w-8 h-8 ${
                          isOccupied ? "text-[#ff4d4d]" : "text-[#f08a00]"
                        }`}
                      />
                    </div>

                    <h3 className="text-2xl  tracking-wide">
                      Bàn {table.name}
                    </h3>

                    <p className="text-[#c9b8a6]">{table.capacity} chỗ ngồi</p>

                    <Badge
                      className={
                        isOccupied
                          ? "bg-[#ff4d4d]/20 text-[#ff4d4d]"
                          : "bg-[#f08a00]/20 text-[#f08a00]"
                      }
                    >
                      {isOccupied ? "Đã có khách" : "Sẵn sàng phục vụ"}
                    </Badge>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center items-center gap-2">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-[#f08a00]/30 
                 disabled:opacity-40
                 hover:bg-[#f08a00]/10 transition"
          >
            Trước
          </button>

          {/* Page numbers */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg border transition
            ${
              isActive
                ? "bg-[#f08a00] text-black border-[#f08a00]"
                : "border-[#f08a00]/30 hover:bg-[#f08a00]/10"
            }
          `}
              >
                {page}
              </button>
            );
          })}

          {/* Next */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-[#f08a00]/30 
                 disabled:opacity-40
                 hover:bg-[#f08a00]/10 transition"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
}
