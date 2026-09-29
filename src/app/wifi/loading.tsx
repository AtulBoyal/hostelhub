import { Skeleton } from "@/components/ui/skeleton";

export default function WifiLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-4">
        <div>
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-6 w-64" />
        </div>
        <Skeleton className="h-10 w-40 rounded-xl" />
      </section>

      <Skeleton className="h-32 rounded-3xl w-full" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
