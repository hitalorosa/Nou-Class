"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/components/ui";

/** Botão de submit que pede confirmação antes de enviar (para ações destrutivas). */
export function ConfirmSubmit({
  children,
  message,
  className,
}: {
  children: React.ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-semibold text-erro transition-opacity hover:opacity-80 disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}
