import { cn } from "@/components/ui";

/** Percentual inteiro de aulas assistidas. Curso sem aula é 0, nunca NaN. */
export function percentual(done: number, total: number): number {
  if (total <= 0) return 0;
  return Math.min(100, Math.round((done / total) * 100));
}

/**
 * Barra fina de progresso. Curso terminado vira roxo — a mesma cor da estrela
 * de conclusão, pra que "acabei" seja um estado visual próprio e não só uma
 * barra cheia da mesma cor de quem está no meio.
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
  const completo = done >= total;

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${done} de ${total} aulas assistidas`}
      className={cn(
        "h-1.5 w-full overflow-hidden rounded-full bg-tinta/10",
        className,
      )}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width] duration-500 ease-out",
          completo ? "bg-roxo" : "bg-ancora",
        )}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * Estrela de quatro pontas — a forma da marca, usada como selo de "concluído".
 *
 * Redesenhada em SVG em vez de usar o arquivo da marca: aqui ela aparece a
 * 20px, tamanho em que o contorno duplo do logotipo original fecha e some.
 * Herda a cor do texto, então serve em roxo no card e em branco sobre fundo
 * cheio sem virar dois arquivos.
 */
export function Estrela({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden
      className={cn("inline-block fill-current", className)}
    >
      <path d="M50 2 C 56 32, 68 44, 98 50 C 68 56, 56 68, 50 98 C 44 68, 32 56, 2 50 C 32 44, 44 32, 50 2 Z" />
    </svg>
  );
}

/**
 * Bloco "Meu progresso" com percentual, barra e contagem. Fica no topo da
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
    <div className="mb-4 flex flex-col gap-2.5 rounded-xl2 border border-tinta/5 bg-white p-5 shadow-[0_2px_10px_rgba(26,26,26,.05)]">
      <span className="text-[14px] font-bold uppercase tracking-[0.06em] text-grafite">
        {completo ? "Curso concluído" : "Meu progresso"}
      </span>
      <span
        className={cn(
          "text-[41px] font-extrabold leading-none",
          completo ? "text-roxo" : "text-ancora",
        )}
      >
        {pct}%
      </span>
      <ProgressBar done={done} total={total} />
      <span className="text-[16px] text-grafite">
        {done} de {total} {total === 1 ? "aula" : "aulas"}
      </span>
    </div>
  );
}
