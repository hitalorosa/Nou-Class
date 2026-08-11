import Image from "next/image";
import { cn } from "@/components/ui";

/**
 * Logo oficial da Nouê (wordmark preto) + "Class" em verde.
 * Use tagline={false} para mostrar só o wordmark da Nouê.
 */
export function Logo({
  className,
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/noue-logo.png"
        alt="Nouê"
        width={656}
        height={291}
        priority
        className="h-7 w-auto"
      />
      {tagline && (
        <span className="text-xl font-light tracking-tight text-verde">
          Class
        </span>
      )}
    </span>
  );
}
