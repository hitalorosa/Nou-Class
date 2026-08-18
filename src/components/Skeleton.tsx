import { cn } from "@/components/ui";

/**
 * Bloco cinza pulsante das telas de carregamento.
 *
 * A ideia é desenhar o formato do que vem a seguir — não um spinner solto no
 * meio do nada. A pessoa já entende o layout enquanto o conteúdo chega.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("animate-pulse rounded-xl bg-tinta/[0.07]", className)}
    />
  );
}
