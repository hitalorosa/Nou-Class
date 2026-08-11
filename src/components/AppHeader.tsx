import Link from "next/link";
import { Shield } from "lucide-react";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import type { Profile } from "@/lib/types";

export function AppHeader({ profile }: { profile: Profile }) {
  const primeiroNome = profile.full_name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          {profile.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-lg bg-tinta px-3 py-1.5 text-sm font-bold text-white hover:bg-black"
            >
              <Shield size={15} /> Painel
            </Link>
          )}
          {primeiroNome && (
            <span className="hidden text-sm text-black/60 sm:inline">
              Oi, <strong className="text-tinta">{primeiroNome}</strong>
            </span>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
