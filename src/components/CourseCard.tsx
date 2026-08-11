import Link from "next/link";
import { PlayCircle } from "lucide-react";

export type CourseCardData = {
  id: string;
  title: string;
  description: string | null;
  cover_url: string | null;
  lessonCount: number;
};

export function CourseCard({ course }: { course: CourseCardData }) {
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
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-verde">
            <PlayCircle size={16} />
            {course.lessonCount}{" "}
            {course.lessonCount === 1 ? "aula" : "aulas"}
          </span>
        </div>
      </div>
    </Link>
  );
}
