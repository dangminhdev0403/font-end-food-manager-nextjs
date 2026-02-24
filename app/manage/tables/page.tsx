"use client";
import CountUp from "react-countup";
import { useDebounceValue } from "usehooks-ts";

import QRCodeModal from "@/components/qr-code-modal";
import TableCard from "@/components/table-card";
import TableForm from "@/components/table-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
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

import { logger } from "@/lib/logger";
import { TableItemForm } from "@/schemaValidations/table.schema";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

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
      const res = await addTableMutation.mutateAsync(newTable);
      await refetch();
      await refetchCounts();
    } catch (error) {}
    setIsAddDialogOpen(false);
  };

  const handleUpdateTable = async (updatedTable: TableItem) => {
    if (updateTableMutation.isPending) return;
    try {
      logger.info({ updatedTable }, "Updating table with data:");
      const res = await updateTableMutation.mutateAsync(updatedTable);
      console.log(res);
      await refetch();
      await refetchCounts();
    } catch (error) {}
    setSelectedTable(null);
  };

  const handleDeleteTable = async (id: number) => {
    if (deleteTableMutation.isPending) return;
    try {
      const res = await deleteTableMutation.mutateAsync(id);
      console.log(res);
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
    return <Spinner />;
  }
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <header className=" top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-primary">
                🍽️ Quản Lý Bàn Ăn
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Hệ thống quản lý bàn ăn hiện đại
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-10">
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Tổng Bàn
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-primary mt-3">
              <CountUp end={allCount} duration={1.2} />
            </div>
          </Card>
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Trống
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mt-3">
              <CountUp end={emptyCount} duration={1.2} />
            </div>
          </Card>
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Đang Dùng
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400 mt-3">
              <CountUp end={occupiedCount} duration={1.2} />
            </div>
          </Card>
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Đặt Trước
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mt-3">
              <CountUp end={reservedCount} duration={1.2} />
            </div>
          </Card>
        </div>

        {/* Search and Add Button */}
        <div
          className="flex flex-col sm:flex-row gap-3 mb-8"
          ref={tableSectionRef}
        >
          <Input
            placeholder="Tìm kiếm bàn theo tên..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 h-11 text-base"
          />
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 h-11 px-6 font-semibold">
                <Plus className="h-5 w-5" />
                <span>Thêm Bàn Mới</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm Bàn Ăn Mới</DialogTitle>
              </DialogHeader>
              <TableForm
                onSubmit={handleAddTable}
                onClose={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={statusFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("ALL");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            <CountUp
              end={allCount}
              duration={1.2}
              prefix="Tất Cả ("
              suffix=")"
            />
          </Button>
          <Button
            variant={statusFilter === "EMPTY" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("EMPTY");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            <CountUp
              end={emptyCount}
              duration={1.2}
              prefix="Trống ("
              suffix=")"
            />
          </Button>
          <Button
            variant={statusFilter === "OCCUPIED" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("OCCUPIED");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            <CountUp
              end={occupiedCount}
              duration={1.2}
              prefix="Đang Dùng ("
              suffix=")"
            />
          </Button>
          <Button
            variant={statusFilter === "RESERVED" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("RESERVED");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            <CountUp
              end={reservedCount}
              duration={1.2}
              prefix="Đặt Trước ("
              suffix=")"
            />
          </Button>
        </div>

        {/* Tables Grid with Pagination */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Danh Sách Bàn</h2>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </p>
            )}
          </div>

          {listTable.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isFetching}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="min-w-10 h-10"
                        >
                          {page}
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages || isFetching}
                    className="gap-2"
                  >
                    Tiếp
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Không tìm thấy bàn nào
              </p>
            </div>
          )}
        </div>

        {/* Edit Dialog */}
        {selectedTable && (
          <Dialog
            open={!!selectedTable}
            onOpenChange={() => setSelectedTable(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Chỉnh Sửa Bàn Ăn</DialogTitle>
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

        {/* QR Code Modal */}
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
