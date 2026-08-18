import Image from "next/image";
import { cn } from "@/components/ui";

/**
 * Wordmark oficial da Nouê Estrelas — arquivos da marca, não recriação.
 *
 * Três combinações usadas no app:
 * - completo escuro: login e telas claras (17,78:1)
 * - completo claro: sobre a âncora, onde a versão preta renderia 3:1
 * - reduzido claro: o cabeçalho rosa, onde "NOUÊ ESTRELAS" inteiro não cabe
 *   nos 30px de altura sem fechar as letras
 *
 * As variantes rosa e roxa ficam no Drive (IDENTIDADE VISUAL/LOGO/WEBP).
 */
export function Logo({
  className,
  tamanho = "sm",
  tom = "escuro",
  arte = "completo",
}: {
  className?: string;
  tamanho?: "sm" | "lg";
  tom?: "escuro" | "claro";
  arte?: "completo" | "reduzido";
}) {
  const src =
    arte === "reduzido"
      ? "/marca/redu-white.webp"
      : tom === "claro"
        ? "/marca/hori-white.webp"
        : "/marca/hori-black.webp";

  return (
    <Image
      src={src}
      alt="Nouê Estrelas"
      width={6316}
      height={1393}
      priority
      sizes={tamanho === "lg" ? "200px" : "150px"}
      className={cn(
        "w-auto",
        tamanho === "lg" ? "h-9 sm:h-11" : "h-[26px] sm:h-[30px]",
        className,
      )}
    />
  );
}
