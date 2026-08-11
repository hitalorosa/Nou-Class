"use server";

import { createClient } from "@/lib/supabase/server";

/**
 * Marca/desmarca uma aula como assistida para o usuário logado.
 * A RLS garante que ninguém grava progresso de outra pessoa.
 */
export async function setWatched(lessonId: string, watched: boolean) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "nao-autenticado" };

  if (watched) {
    const { error } = await supabase
      .from("lesson_progress")
      .upsert(
        { user_id: user.id, lesson_id: lessonId },
        { onConflict: "user_id,lesson_id" },
      );
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", user.id)
      .eq("lesson_id", lessonId);
    if (error) return { error: error.message };
  }
  return { ok: true };
}
