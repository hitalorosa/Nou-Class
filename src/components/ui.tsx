import * as React from "react";

/** Junta classes condicionalmente sem dependência externa. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  block?: boolean;
};

export function Button({
  variant = "primary",
  block,
  className,
  ...props
}: ButtonProps) {
  // min-h-[52px]: o alvo de toque do design, com folga sobre os 44px mínimos.
  const base =
    "inline-flex min-h-[52px] items-center justify-center gap-3 rounded-[13px] px-6 text-[17px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ancora-light focus-visible:ring-offset-0";
  const variants: Record<string, string> = {
    primary: "bg-ancora text-white hover:bg-ancora-dark",
    secondary:
      "border-2 border-tinta bg-white text-tinta hover:bg-tinta hover:text-white",
    ghost: "text-tinta hover:bg-tinta/5",
    danger: "bg-erro text-white hover:brightness-90",
  };
  return (
    <button
      className={cn(base, variants[variant], block && "w-full", className)}
      {...props}
    />
  );
}

// ---------------------------------------------------------------------------
// Input / Textarea / Field
// ---------------------------------------------------------------------------
const campo =
  "w-full rounded-[13px] border-2 border-tinta/[0.12] bg-white px-4 text-[17px] text-tinta placeholder:text-fantasma focus:border-ancora focus:outline-none focus:ring-4 focus:ring-ancora-light";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input ref={ref} className={cn(campo, "min-h-[52px]", className)} {...props} />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea ref={ref} className={cn(campo, "py-3.5", className)} {...props} />
  );
});

export function Field({
  label,
  htmlFor,
  children,
  hint,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1.5 block text-[14px] font-bold text-tinta">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1.5 block text-[15px] leading-snug text-grafite">
          {hint}
        </span>
      )}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Alert
// ---------------------------------------------------------------------------
export function Alert({
  kind = "info",
  children,
}: {
  kind?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    error: "border-erro/30 bg-erro/[0.07] text-erro",
    success: "border-ancora-line bg-ancora-light text-ancora-dark",
    info: "border-tinta/10 bg-tinta/[0.04] text-tinta",
  };
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn(
        "rounded-[13px] border px-4 py-3 text-[15px] leading-relaxed",
        styles[kind],
      )}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spinner
// ---------------------------------------------------------------------------
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent",
        className,
      )}
      aria-hidden
    />
  );
}
