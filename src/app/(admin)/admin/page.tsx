import Link from "next/link";
import { Users, BookOpen, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboard() {
  const supabase = createClient();

  const [{ count: totalUsers }, { count: pendentes }, { count: totalCursos }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("access_granted", false)
        .eq("role", "user"),
      supabase.from("courses").select("*", { count: "exact", head: true }),
    ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-tinta">Painel</h1>

      {(pendentes ?? 0) > 0 && (
        <Link
          href="/admin/usuarios"
          className="mb-6 flex items-center gap-3 rounded-xl2 border border-ambar/40 bg-ambar/10 px-5 py-4 transition-colors hover:bg-ambar/20"
        >
          <Clock className="text-ambar" />
          <span className="font-semibold text-tinta">
            {pendentes} {pendentes === 1 ? "pessoa aguardando" : "pessoas aguardando"}{" "}
            liberação
          </span>
          <span className="ml-auto text-sm font-bold text-verde">Revisar →</span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <DashCard
          href="/admin/usuarios"
          icon={<Users className="text-verde" />}
          label="Usuárias"
          value={totalUsers ?? 0}
        />
        <DashCard
          href="/admin/cursos"
          icon={<BookOpen className="text-verde" />}
          label="Cursos"
          value={totalCursos ?? 0}
        />
      </div>
    </div>
  );
}

function DashCard({
  href,
  icon,
  label,
  value,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-xl2 border border-black/10 bg-white px-6 py-5 transition-shadow hover:shadow-md"
    >
      <div className="rounded-xl bg-verde-light p-3">{icon}</div>
      <div>
        <div className="text-3xl font-extrabold text-tinta">{value}</div>
        <div className="text-sm font-semibold text-black/50">{label}</div>
      </div>
    </Link>
  );
}
