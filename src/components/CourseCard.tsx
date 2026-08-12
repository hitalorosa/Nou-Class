import Link from "next/link";
import { PlayCircle, CheckCircle2 } from "lucide-react";
import { ProgressBar, percentual } from "@/components/Progress";

export type CourseCardData = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  lessonCount: number;
  watchedCount: number;
};

export function CourseCard({ course }: { course: CourseCardData }) {
  const concluido =
    course.lessonCount > 0 && course.watchedCount >= course.lessonCount;

  return (
    <Link
      href={`/curso/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl2 border border-black/10 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-verde-light">
        {course.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.cover_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-verde to-verde-dark">
            <span className="px-4 text-center text-xl font-extrabold text-white/90">
              {course.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold text-tinta">{course.title}</h3>
        {course.description && (
          <p className="mt-1.5 line-clamp-2 text-sm text-black/60">
            {course.description}
          </p>
        )}
        <div className="mt-auto pt-4">
          {course.lessonCount === 0 ? (
            <span className="text-sm font-semibold text-black/40">
              Aulas em breve
            </span>
          ) : (
            <>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-verde">
                  {concluido ? (
                    <>
                      <CheckCircle2 size={16} /> Concluído
                    </>
                  ) : (
                    <>
                      <PlayCircle size={16} />
                      {course.watchedCount} de {course.lessonCount}{" "}
                      {course.lessonCount === 1 ? "aula" : "aulas"}
                    </>
                  )}
                </span>
                <span className="text-xs font-bold text-black/40">
                  {percentual(course.watchedCount, course.lessonCount)}%
                </span>
              </div>
              <ProgressBar
                done={course.watchedCount}
                total={course.lessonCount}
              />
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
