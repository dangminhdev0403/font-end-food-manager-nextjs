"use client";

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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useTheme } from "next-themes";
import { useMemo, useState } from "react";

interface Dish {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Table {
  id: number;
  name: string;
  capacity: number;
  status: "available" | "occupied" | "reserved";
  orderedDishes?: Dish[];
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const [tables, setTables] = useState<Table[]>([
    {
      id: 1,
      name: "Bàn 1",
      capacity: 2,
      status: "available",
      orderedDishes: [],
    },
    {
      id: 2,
      name: "Bàn 2",
      capacity: 4,
      status: "occupied",
      orderedDishes: [
        { id: "1", name: "Phở Bò", quantity: 2, price: 85000 },
        { id: "2", name: "Cơm Tấm", quantity: 1, price: 65000 },
      ],
    },
    {
      id: 3,
      name: "Bàn 3",
      capacity: 6,
      status: "reserved",
      orderedDishes: [{ id: "1", name: "Gà Roti", quantity: 3, price: 120000 }],
    },
    {
      id: 4,
      name: "Bàn 4",
      capacity: 4,
      status: "available",
      orderedDishes: [],
    },
    {
      id: 5,
      name: "Bàn 5",
      capacity: 8,
      status: "available",
      orderedDishes: [],
    },
    {
      id: 6,
      name: "Bàn 6",
      capacity: 2,
      status: "occupied",
      orderedDishes: [
        { id: "1", name: "Mì Xào Hải Sản", quantity: 1, price: 95000 },
      ],
    },
    {
      id: 7,
      name: "Bàn 7",
      capacity: 4,
      status: "available",
      orderedDishes: [],
    },
    {
      id: 8,
      name: "Bàn 8",
      capacity: 6,
      status: "reserved",
      orderedDishes: [],
    },
    {
      id: 9,
      name: "Bàn 9",
      capacity: 2,
      status: "occupied",
      orderedDishes: [
        { id: "1", name: "Vịt Nướng", quantity: 2, price: 150000 },
        { id: "2", name: "Nước Ép", quantity: 2, price: 25000 },
      ],
    },
    {
      id: 10,
      name: "Bàn 10",
      capacity: 8,
      status: "available",
      orderedDishes: [],
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [qrTableId, setQrTableId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "occupied" | "reserved"
  >("all");

  const handleAddTable = (newTable: Omit<Table, "id" | "orderedDishes">) => {
    const id = Math.max(...tables.map((t) => t.id), 0) + 1;
    setTables([...tables, { ...newTable, id, orderedDishes: [] }]);
    setIsAddDialogOpen(false);
  };

  const handleUpdateTable = (updatedTable: Table) => {
    setTables(tables.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
    setSelectedTable(null);
  };

  const handleDeleteTable = (id: number) => {
    setTables(tables.filter((t) => t.id !== id));
  };

  const filteredTables = useMemo(
    () =>
      tables.filter((table) => {
        const matchesSearch = table.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const matchesStatus =
          statusFilter === "all" || table.status === statusFilter;
        return matchesSearch && matchesStatus;
      }),
    [tables, searchTerm, statusFilter],
  );

  const totalPages = Math.ceil(filteredTables.length / ITEMS_PER_PAGE);
  const paginatedTables = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTables.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredTables, currentPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const availableCount = tables.filter((t) => t.status === "available").length;
  const occupiedCount = tables.filter((t) => t.status === "occupied").length;
  const reservedCount = tables.filter((t) => t.status === "reserved").length;

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
              {tables.length}
            </div>
          </Card>
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Trống
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mt-3">
              {availableCount}
            </div>
          </Card>
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Đang Dùng
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-orange-600 dark:text-orange-400 mt-3">
              {occupiedCount}
            </div>
          </Card>
          <Card className="p-5 sm:p-6 bg-card border-2 border-border hover:shadow-md transition-shadow">
            <div className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Đặt Trước
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mt-3">
              {reservedCount}
            </div>
          </Card>
        </div>

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
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
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("all");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            Tất Cả ({tables.length})
          </Button>
          <Button
            variant={statusFilter === "available" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("available");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            Trống ({availableCount})
          </Button>
          <Button
            variant={statusFilter === "occupied" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("occupied");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            Đang Dùng ({occupiedCount})
          </Button>
          <Button
            variant={statusFilter === "reserved" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatusFilter("reserved");
              setCurrentPage(1);
            }}
            className="font-medium"
          >
            Đặt Trước ({reservedCount})
          </Button>
        </div>

        {/* Tables Grid with Pagination */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Danh Sách Bàn ({filteredTables.length})
            </h2>
            {totalPages > 1 && (
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </p>
            )}
          </div>

          {paginatedTables.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedTables.map((table) => (
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
                    disabled={currentPage === 1}
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
                    disabled={currentPage === totalPages}
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
            tableId={qrTableId}
            tableName={tables.find((t) => t.id === qrTableId)?.name || ""}
            onClose={() => setQrTableId(null)}
          />
        )}
      </main>
    </div>
  );
}
