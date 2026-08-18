import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import type { Profile } from "@/lib/types";

export function AppHeader({ profile }: { profile: Profile }) {
  const primeiroNome = profile.full_name?.split(" ")[0];

  return (
    // Cabeçalho branco, para separar do corpo rosa. É a faixa neutra entre a
    // barra do navegador e o mar de âncora que vem abaixo.
    <header className="sticky top-0 z-20 border-b border-tinta/[0.06] bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Início">
          <Logo />
        </Link>
        <div className="flex items-center gap-3 sm:gap-[18px]">
          {profile.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex min-h-[44px] items-center rounded-[13px] bg-roxo px-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90"
            >
              Painel
            </Link>
          )}
          {primeiroNome && (
            <span className="hidden text-[17px] text-grafite sm:inline">
              Oi, <strong className="font-semibold text-tinta">{primeiroNome}</strong>
            </span>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
