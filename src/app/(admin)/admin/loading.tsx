import { Skeleton } from "@/components/Skeleton";

/**
 * Esqueleto do painel. Vale pra /admin e pras abas de dentro (usuárias,
 * cursos), já que nenhuma delas tem loading próprio: um cabeçalho e uma
 * sequência de linhas serve pras três.
 */
export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-44" />
      <Skeleton className="h-5 w-96 max-w-full" />

      <div className="overflow-hidden rounded-xl2 border border-black/10">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-4">
            <Skeleton className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-9 w-24 shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
