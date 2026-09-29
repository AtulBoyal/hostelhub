export default function NeedHaveLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div className="space-y-3">
          <div className="animate-pulse bg-slate-200 h-10 w-64 rounded-md" />
          <div className="animate-pulse bg-slate-200 h-5 w-80 rounded-md" />
        </div>
        <div className="animate-pulse bg-slate-200 h-11 w-40 rounded-xl" />
      </div>

      {/* Tabs & Search Skeleton */}
      <div className="flex flex-col space-y-4">
        <div className="animate-pulse bg-slate-200 h-12 w-full max-w-sm rounded-xl" />
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="animate-pulse bg-slate-200 h-11 w-full rounded-xl" />
          <div className="animate-pulse bg-slate-200 h-11 w-full sm:w-48 rounded-xl" />
        </div>
      </div>

      {/* Feed Skeleton */}
      <div className="space-y-4 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-36 w-full rounded-3xl" />
        ))}
      </div>

    </div>
  );
}
