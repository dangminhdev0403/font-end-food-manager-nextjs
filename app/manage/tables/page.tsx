"use client";

import CountUp from "react-countup";
import { useDebounceValue } from "usehooks-ts";

import QRCodeModal from "@/components/qr-code-modal";
import TableCard from "@/components/table-card";
import TableForm from "@/components/table-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { logger } from "@/lib/logger";
import { TableItemForm } from "@/schemaValidations/table.schema";
import {
  useAdminAddTableMutation,
  useAdminDeleteTableMutation,
  useAdminEditTableMutation,
  useAdminGetTableCountsQuery,
  useAdminTableQuery,
} from "@/queries/admin/useTables";
import {
  TableItem,
  TableStatus,
} from "@/services/internal/admin/tables/table.types";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type StatCardKind = "total" | "empty" | "occupied" | "reserved";

const STAT_CLASSES: Record<StatCardKind, string> = {
  total: "text-primary",
  empty: "text-emerald-600 dark:text-emerald-400",
  occupied: "text-orange-600 dark:text-orange-400",
  reserved: "text-blue-600 dark:text-blue-400",
};

function StatCard({
  label,
  value,
  kind,
}: {
  label: string;
  value: number;
  kind: StatCardKind;
}) {
  return (
    <Card>
      <CardContent className="space-y-2 p-4 sm:p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p
          className={`text-2xl font-bold tabular-nums sm:text-3xl ${STAT_CLASSES[kind]}`}
        >
          <CountUp end={value} duration={1.2} />
        </p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<TableStatus | "ALL">("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch] = useDebounceValue(searchTerm, 400);

  const { data, isLoading, isFetching, refetch } = useAdminTableQuery({
    page: currentPage,
    size: 12,
    statusFilter: statusFilter,
    search: debouncedSearch.trim(),
  });

  const { data: countsData, refetch: refetchCounts } =
    useAdminGetTableCountsQuery();
  const addTableMutation = useAdminAddTableMutation();
  const updateTableMutation = useAdminEditTableMutation();
  const deleteTableMutation = useAdminDeleteTableMutation();

  const listTable = data?.items || [];
  const pageable = data?.meta;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<TableItem | null>(null);
  const [qrTableId, setQrTableId] = useState<number | null>(null);
  const tableSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    tableSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  const handleAddTable = async (
    newTable: Omit<TableItemForm, "id" | "orderedDishes">,
  ) => {
    if (addTableMutation.isPending) return;
    try {
      await addTableMutation.mutateAsync(newTable);
      await refetch();
      await refetchCounts();
    } catch (error) {}
    setIsAddDialogOpen(false);
  };

  const handleUpdateTable = async (updatedTable: TableItem) => {
    if (updateTableMutation.isPending) return;
    try {
      logger.info({ updatedTable }, "Updating table with data:");
      await updateTableMutation.mutateAsync(updatedTable);
      await refetch();
      await refetchCounts();
    } catch (error) {}
    setSelectedTable(null);
  };

  const handleDeleteTable = async (id: number) => {
    if (deleteTableMutation.isPending) return;
    try {
      await deleteTableMutation.mutateAsync(id);
      await refetch();
      await refetchCounts();
    } catch (error) {}
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const totalPages = pageable?.totalPages || 0;
  const allCount = countsData?.data.ALL || 0;
  const emptyCount = countsData?.data.EMPTY || 0;
  const occupiedCount = countsData?.data.OCCUPIED || 0;
  const reservedCount = countsData?.data.RESERVED || 0;

  if (isLoading) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <Spinner className="size-6" />
      </div>
    );
  }

  const filterButtons: Array<{
    value: TableStatus | "ALL";
    label: string;
    count: number;
  }> = [
    { value: "ALL", label: "Tất cả", count: allCount },
    { value: "EMPTY", label: "Trống", count: emptyCount },
    { value: "OCCUPIED", label: "Đang dùng", count: occupiedCount },
    { value: "RESERVED", label: "Đặt trước", count: reservedCount },
  ];

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Quản lý bàn ăn
          </h1>
          <p className="mt-1 text-sm text-muted-foreground sm:text-base">
            Hệ thống quản lý bàn ăn của nhà hàng
          </p>
        </div>
      </header>

      <main className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <StatCard label="Tổng bàn" value={allCount} kind="total" />
          <StatCard label="Trống" value={emptyCount} kind="empty" />
          <StatCard label="Đang dùng" value={occupiedCount} kind="occupied" />
          <StatCard label="Đặt trước" value={reservedCount} kind="reserved" />
        </div>

        <div
          ref={tableSectionRef}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Input
            placeholder="Tìm kiếm bàn theo tên..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Tìm kiếm bàn"
            className="h-11 flex-1"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 gap-2 sm:w-auto">
                <Plus className="size-5" aria-hidden />
                <span>Thêm bàn mới</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm bàn ăn mới</DialogTitle>
              </DialogHeader>
              <TableForm
                onSubmit={handleAddTable}
                onClose={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterButtons.map(({ value, label, count }) => {
            const isActive = statusFilter === value;
            return (
              <Button
                key={value}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setStatusFilter(value);
                  setCurrentPage(1);
                }}
                aria-pressed={isActive}
                className="h-10"
              >
                <CountUp
                  end={count}
                  duration={1.2}
                  prefix={`${label} (`}
                  suffix=")"
                />
              </Button>
            );
          })}
        </div>

        <section className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground sm:text-lg">
              Danh sách bàn
            </h2>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </p>
            )}
          </div>

          {listTable.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {listTable.map((table) => (
                  <TableCard
                    key={table.id}
                    table={table}
                    onEdit={() => setSelectedTable(table)}
                    onDelete={() => handleDeleteTable(table.id)}
                    onShowQR={() => setQrTableId(table.id)}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label="Phân trang"
                  className="flex flex-wrap items-center justify-center gap-2 pt-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="h-10 gap-2"
                  >
                    <ChevronLeft className="size-4" aria-hidden />
                    Trước
                  </Button>

                  <div className="flex flex-wrap items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const isCurrent = currentPage === page;
                        return (
                          <Button
                            key={page}
                            variant={isCurrent ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            aria-current={isCurrent ? "page" : undefined}
                            className="h-10 min-w-10"
                          >
                            {page}
                          </Button>
                        );
                      },
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || isFetching}
                    className="h-10 gap-2"
                  >
                    Tiếp
                    <ChevronRight className="size-4" aria-hidden />
                  </Button>
                </nav>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 p-8 text-center sm:p-12">
                <p className="text-base text-muted-foreground sm:text-lg">
                  Không tìm thấy bàn nào
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        {selectedTable && (
          <Dialog
            open={!!selectedTable}
            onOpenChange={() => setSelectedTable(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa bàn ăn</DialogTitle>
              </DialogHeader>
              <TableForm
                initialData={selectedTable}
                onSubmit={(data) =>
                  handleUpdateTable({ ...selectedTable, ...data })
                }
                onClose={() => setSelectedTable(null)}
              />
            </DialogContent>
          </Dialog>
        )}

        {qrTableId !== null && (
          <QRCodeModal
            tableToken={
              listTable.find((t) => t.id === qrTableId)?.qrToken || ""
            }
            tableName={listTable.find((t) => t.id === qrTableId)?.name || ""}
            onClose={() => setQrTableId(null)}
          />
        )}
      </main>
    </div>
  );
}
