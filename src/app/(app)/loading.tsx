import { Skeleton } from "@/components/Skeleton";

/** Esqueleto do catálogo: hero + três cards de curso. */
export default function CatalogoLoading() {
  return (
    <div>
      <Skeleton className="mb-10 h-72 w-full rounded-xl2 md:h-96" />

      <div className="mb-8 space-y-2">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-5 w-80 max-w-full" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl2 border border-tinta/10"
          >
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-3 p-5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
