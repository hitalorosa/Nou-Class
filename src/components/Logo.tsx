import Image from "next/image";
import { cn } from "@/components/ui";

/**
 * Wordmark oficial da Nouê Estrelas — o arquivo da marca, não uma recriação.
 *
 * Duas versões, escolhidas por contraste e não por gosto:
 *
 * - `escuro` (padrão): a preta, sobre fundo claro. 17,78:1.
 * - `claro`: a branca, sobre a âncora #C21B6D. Ali a preta renderia só
 *   3,1:1 e o traço fino do "NOUÊ" sumiria; a branca rende 5,72:1.
 *
 * As variantes rosa da marca não entram aqui: rendem no máximo 3:1 sobre
 * branco, e o logo no app é sempre pequeno (26px no cabeçalho). Elas ficam
 * no Drive, em IDENTIDADE VISUAL/LOGO/WEBP, junto com ROXO e as verticais.
 */
export function Logo({
  className,
  tamanho = "sm",
  tom = "escuro",
}: {
  className?: string;
  tamanho?: "sm" | "lg";
  tom?: "escuro" | "claro";
}) {
  return (
    <Image
      src={tom === "claro" ? "/marca/hori-white.webp" : "/marca/hori-black.webp"}
      alt="Nouê Estrelas"
      width={6316}
      height={1393}
      priority
      sizes={tamanho === "lg" ? "200px" : "120px"}
      className={cn(
        "w-auto",
        tamanho === "lg" ? "h-9 sm:h-11" : "h-[26px]",
        className,
      )}
    />
  );
}
