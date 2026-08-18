import Link from "next/link";
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

  const aguardando = pendentes ?? 0;

  return (
    <div>
      <h1 className="mb-6 font-display text-[30px] font-extrabold text-tinta">
        Painel
      </h1>

      {aguardando > 0 && (
        <Link
          href="/admin/usuarios"
          className="mb-6 flex items-center gap-4 rounded-xl2 border border-ambar bg-ambar-bg px-5 py-4 transition-colors hover:brightness-[0.98]"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ambar font-display text-[19px] font-extrabold text-tinta">
            !
          </span>
          <span className="text-[17px] text-ambar-ink">
            <strong className="font-display font-bold">
              {aguardando}{" "}
              {aguardando === 1
                ? "cadastro esperando liberação."
                : "cadastros esperando liberação."}
            </strong>{" "}
            {aguardando === 1 ? "Ela não vê" : "Elas não veem"} nenhum curso até
            você liberar.
          </span>
          <span className="ml-auto hidden shrink-0 font-display text-[16px] font-bold text-ancora sm:inline">
            Revisar →
          </span>
        </Link>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashCard
          href="/admin/usuarios"
          value={(totalUsers ?? 0) - aguardando}
          label="alunas liberadas"
        />
        <DashCard
          href="/admin/usuarios"
          value={aguardando}
          label="aguardando liberação"
          destaque={aguardando > 0}
        />
        <DashCard
          href="/admin/cursos"
          value={totalCursos ?? 0}
          label={totalCursos === 1 ? "curso" : "cursos"}
        />
      </div>
    </div>
  );
}

function DashCard({
  href,
  value,
  label,
  destaque,
}: {
  href: string;
  value: number;
  label: string;
  destaque?: boolean;
}) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-1 rounded-xl2 border border-tinta/10 bg-white px-6 py-5 transition-shadow hover:shadow-[0_8px_24px_rgba(26,26,26,.12)]"
    >
      <span
        className={`font-display text-[41px] font-extrabold leading-none ${
          destaque ? "text-ambar-ink" : "text-tinta"
        }`}
      >
        {value}
      </span>
      <span className="text-[16px] text-grafite">{label}</span>
    </Link>
  );
}
