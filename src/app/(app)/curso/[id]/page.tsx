import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Course, Lesson } from "@/lib/types";
import { CoursePlayer } from "./_components/CoursePlayer";

export default async function CursoPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single<Course>();

  if (!course) notFound();

  // `is_published` explícito: esta é a visão da aluna. A RLS já esconde
  // rascunho de quem não é admin, mas o admin usa "Ver como aluna" pra
  // conferir o curso — e aí precisa ver o mesmo que ela vê, senão a barra
  // de progresso conta aula que ninguém consegue assistir.
  const { data: lessonsData } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("position", { ascending: true });

  const lessons = (lessonsData as Lesson[]) ?? [];

  // Progresso do usuário (quais aulas ele já assistiu)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  let watchedIds: string[] = [];
  if (user && lessons.length) {
    const { data: progress } = await supabase
      .from("lesson_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in(
        "lesson_id",
        lessons.map((l) => l.id),
      );
    watchedIds = (progress ?? []).map((p) => p.lesson_id);
  }

  return (
    <div>
      <Link
        href="/"
        className="mb-5 inline-flex min-h-[44px] items-center gap-2 text-[17px] font-bold text-white/90 hover:text-white"
      >
        <ChevronLeft size={16} /> Voltar aos cursos
      </Link>

      <div className="mb-6">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-tight text-white sm:text-[41px]">
          {course.title}
        </h1>
        {course.description && (
          <p className="mt-2 max-w-2xl text-[17px] leading-relaxed text-white/90">{course.description}</p>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-xl2 bg-white px-6 py-16 text-center text-grafite shadow-[0_2px_10px_rgba(26,26,26,.05)]">
          Esse curso ainda não tem aulas publicadas. Volte em breve ✦
        </div>
      ) : (
        <CoursePlayer
          lessons={lessons}
          initialWatched={watchedIds}
        />
      )}
    </div>
  );
}
