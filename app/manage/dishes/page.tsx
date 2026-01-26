import { Suspense } from "react";
import { ChefHat, Loader2 } from "lucide-react";
import DishTable from "@/app/manage/dishes/dish-table";

export const metadata = {
  title: "Quản Lý Món Ăn",
  description: "Quản lý danh sách món ăn nhà hàng",
};

function DishTableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 bg-muted/40 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}

export default function DishesPage() {
  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <ChefHat className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Quản Lý Món Ăn
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý và cập nhật danh sách các món ăn của nhà hàng
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <Suspense fallback={<DishTableSkeleton />}>
          <DishTable />
        </Suspense>
      </div>
    </main>
  );
}
