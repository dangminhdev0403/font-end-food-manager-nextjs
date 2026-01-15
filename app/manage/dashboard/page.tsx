import DashboardMain from "@/app/manage/dashboard/dashboard-main";

export default async function Dashboard() {
  return (
    <main className="min-h-screen w-full flex-1 bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="px-6 sm:px-6 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Phân tích nhanh hiệu quả kinh doanh
          </p>
        </div>

        <DashboardMain />
      </div>
    </main>
  );
}
