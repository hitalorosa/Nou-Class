"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractYouTubeId } from "@/lib/youtube";

/**
 * Valida que o chamador é admin e devolve o client service_role.
 * requireAdmin() lança se não for admin — nada roda depois.
 */
async function adminGuard() {
  await requireAdmin();
  return createAdminClient();
}

function str(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

// ===========================================================================
// USUÁRIOS
// ===========================================================================

export async function grantAccessAction(formData: FormData) {
  const supabase = await adminGuard();
  await supabase
    .from("profiles")
    .update({ access_granted: true })
    .eq("id", str(formData, "userId"));
  revalidatePath("/admin/usuarios");
}

export async function revokeAccessAction(formData: FormData) {
  const supabase = await adminGuard();
  await supabase
    .from("profiles")
    .update({ access_granted: false })
    .eq("id", str(formData, "userId"));
  revalidatePath("/admin/usuarios");
}

export async function deleteUserAction(formData: FormData) {
  const supabase = await adminGuard();
  const userId = str(formData, "userId");
  // Remove do auth; o cascade limpa profiles e lesson_progress.
  await supabase.auth.admin.deleteUser(userId);
  revalidatePath("/admin/usuarios");
}

// ===========================================================================
// CURSOS
// ===========================================================================

export async function createCourseAction(formData: FormData) {
  const supabase = await adminGuard();
  const title = str(formData, "title");
  if (!title) return;
  const { count } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });
  await supabase.from("courses").insert({
    title,
    description: str(formData, "description") || null,
    cover_url: str(formData, "cover_url") || null,
    position: count ?? 0,
  });
  revalidatePath("/admin/cursos");
  revalidatePath("/");
}

export async function updateCourseAction(formData: FormData) {
  const supabase = await adminGuard();
  const id = str(formData, "id");
  await supabase
    .from("courses")
    .update({
      title: str(formData, "title"),
      description: str(formData, "description") || null,
      cover_url: str(formData, "cover_url") || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  revalidatePath(`/admin/cursos/${id}`);
  revalidatePath("/admin/cursos");
  revalidatePath("/");
}

export async function deleteCourseAction(formData: FormData) {
  const supabase = await adminGuard();
  await supabase.from("courses").delete().eq("id", str(formData, "id"));
  revalidatePath("/admin/cursos");
  revalidatePath("/");
}

export async function toggleCoursePublishedAction(formData: FormData) {
  const supabase = await adminGuard();
  const id = str(formData, "id");
  const publish = str(formData, "publish") === "1";
  await supabase
    .from("courses")
    .update({ is_published: publish, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/admin/cursos");
  revalidatePath("/");
}

export async function moveCourseAction(formData: FormData) {
  const supabase = await adminGuard();
  const id = str(formData, "id");
  const dir = str(formData, "dir");
  const { data: rows } = await supabase
    .from("courses")
    .select("id, position")
    .order("position", { ascending: true });
  await swapPositions(supabase, "courses", rows ?? [], id, dir);
  revalidatePath("/admin/cursos");
  revalidatePath("/");
}

// ===========================================================================
// AULAS
// ===========================================================================

export async function createLessonAction(formData: FormData) {
  const supabase = await adminGuard();
  const courseId = str(formData, "courseId");
  const title = str(formData, "title");
  if (!courseId || !title) return;

  const link = str(formData, "youtubeUrl");
  const youtubeId = extractYouTubeId(link);
  // Campo preenchido que não deu pra ler: para tudo e avisa. Criar a aula
  // sem vídeo aqui faria ela nascer em standby "sem motivo aparente".
  if (link && !youtubeId) redirect(`/admin/cursos/${courseId}?erro=link`);

  const { count } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", courseId);
  await supabase.from("lessons").insert({
    course_id: courseId,
    title,
    description: str(formData, "description") || null,
    youtube_id: youtubeId,
    position: count ?? 0,
  });
  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath(`/curso/${courseId}`);
}

export async function updateLessonAction(formData: FormData) {
  const supabase = await adminGuard();
  const id = str(formData, "id");
  const courseId = str(formData, "courseId");

  const link = str(formData, "youtubeUrl");
  const youtubeId = extractYouTubeId(link);

  // Campo preenchido que não deu pra ler NÃO é o mesmo que campo vazio.
  //
  // Antes os dois casos caíam em `youtube_id: null`, o que apagava o vídeo
  // que já estava salvo e despublicava a aula em silêncio: a página voltava
  // parecendo normal e o vídeo tinha sumido. Agora só o campo vazio limpa —
  // link ilegível volta com aviso e a aula fica intacta.
  if (link && !youtubeId) redirect(`/admin/cursos/${courseId}?erro=link`);

  // Campo vazio de propósito → volta pro standby (não dá pra ficar publicada).
  const patch: Record<string, unknown> = {
    title: str(formData, "title"),
    description: str(formData, "description") || null,
    youtube_id: youtubeId,
    updated_at: new Date().toISOString(),
  };
  if (!youtubeId) patch.is_published = false;
  await supabase.from("lessons").update(patch).eq("id", id);
  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath(`/curso/${courseId}`);
}

export async function deleteLessonAction(formData: FormData) {
  const supabase = await adminGuard();
  const courseId = str(formData, "courseId");
  await supabase.from("lessons").delete().eq("id", str(formData, "id"));
  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath(`/curso/${courseId}`);
}

export async function toggleLessonPublishedAction(formData: FormData) {
  const supabase = await adminGuard();
  const id = str(formData, "id");
  const courseId = str(formData, "courseId");
  const publish = str(formData, "publish") === "1";
  // O banco também barra publicar sem vídeo; aqui evitamos o erro.
  const { data: lesson } = await supabase
    .from("lessons")
    .select("youtube_id")
    .eq("id", id)
    .single();
  if (publish && !lesson?.youtube_id) return; // não publica sem vídeo
  await supabase
    .from("lessons")
    .update({ is_published: publish, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath(`/curso/${courseId}`);
}

export async function moveLessonAction(formData: FormData) {
  const supabase = await adminGuard();
  const id = str(formData, "id");
  const courseId = str(formData, "courseId");
  const dir = str(formData, "dir");
  const { data: rows } = await supabase
    .from("lessons")
    .select("id, position")
    .eq("course_id", courseId)
    .order("position", { ascending: true });
  await swapPositions(supabase, "lessons", rows ?? [], id, dir);
  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath(`/curso/${courseId}`);
}

// ===========================================================================
// helper de reordenação (troca posição com o vizinho)
// ===========================================================================
async function swapPositions(
  supabase: ReturnType<typeof createAdminClient>,
  table: "courses" | "lessons",
  rows: { id: string; position: number }[],
  id: string,
  dir: string,
) {
  const idx = rows.findIndex((r) => r.id === id);
  if (idx === -1) return;
  const swapIdx = dir === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= rows.length) return;
  const a = rows[idx];
  const b = rows[swapIdx];
  await supabase.from(table).update({ position: b.position }).eq("id", a.id);
  await supabase.from(table).update({ position: a.position }).eq("id", b.id);
}
