export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-10 bg-slate-700 rounded-lg w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-slate-700 rounded-lg w-96 animate-pulse" />
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Skeleton */}
          <div className="space-y-3">
            <div className="h-8 bg-slate-700 rounded-lg w-32 animate-pulse" />
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-slate-700 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-slate-700 rounded-lg animate-pulse" />
            <div className="h-64 bg-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
