export default function AnnouncementsLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      
      {/* Header Skeleton */}
      <div className="space-y-3 mt-4">
        <div className="animate-pulse bg-slate-200 h-10 w-64 rounded-md" />
        <div className="animate-pulse bg-slate-200 h-5 w-80 rounded-md" />
      </div>

      {/* Search & Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 py-2 border-b border-slate-100">
        <div className="animate-pulse bg-slate-200 h-11 w-full rounded-xl" />
        <div className="animate-pulse bg-slate-200 h-11 w-32 rounded-xl" />
      </div>

      {/* Important Announcements Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="animate-pulse bg-slate-200 h-6 w-48 rounded-md mb-2" />
        <div className="animate-pulse bg-slate-200 h-32 w-full rounded-3xl" />
      </div>

      {/* Feed Skeleton */}
      <div className="space-y-4 pt-6">
        <div className="animate-pulse bg-slate-200 h-6 w-32 rounded-md mb-2" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-28 w-full rounded-3xl" />
        ))}
      </div>

    </div>
  );
}
