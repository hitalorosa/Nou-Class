import { cn } from "@/components/ui";

/** Estrela de oito pontas — a mesma forma do A do wordmark. */
export const ESTRELA_CLIP =
  "polygon(50% 0%,59% 41%,100% 50%,59% 59%,50% 100%,41% 59%,0% 50%,41% 41%)";

/**
 * Wordmark Nouê Estrelas: "NOUÊ" em peso leve, "ESTRELAS" em peso pesado, e a
 * letra A virando uma estrela de oito pontas.
 *
 * A estrela só entra no tamanho grande. A 17px do cabeçalho ela fecha e o olho
 * lê como falha de renderização, não como marca — então lá o A volta a ser
 * letra. Mesma decisão que o design traz nas duas telas.
 */
export function Logo({
  className,
  tamanho = "sm",
}: {
  className?: string;
  tamanho?: "sm" | "lg";
}) {
  const grande = tamanho === "lg";

  return (
    <span
      // A estrela ocupa o lugar da letra A, então sem isto o leitor de tela
      // anuncia "NOUÊ ESTRELS". O nome vem do rótulo; o desenho fica decorativo.
      role="img"
      aria-label="Nouê Estrelas"
      className={cn(
        "inline-flex items-center tracking-[0.04em] text-tinta",
        grande ? "gap-2.5 text-[27px] sm:text-[38px]" : "gap-1.5 text-[17px] sm:text-[19px]",
        className,
      )}
    >
      <span aria-hidden className="font-normal">NOUÊ</span>
      <span aria-hidden className="flex items-center font-extrabold tracking-normal">
        {grande ? (
          <>
            ESTREL
            <span
              aria-hidden
              className="mx-[0.02em] inline-block h-[0.92em] w-[0.92em] bg-current"
              style={{ clipPath: ESTRELA_CLIP }}
            />
            S
          </>
        ) : (
          "ESTRELAS"
        )}
      </span>
    </span>
  );
}
