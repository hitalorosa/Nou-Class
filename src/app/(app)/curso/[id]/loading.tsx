import { Skeleton } from "@/components/Skeleton";

/** Esqueleto da página do curso: player à esquerda, lista de aulas à direita. */
export default function CursoLoading() {
  return (
    <div>
      <Skeleton className="mb-4 h-5 w-40" />
      <Skeleton className="mb-2 h-9 w-2/3" />
      <Skeleton className="mb-6 h-5 w-1/2" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-xl2" />
          <Skeleton className="mt-4 h-7 w-1/2" />
          <Skeleton className="mt-2 h-4 w-3/4" />
        </div>

        <div className="lg:col-span-1">
          <Skeleton className="mb-4 h-24 w-full rounded-xl2" />
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
