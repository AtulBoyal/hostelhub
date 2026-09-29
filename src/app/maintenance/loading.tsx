export default function MaintenanceLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header & Button Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div className="space-y-3">
          <div className="animate-pulse bg-slate-200 h-10 w-64 rounded-md" />
          <div className="animate-pulse bg-slate-200 h-5 w-80 rounded-md" />
        </div>
        <div className="animate-pulse bg-slate-200 h-11 w-40 rounded-xl" />
      </div>

      {/* Summary Skeleton */}
      <div className="flex gap-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-10 w-28 rounded-full" />
        ))}
      </div>

      {/* Filters Skeleton */}
      <div className="flex gap-3 py-4 border-b border-slate-100">
        <div className="animate-pulse bg-slate-200 h-10 w-full max-w-xs rounded-xl" />
        <div className="animate-pulse bg-slate-200 h-10 w-32 rounded-xl" />
        <div className="animate-pulse bg-slate-200 h-10 w-32 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-36 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
