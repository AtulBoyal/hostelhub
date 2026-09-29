export default function WifiLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div className="space-y-3">
          <div className="animate-pulse bg-slate-200 h-10 w-48 rounded-md" />
          <div className="animate-pulse bg-slate-200 h-5 w-64 rounded-md" />
        </div>
        <div className="animate-pulse bg-slate-200 h-11 w-44 rounded-xl" />
      </div>

      {/* Main Status Hero Skeleton */}
      <div className="animate-pulse bg-slate-200 h-32 w-full rounded-3xl" />

      {/* Grid for Floors and Issues Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Floors Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="animate-pulse bg-slate-200 h-6 w-32 rounded-md mb-2" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-16 w-full rounded-2xl" />
          ))}
        </div>

        {/* Issues Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="animate-pulse bg-slate-200 h-6 w-40 rounded-md mb-2" />
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse bg-slate-200 h-36 w-full rounded-3xl" />
          ))}
        </div>

      </div>

    </div>
  );
}
