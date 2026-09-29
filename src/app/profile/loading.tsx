export default function ProfileLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      
      {/* Header Skeleton */}
      <div className="mt-4 space-y-3">
        <div className="animate-pulse bg-slate-200 h-10 w-48 rounded-md" />
        <div className="animate-pulse bg-slate-200 h-5 w-80 rounded-md" />
      </div>

      <div className="grid gap-6 md:grid-cols-3 pt-4">
        
        {/* Left Column Skeleton */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm flex flex-col items-center text-center">
            <div className="animate-pulse bg-slate-200 h-24 w-24 rounded-full mb-4" />
            <div className="animate-pulse bg-slate-200 h-6 w-32 rounded-md mb-2" />
            <div className="animate-pulse bg-slate-200 h-4 w-48 rounded-md" />
          </div>
        </div>

        {/* Right Column Skeleton */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[24px] overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100">
              <div className="animate-pulse bg-slate-200 h-5 w-40 rounded-md" />
            </div>
            <div className="p-5 space-y-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center pb-5 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="animate-pulse bg-slate-200 h-4 w-24 rounded-md" />
                  <div className="animate-pulse bg-slate-200 h-4 w-32 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
