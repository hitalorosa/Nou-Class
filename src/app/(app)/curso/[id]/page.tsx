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

  const { data: lessonsData } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
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
        className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-black/60 hover:text-verde"
      >
        <ChevronLeft size={16} /> Voltar aos cursos
      </Link>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-tinta sm:text-3xl">
          {course.title}
        </h1>
        {course.description && (
          <p className="mt-2 max-w-2xl text-black/60">{course.description}</p>
        )}
      </div>

      {lessons.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-black/15 bg-black/[0.02] px-6 py-16 text-center text-black/60">
          Esse curso ainda não tem aulas publicadas. Volte em breve 💚
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
