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
      <h1 className="mb-1 text-2xl font-bold text-tinta">Usuárias</h1>
      <p className="mb-6 text-black/60">
        Libere o acesso de quem se cadastrou. Quem está liberado vê todos os
        cursos publicados.
      </p>

      <div className="overflow-hidden rounded-xl2 border border-black/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.02] text-xs uppercase tracking-wide text-black/50">
            <tr>
              <th className="px-4 py-3">Pessoa</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {users.map((u) => {
              const isSelf = u.id === me?.id;
              const isAdmin = u.role === "admin";
              return (
                <tr key={u.id} className="align-middle">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-tinta">
                      {u.full_name || "—"}
                    </div>
                    <div className="text-black/50">{u.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge profile={u} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      {!isAdmin && !u.access_granted && (
                        <form action={grantAccessAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <PendingButton className="inline-flex items-center justify-center gap-2 rounded-xl bg-verde px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-verde-dark disabled:opacity-60">
                            Liberar
                          </PendingButton>
                        </form>
                      )}
                      {!isAdmin && u.access_granted && (
                        <form action={revokeAccessAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <PendingButton className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-black/15 px-4 py-2 text-sm font-bold text-tinta hover:border-ambar hover:text-ambar disabled:opacity-60">
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
          <p className="px-4 py-10 text-center text-black/50">
            Ninguém cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ profile }: { profile: Profile }) {
  if (profile.role === "admin") {
    return (
      <span className="rounded-full bg-tinta px-2.5 py-1 text-xs font-bold text-white">
        Admin
      </span>
    );
  }
  if (profile.access_granted) {
    return (
      <span className="rounded-full bg-verde-light px-2.5 py-1 text-xs font-bold text-verde-dark">
        Liberada
      </span>
    );
  }
  return (
    <span className="rounded-full bg-ambar/20 px-2.5 py-1 text-xs font-bold text-ambar">
      Aguardando
    </span>
  );
}
