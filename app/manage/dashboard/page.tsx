import DashboardMain from "@/app/manage/dashboard/dashboard-main";

export default async function Dashboard() {
  return (
    <main className="flex-1 bg-background">
      <div className="container mx-auto space-y-6 px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <header className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Dashboard
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Phân tích nhanh hiệu quả kinh doanh
          </p>
        </header>

        <DashboardMain />
      </div>
    </main>
  );
}
