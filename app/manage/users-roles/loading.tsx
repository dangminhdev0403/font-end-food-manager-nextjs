export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8 h-16 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-20 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse"
              />
            ))}
          </div>

          {/* Right content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="h-40 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse" />
            <div className="h-96 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
