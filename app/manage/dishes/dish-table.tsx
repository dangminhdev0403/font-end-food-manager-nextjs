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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";
import { formatCurrency } from "@/lib/utils";
import { productResource } from "@/resources/product.resource";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Inbox, Search } from "lucide-react";

type DishItem = {
  id: number;
  name: string | null;
  description: string | null;
  basePrice: number;
  images: string[] | null;
};

const PAGE_SIZE = 10;

const DishTableContext = createContext<{
  setDishIdEdit: (id: number) => void;
  setDishDelete: (dish: DishItem) => void;
}>({ setDishIdEdit: () => {}, setDishDelete: () => {} });

const columns: ColumnDef<DishItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        {row.original.id}
      </span>
    ),
  },
  {
    id: "image",
    header: "Ảnh",
    cell: ({ row }) => (
      <Avatar className="size-12 rounded-md">
        <AvatarImage
          src={row.original.images?.[0]}
          alt={row.original.name ?? "Ảnh món ăn"}
        />
        <AvatarFallback className="rounded-md text-xs">
          {row.original.name?.slice(0, 2).toUpperCase() ?? "—"}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => (
      <span className="font-medium text-foreground">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "basePrice",
    header: "Giá",
    cell: ({ row }) => (
      <span className="tabular-nums text-foreground">
        {formatCurrency(row.original.basePrice)}
      </span>
    ),
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <p className="line-clamp-2 max-w-prose text-sm text-muted-foreground">
        {row.original.description}
      </p>
    ),
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Hành động</span>,
    cell: ({ row }) => {
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext);
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              aria-label={`Tuỳ chọn cho ${row.original.name ?? "món ăn"}`}
            >
              <DotsHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDishIdEdit(row.original.id)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setDishDelete(row.original)}
              className="text-destructive focus:text-destructive"
            >
              Xoá
            </DropdownMenuItem>
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
        if (!value) setDishDelete(null);
      }}
    >
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Xoá món ăn</AlertDialogTitle>
          <AlertDialogDescription>
            Món{" "}
            <span className="font-semibold text-destructive">
              {dishDelete?.name}
            </span>{" "}
            sẽ bị xoá vĩnh viễn. Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel className="h-10">Huỷ</AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteMutation.isPending}
            className="h-10"
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
            {deleteMutation.isPending ? "Đang xoá..." : "Xoá"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function MobileDishCard({
  dish,
  onEdit,
  onDelete,
}: {
  dish: DishItem;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <Card>
      <CardContent className="flex gap-3 p-4">
        <Avatar className="size-16 shrink-0 rounded-md">
          <AvatarImage src={dish.images?.[0]} alt={dish.name ?? ""} />
          <AvatarFallback className="rounded-md text-xs">
            {dish.name?.slice(0, 2).toUpperCase() ?? "—"}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className="truncate font-medium text-foreground">{dish.name}</p>
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {dish.description}
          </p>
          <p className="mt-1 text-sm font-semibold tabular-nums text-foreground">
            {formatCurrency(dish.basePrice)}
          </p>
        </div>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-9 shrink-0"
              aria-label={`Tuỳ chọn cho ${dish.name ?? "món ăn"}`}
            >
              <DotsHorizontalIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>Sửa</DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              Xoá
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
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
    state: { pagination },
    manualPagination: true,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
  });

  const contextValue = useMemo(
    () => ({
      setDishIdEdit: (id: number) => setDishIdEdit(id),
      setDishDelete: (dish: DishItem) => setDishDelete(dish),
    }),
    [],
  );

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <DishTableContext.Provider value={contextValue}>
      <EditDish id={dishIdEdit} setId={setDishIdEdit} />
      <AlertDialogDeleteDish
        dishDelete={dishDelete}
        setDishDelete={setDishDelete}
        deleteMutation={deleteMutation}
      />

      <div className="space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              placeholder="Tìm món ăn..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-11 pl-9"
              aria-label="Tìm món ăn"
            />
          </div>
          <div className="flex items-center justify-between gap-3 md:justify-end">
            <p className="text-sm text-muted-foreground">
              Hiện{" "}
              <span className="font-medium text-foreground">
                {listTable.length}
              </span>
              {" / "}
              <span className="font-medium text-foreground">
                {meta?.totalItems ?? 0}
              </span>{" "}
              món
            </p>
            <AddDish />
          </div>
        </div>

        <Card className="hidden overflow-hidden md:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
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
                    className="py-16 text-center"
                  >
                    <div className="flex justify-center">
                      <Spinner className="size-6" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-3 align-middle"
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
                    className="py-16 text-center"
                  >
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Inbox className="size-10" aria-hidden />
                      <p className="font-medium text-foreground">
                        Không có dữ liệu
                      </p>
                      <p className="text-sm">Thêm một món ăn để bắt đầu</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        <div className="space-y-3 md:hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="size-6" />
            </div>
          ) : listTable.length ? (
            listTable.map((dish: DishItem) => (
              <MobileDishCard
                key={dish.id}
                dish={dish}
                onEdit={() => setDishIdEdit(dish.id)}
                onDelete={() => setDishDelete(dish)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center gap-2 p-8 text-center text-muted-foreground">
                <Inbox className="size-10" aria-hidden />
                <p className="font-medium text-foreground">Không có dữ liệu</p>
                <p className="text-sm">Thêm một món ăn để bắt đầu</p>
              </CardContent>
            </Card>
          )}
        </div>

        {totalPages > 1 && (
          <nav
            aria-label="Phân trang"
            className="flex flex-wrap items-center justify-center gap-2 pt-2"
          >
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
              className="h-10 px-3"
            >
              Trước
            </Button>

            <div className="flex flex-wrap items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                const isCurrent = pagination.pageIndex === i;
                return (
                  <Button
                    key={i}
                    variant={isCurrent ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      setPagination((prev) => ({ ...prev, pageIndex: i }))
                    }
                    aria-current={isCurrent ? "page" : undefined}
                    className="h-10 min-w-10"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={pagination.pageIndex + 1 >= totalPages}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  pageIndex: prev.pageIndex + 1,
                }))
              }
              className="h-10 px-3"
            >
              Tiếp
            </Button>
          </nav>
        )}
      </div>
    </DishTableContext.Provider>
  );
}
