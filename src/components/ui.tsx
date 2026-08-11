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
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-base font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde";
  const variants: Record<string, string> = {
    primary: "bg-verde text-white hover:bg-verde-dark",
    secondary:
      "border-2 border-tinta bg-white text-tinta hover:bg-tinta hover:text-white",
    ghost: "text-tinta hover:bg-black/5",
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
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-tinta placeholder:text-black/40 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/30",
        className,
      )}
      {...props}
    />
  );
});

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-base text-tinta placeholder:text-black/40 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/30",
        className,
      )}
      {...props}
    />
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
      <span className="mb-1.5 block text-sm font-bold text-tinta">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-sm text-black/50">{hint}</span>}
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
    error: "bg-erro/10 text-erro border-erro/30",
    success: "bg-verde-light text-verde-dark border-verde/30",
    info: "bg-black/5 text-tinta border-black/10",
  };
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      className={cn("rounded-xl border px-4 py-3 text-sm", styles[kind])}
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
