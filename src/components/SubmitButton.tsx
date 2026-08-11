"use client";

import { useFormStatus } from "react-dom";
import { Button, Spinner } from "@/components/ui";

/**
 * Botão de submit que mostra estado de carregando automaticamente
 * dentro de um <form action={serverAction}>.
 */
export function SubmitButton({
  children,
  pendingLabel,
  variant = "primary",
  block = true,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  block?: boolean;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant={variant} block={block} disabled={pending}>
      {pending ? (
        <>
          <Spinner /> {pendingLabel ?? "Aguarde…"}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
