"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, useContext, useMemo, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import AddDish from "@/app/manage/dishes/add-dish";
import EditDish from "@/app/manage/dishes/edit-dish";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";
import { formatCurrency } from "@/lib/utils";
import { productResource } from "@/resources/product.resource";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

type DishItem = {
  id: number;
  name: string | null;
  description: string | null;
  basePrice: number;
  images: string[] | null;
};

const PAGE_SIZE = 10;

const DishTableContext = createContext<any>(null);

const columns: ColumnDef<DishItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    header: "Ảnh",
    cell: ({ row }) => (
      <div className="flex items-center justify-center w-12 h-12 flex-shrink-0">
        <Avatar className="w-12 h-12 rounded-md">
          <AvatarImage src={row.original.images?.[0]} />
          <AvatarFallback>{row.original.name}</AvatarFallback>
        </Avatar>
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "basePrice",
    header: "Giá",
    cell: ({ row }) => formatCurrency(row.original.basePrice),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <p className="max-w-[320px] truncate text-muted-foreground">
        {row.original.description}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }) => {
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext);
      const openEditDish = () => {
        setDishIdEdit(row.original.id);
      };

      const openDeleteDish = () => {
        setDishDelete(row.original);
      };
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <DotsHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={openEditDish}>Sửa</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteDish}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete,
  deleteMutation,
}: {
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
  deleteMutation: ReturnType<typeof productResource.useDeleteMutation>;
}) {
  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null);
        }
      }}
    >
      <AlertDialogContent className="max-w-md border border-border bg-background shadow-xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold">
            ⚠️ Xóa món ăn
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm text-muted-foreground">
            Món{" "}
            <span className="font-semibold text-red-500">
              {dishDelete?.name}
            </span>{" "}
            sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="h-9 bg-red">Hủy</AlertDialogCancel>

          <Button
            variant="gradient"
            size="default"
            className="h-9 px-4 "
            disabled={deleteMutation.isPending}
            onClick={async () => {
              if (!dishDelete) return;
              try {
                await deleteMutation.mutateAsync(dishDelete.id);
                toast({
                  description: "Xoá thành công",
                  variant: "success",
                });
              } catch (error) {
                logger.error({ error });
                toast({
                  description: "Có lỗi xảy ra",
                  variant: "error",
                });
              }

              setDishDelete(null);
            }}
          >
            {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default function DishTable() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounceValue(search, 400);
  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const { data, isLoading } = productResource.useListQuery({
    page: pagination.pageIndex + 1,
    size: pagination.pageSize,
    search: debouncedSearch.trim(),
  });
  const deleteMutation = productResource.useDeleteMutation();
  const listTable = data?.items ?? [];
  const meta = data?.meta;

  const table = useReactTable({
    data: listTable,
    columns,
    pageCount: meta?.totalPages ?? 0,

    state: {
      pagination,
    },

    manualPagination: true,
    onPaginationChange: setPagination,

    getCoreRowModel: getCoreRowModel(),
  });
  const contextValue = useMemo(
    () => ({
      dishIdEdit,
      setDishIdEdit,
      dishDelete,
      setDishDelete,
    }),
    [dishIdEdit, dishDelete],
  );
  const handleSearch = (value: string) => {
    setSearch(value);

    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };
  return (
    <DishTableContext.Provider value={contextValue}>
      <div className="w-full space-y-5 mx-auto">
        {/* Search + Count Header */}
        <EditDish id={dishIdEdit} setId={setDishIdEdit} />
        <AlertDialogDeleteDish
          dishDelete={dishDelete}
          setDishDelete={setDishDelete}
          deleteMutation={deleteMutation}
        />{" "}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 max-w-sm relative ">
            <Input
              placeholder="🔎 Tìm món ăn..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 px-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 flex items-center border border-blue-100 dark:border-blue-900/30">
              <span className="text-sm font-medium text-foreground">
                Hiện:{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {listTable?.length ?? 0} / {meta?.totalItems ?? 0}{" "}
                </span>{" "}
                món
              </span>
            </div>
          </div>
          <AddDish />
        </div>{" "}
        {/* Table Container */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40 sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="border-b border-border hover:bg-transparent"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-bold uppercase letter-spacing tracking-wide text-slate-600 dark:text-slate-300 py-3 px-4"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-16"
                  >
                    <div className="flex justify-center">
                      <Spinner />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors duration-200"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="py-3 px-4 text-sm align-middle"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="text-center py-16 text-muted-foreground"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <svg
                        className="w-12 h-12 text-muted-foreground/30"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                        />
                      </svg>
                      <p>Không có dữ liệu</p>
                      <p className="text-sm text-muted-foreground">
                        Thêm một món ăn để bắt đầu
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.pageIndex === 0}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex - 1,
              }))
            }
            className="h-9"
          >
            ← Trước
          </Button>

          <div className="flex gap-1 items-center px-2">
            {Array.from({ length: meta?.totalPages ?? 1 }, (_, i) => {
              const pageNum = i + 1;
              const isCurrentPage = pagination.pageIndex === i;

              return (
                <Button
                  key={i}
                  variant={isCurrentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({
                      ...prev,
                      pageIndex: i,
                    }))
                  }
                  className="h-9 w-9 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={pagination.pageIndex + 1 >= (meta?.totalPages ?? 1)}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            className="h-9"
          >
            Tiếp →
          </Button>
        </div>
      </div>
    </DishTableContext.Provider>
  );
}
