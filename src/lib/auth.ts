import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

/**
 * Retorna o usuário autenticado + seu profile, ou null se deslogado.
 * Usa getUser() (revalida o JWT), nunca getSession().
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (profile as Profile) ?? null;
}

/**
 * Garante que o chamador é admin. Lança se não for.
 * Use no começo de todo Server Action de admin, ANTES de tocar o service role.
 */
export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Acesso negado: apenas administradores.");
  }
  return profile;
}
