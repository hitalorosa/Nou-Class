import Link from "next/link";
import { ProgressBar, percentual, Estrela } from "@/components/Progress";

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
      className="group flex flex-col overflow-hidden rounded-xl2 border border-tinta/10 bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(26,26,26,.12)]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-ancora-light">
        {course.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.cover_url}
            alt={course.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          // Sem capa: o título vira a capa sobre o gradiente roxo→âncora-escura.
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-roxo to-ancora-dark p-5">
            <span className="text-center text-[23px] font-extrabold leading-tight text-white">
              {course.title}
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-[19px] font-bold leading-tight text-tinta">
          {course.title}
        </h3>
        {course.description && (
          <p className="line-clamp-2 text-[16px] leading-normal text-grafite">
            {course.description}
          </p>
        )}

        <div className="mt-auto pt-1">
          {course.lessonCount === 0 ? (
            <span className="flex items-center gap-2 text-[16px] text-grafite">
              <span className="h-5 w-5 rounded-full border-2 border-dashed border-traco" />
              Aulas em breve
            </span>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between gap-3">
                {concluido ? (
                  <span className="flex items-center gap-2 text-[16px] font-bold text-roxo">
                    <Estrela className="h-5 w-5" /> Concluído
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-[16px] font-bold text-ancora">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ancora text-[9px] text-white">
                      ▶
                    </span>
                    {course.watchedCount} de {course.lessonCount}{" "}
                    {course.lessonCount === 1 ? "aula" : "aulas"}
                  </span>
                )}
                <span className="text-[15px] text-grafite">
                  {percentual(course.watchedCount, course.lessonCount)}%
                </span>
              </div>
              <ProgressBar
                done={course.watchedCount}
                total={course.lessonCount}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
