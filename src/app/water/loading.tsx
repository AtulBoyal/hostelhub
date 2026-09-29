export default function WaterLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header Skeleton */}
      <div className="space-y-3 mt-4">
        <div className="animate-pulse bg-slate-200 h-10 w-56 rounded-md" />
        <div className="animate-pulse bg-slate-200 h-5 w-72 rounded-md" />
      </div>

      {/* Summary Skeleton */}
      <div className="flex gap-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-8 w-28 rounded-full" />
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-48 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
