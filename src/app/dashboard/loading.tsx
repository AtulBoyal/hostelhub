import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-10">
      <section className="mt-4">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-96" />
      </section>

      <section className="space-y-4">
        <Skeleton className="h-4 w-32 ml-1" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <Skeleton className="h-4 w-32 ml-1" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
        <section className="lg:col-span-4 space-y-4">
          <Skeleton className="h-4 w-32 ml-1" />
          <Skeleton className="h-64 rounded-[24px]" />
        </section>
        <section className="lg:col-span-3 space-y-4">
          <Skeleton className="h-4 w-32 ml-1" />
          <Skeleton className="h-64 rounded-[24px]" />
        </section>
      </div>
    </div>
  );
}
