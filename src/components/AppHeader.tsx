import Link from "next/link";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";
import type { Profile } from "@/lib/types";

export function AppHeader({ profile }: { profile: Profile }) {
  const primeiroNome = profile.full_name?.split(" ")[0];

  return (
    // Faixa âncora com tudo em branco: a marca aparece no topo de toda tela
    // logada, não só no login. text-white aqui vira o currentColor que o
    // LogoutButton herda.
    <header className="sticky top-0 z-20 bg-ancora text-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" aria-label="Início">
          <Logo tom="claro" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-[18px]">
          {profile.role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex min-h-[44px] items-center rounded-[13px] bg-white px-4 text-[16px] font-bold text-ancora-dark transition-opacity hover:opacity-90"
            >
              Painel
            </Link>
          )}
          {primeiroNome && (
            <span className="hidden text-[17px] text-white/90 sm:inline">
              Oi, <strong className="font-semibold text-white">{primeiroNome}</strong>
            </span>
          )}
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
