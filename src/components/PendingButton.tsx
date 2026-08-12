"use client";

import { useFormStatus } from "react-dom";
import { Spinner, cn } from "@/components/ui";

/**
 * Botão de submit sem visual próprio, que se desabilita e mostra um spinner
 * enquanto a Server Action roda.
 *
 * É pras ações rápidas do painel — publicar, reordenar. Elas parecem
 * instantâneas numa conexão boa, mas no 4G do salão levam um segundo, e sem
 * retorno nenhum a pessoa clica de novo achando que falhou.
 *
 * Precisa estar dentro do <form> da ação: `useFormStatus` lê o form pai.
 */
export function PendingButton({
  children,
  className,
  disabled,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  title?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      title={title}
      disabled={pending || disabled}
      aria-busy={pending}
      className={cn(className, "disabled:cursor-not-allowed")}
    >
      {pending ? <Spinner /> : children}
    </button>
  );
}
