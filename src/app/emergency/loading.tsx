import { Skeleton } from "@/components/ui/skeleton";

export default function EmergencyLoading() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <section className="mt-4">
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-6 w-96" />
      </section>

      <section className="space-y-4">
        <Skeleton className="h-4 w-32 ml-1" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-3xl" />
          ))}
        </div>
      </section>

      <section className="space-y-4 pt-4">
        <Skeleton className="h-4 w-32 ml-1" />
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-3xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
