import DishTable from "@/app/manage/dishes/dish-table";
import {
  Calendar,
  ChefHat,
  TrendingUp,
  UtensilsCrossed,
  Zap,
} from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Quản Lý Món Ăn",
  description: "Quản lý danh sách món ăn nhà hàng",
};

function DishTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-14 bg-secondary/30 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,

  changeType = "positive",
  span = "col-span-1",
}) {
  return (
    <div
      className={`${span} group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 p-6 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function DishesPage() {
  return (
    <main className="flex-1 space-y-8 p-6 md:p-8 bg-gradient-to-br from-background via-background to-background/50">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 border border-primary/40 shadow-lg shadow-primary/10">
                <ChefHat className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground">
                  Quản Lý Món Ăn
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Quản lý danh sách các món ăn của nhà hàng
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid - Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-max">
        <StatCard icon={UtensilsCrossed} label="Tổng Số Món" value="24" />
        <StatCard icon={TrendingUp} label="Doanh Thu" value="₫45.2M" />
        <StatCard icon={Zap} label="Khả Dụng" value="22" />
        <StatCard
          icon={Calendar}
          label="Cần Cập Nhật"
          value="2"
          changeType="warning"
        />
      </div>

      {/* Main Content - Enhanced Table */}
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-card via-card to-card/80 backdrop-blur-xl transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        <Suspense fallback={<DishTableSkeleton />}>
          <DishTable />
        </Suspense>
      </div>
    </main>
  );
}
