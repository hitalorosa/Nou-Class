import Image from "next/image";
import { cn } from "@/components/ui";

/**
 * Wordmark oficial da Nouê Estrelas — o arquivo da marca, não uma recriação.
 *
 * Usa a versão PRETA em todo o app. As variantes rosa rendem no máximo 3:1
 * sobre branco (ROSA 1 #EB66A0), e o traço fino do "NOUÊ" a 26px de altura
 * vira borrão nessa faixa — justamente para o público 40+ que a plataforma
 * atende. Rosa é para peça grande; aqui o logo é sempre pequeno, e na tela de
 * acesso o fundo já é rosa claro, o que pioraria ainda mais.
 *
 * As demais variantes (WHITE para fundo escuro, ROXO, ROSA 1/2/3) ficam no
 * Drive da marca, em IDENTIDADE VISUAL/LOGO/WEBP.
 */
export function Logo({
  className,
  tamanho = "sm",
}: {
  className?: string;
  tamanho?: "sm" | "lg";
}) {
  return (
    <Image
      src="/marca/hori-black.webp"
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
