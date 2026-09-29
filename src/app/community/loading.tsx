export default function CommunityLoading() {
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

      {/* Search Skeleton */}
      <div className="flex flex-col space-y-4">
        <div className="animate-pulse bg-slate-200 h-12 w-full rounded-xl" />
      </div>

      {/* Feed Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-48 w-full rounded-3xl" />
        ))}
      </div>

    </div>
  );
}
