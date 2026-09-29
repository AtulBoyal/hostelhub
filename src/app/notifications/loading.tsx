export default function NotificationsLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div className="space-y-3">
          <div className="animate-pulse bg-slate-200 h-10 w-48 rounded-md" />
          <div className="animate-pulse bg-slate-200 h-5 w-64 rounded-md" />
        </div>
        <div className="animate-pulse bg-slate-200 h-10 w-36 rounded-xl" />
      </div>

      {/* Feed Skeleton */}
      <div className="space-y-3 pt-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse bg-slate-200 h-28 w-full rounded-2xl" />
        ))}
      </div>

    </div>
  );
}
