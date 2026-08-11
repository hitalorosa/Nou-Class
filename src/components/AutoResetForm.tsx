"use client";

import { useRef } from "react";

/**
 * Form que chama uma Server Action e limpa os campos quando termina.
 * Bom para formulários de "criar" (curso, aula).
 */
export function AutoResetForm({
  action,
  className,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      className={className}
      action={async (formData) => {
        await action(formData);
        ref.current?.reset();
      }}
    >
      {children}
    </form>
  );
}
