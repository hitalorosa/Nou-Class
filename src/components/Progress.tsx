import { cn } from "@/components/ui";

/** Percentual inteiro de aulas assistidas. Curso sem aula é 0, nunca NaN. */
export function percentual(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/**
 * Barra fina de progresso. Usada no card do catálogo e no topo da lista de
 * aulas. Curso sem aula não renderiza nada — não há o que progredir.
 */
export function ProgressBar({
  done,
  total,
  className,
}: {
  done: number;
  total: number;
  className?: string;
}) {
  if (total <= 0) return null;
  const pct = percentual(done, total);

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${done} de ${total} aulas assistidas`}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-black/10",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-verde transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * Bloco "Meu progresso" com percentual, contagem e barra. Fica no topo da
 * lista de aulas, dentro do curso.
 */
export function ProgressSummary({
  done,
  total,
}: {
  done: number;
  total: number;
}) {
  if (total <= 0) return null;
  const pct = percentual(done, total);
  const completo = done >= total;

  return (
    <div className="mb-4 rounded-xl2 border border-black/10 bg-white p-4">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-tinta">
          {completo ? "Curso concluído 🎉" : "Meu progresso"}
        </span>
        <span
          className={cn(
            "text-sm font-extrabold",
            completo ? "text-verde-dark" : "text-verde",
          )}
        >
          {pct}%
        </span>
      </div>
      <ProgressBar done={done} total={total} />
      <p className="mt-2 text-xs font-semibold text-black/50">
        {done} de {total} {total === 1 ? "aula" : "aulas"}
      </p>
    </div>
  );
}
