export default function DashboardLoading() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Hero Skeleton */}
      <div className="space-y-3 mt-4">
        <div className="animate-pulse bg-slate-200 h-10 w-72 rounded-md" />
        <div className="animate-pulse bg-slate-200 h-5 w-60 rounded-md" />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="animate-pulse bg-slate-200 h-6 w-40 rounded-md" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-28 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Status Skeleton */}
      <div className="space-y-4 pt-4">
        <div className="animate-pulse bg-slate-200 h-6 w-48 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-20 w-full rounded-2xl" />
          ))}
        </div>
      </div>

      {/* Split section Skeleton */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7 pt-6">
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center mb-6">
             <div className="animate-pulse bg-slate-200 h-6 w-48 rounded-md" />
             <div className="animate-pulse bg-slate-200 h-5 w-20 rounded-md" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-24 w-full rounded-2xl" />
          ))}
        </div>
        <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-6">
             <div className="animate-pulse bg-slate-200 h-6 w-40 rounded-md" />
             <div className="animate-pulse bg-slate-200 h-5 w-20 rounded-md" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
