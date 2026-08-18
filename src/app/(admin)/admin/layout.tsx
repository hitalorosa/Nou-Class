import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentProfile } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/");

  const primeiroNome = profile.full_name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-painel">
      {/* Mesma faixa âncora do app; text-white é o currentColor que o
          LogoutButton e as abas herdam. As abas moram dentro da faixa rosa,
          com sublinhado branco em vez do âncora que usavam no header claro. */}
      <header className="bg-ancora text-white">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/admin" aria-label="Painel">
              <Logo tom="claro" tamanho="md" />
            </Link>
            <span className="rounded-md bg-white px-2 py-1 text-[12px] font-bold uppercase tracking-[0.1em] text-roxo">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-[18px]">
            <Link
              href="/"
              className="hidden text-[16px] font-bold text-white/90 hover:text-white sm:inline"
            >
              Ver como aluna
            </Link>
            {primeiroNome && (
              <span className="hidden text-[17px] text-white/90 sm:inline">
                Oi,{" "}
                <strong className="font-semibold text-white">{primeiroNome}</strong>
              </span>
            )}
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-6 px-4">
          <AdminTab href="/admin/usuarios">Usuárias</AdminTab>
          <AdminTab href="/admin/cursos">Cursos</AdminTab>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

function AdminTab({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[44px] items-center border-b-[3px] border-transparent text-[17px] font-bold text-white/90 transition-colors hover:border-white hover:text-white"
    >
      {children}
    </Link>
  );
}
