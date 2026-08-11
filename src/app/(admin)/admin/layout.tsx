import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, BookOpen, Eye } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-black/[0.02]">
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link href="/admin">
              <Logo tagline={false} />
            </Link>
            <span className="rounded-md bg-tinta px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-black/60 hover:text-verde"
            >
              <Eye size={16} /> Ver como aluna
            </Link>
            <LogoutButton />
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 px-4">
          <AdminTab href="/admin/usuarios" icon={<Users size={16} />}>
            Usuárias
          </AdminTab>
          <AdminTab href="/admin/cursos" icon={<BookOpen size={16} />}>
            Cursos
          </AdminTab>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}

function AdminTab({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 border-b-2 border-transparent px-3 py-3 text-sm font-bold text-black/60 hover:border-verde hover:text-verde"
    >
      {icon}
      {children}
    </Link>
  );
}
