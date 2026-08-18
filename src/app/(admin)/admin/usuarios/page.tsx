import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PendingButton } from "@/components/PendingButton";
import {
  grantAccessAction,
  revokeAccessAction,
  deleteUserAction,
} from "@/app/actions/admin";

export default async function AdminUsuariosPage() {
  const supabase = createClient();
  const me = await getCurrentProfile();

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  const users = (data as Profile[]) ?? [];

  return (
    <div>
      <h1 className="mb-1 font-display text-[30px] font-extrabold text-tinta">Usuárias</h1>
      <p className="mb-6 text-[17px] text-grafite">
        Libere o acesso de quem se cadastrou. Quem está liberado vê todos os
        cursos publicados.
      </p>

      <div className="overflow-hidden rounded-xl2 border border-tinta/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-tinta/10 bg-painel font-display text-[13px] uppercase tracking-[0.08em] text-grafite">
            <tr>
              <th className="px-4 py-3">Pessoa</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-tinta/5">
            {users.map((u) => {
              const isSelf = u.id === me?.id;
              const isAdmin = u.role === "admin";
              return (
                <tr key={u.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="font-display font-bold text-tinta">
                      {u.full_name || "—"}
                    </div>
                    <div className="text-grafite">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge profile={u} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {!isAdmin && !u.access_granted && (
                        <form action={grantAccessAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <PendingButton className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[13px] bg-ancora px-5 font-display text-[16px] font-bold text-white transition-colors hover:bg-ancora-dark disabled:opacity-60">
                            Liberar
                          </PendingButton>
                        </form>
                      )}
                      {!isAdmin && u.access_granted && (
                        <form action={revokeAccessAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <PendingButton className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[13px] border-2 border-tinta/[0.12] px-4 font-display text-[16px] font-bold text-tinta hover:border-tinta hover:bg-tinta hover:text-white disabled:opacity-60">
                            Revogar
                          </PendingButton>
                        </form>
                      )}
                      {!isSelf && !isAdmin && (
                        <form action={deleteUserAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <ConfirmSubmit
                            message={`Excluir ${u.full_name || u.email}? Essa ação não tem volta.`}
                          >
                            <Trash2 size={16} />
                          </ConfirmSubmit>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="px-4 py-10 text-center text-grafite">
            Ninguém cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ profile }: { profile: Profile }) {
  // Cada estado tem ícone + palavra: quem não distingue as cores continua
  // conseguindo separar aguardando de liberada.
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-display text-[15px] font-bold";

  if (profile.role === "admin") {
    return <span className={`${base} bg-tinta text-white`}>★ Admin</span>;
  }
  if (profile.access_granted) {
    return (
      <span className={`${base} border border-ancora-line bg-ancora-light text-ancora-dark`}>
        ✓ Liberada
      </span>
    );
  }
  return (
    <span className={`${base} border border-ambar bg-ambar-bg text-ambar-ink`}>
      ⏳ Aguardando
    </span>
  );
}
