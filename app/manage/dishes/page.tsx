import DishTable from "@/app/manage/dishes/dish-table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  TrendingUp,
  UtensilsCrossed,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Quản Lý Món Ăn",
  description: "Quản lý danh sách món ăn nhà hàng",
};

function DishTableSkeleton() {
  return (
    <Card>
      <CardContent className="space-y-3 p-4 sm:p-6">
        {Array.from({ length: 5 }, (_, i) => `dish-skeleton-${i}`).map(
          (key) => (
            <Skeleton key={key} className="h-14 w-full rounded-md" />
          ),
        )}
      </CardContent>
    </Card>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: LucideIcon;
  label: string;
  value: string;
}>) {
  return (
    <Card className="transition-shadow duration-base hover:shadow-md">
      <CardContent className="space-y-3 p-4 sm:p-5">
        <div className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden />
        </div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DishesPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Quản lý món ăn
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Quản lý danh sách các món ăn của nhà hàng
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={UtensilsCrossed} label="Tổng số món" value="24" />
          <StatCard icon={TrendingUp} label="Doanh thu" value="₫45.2M" />
          <StatCard icon={Zap} label="Khả dụng" value="22" />
          <StatCard icon={Calendar} label="Cần cập nhật" value="2" />
        </div>

        <Suspense fallback={<DishTableSkeleton />}>
          <DishTable />
        </Suspense>
      </div>
    </main>
  );
}
