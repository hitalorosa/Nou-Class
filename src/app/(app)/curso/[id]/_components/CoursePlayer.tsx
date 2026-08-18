"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { setWatched } from "@/app/actions/progress";
import { ProgressSummary } from "@/components/Progress";
import { cn } from "@/components/ui";

export function CoursePlayer({
  lessons,
  initialWatched,
}: {
  lessons: Lesson[];
  initialWatched: string[];
}) {
  const [selectedId, setSelectedId] = useState(lessons[0]?.id);
  const [watched, setWatchedState] = useState<Set<string>>(
    new Set(initialWatched),
  );
  const [, startTransition] = useTransition();

  const selected = lessons.find((l) => l.id === selectedId) ?? lessons[0];
  const isWatched = watched.has(selected.id);

  function toggleWatched() {
    const next = new Set(watched);
    const willWatch = !next.has(selected.id);
    if (willWatch) next.add(selected.id);
    else next.delete(selected.id);
    setWatchedState(next); // otimista
    startTransition(() => {
      setWatched(selected.id, willWatch);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Player */}
      <div className="lg:col-span-2">
        <div className="aspect-video w-full overflow-hidden rounded-xl2 bg-[#0F0F0F]">
          {selected.youtube_id ? (
            <iframe
              key={selected.id}
              src={youtubeEmbedUrl(selected.youtube_id)}
              title={selected.title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/70">
              Vídeo indisponível
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="font-display text-[21px] font-bold text-tinta">
              {selected.title}
            </h2>
            {selected.description && (
              <p className="mt-1.5 max-w-xl whitespace-pre-line text-[17px] leading-relaxed text-grafite">
                {selected.description}
              </p>
            )}
          </div>
          <button
            onClick={toggleWatched}
            className={cn(
              "inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-[13px] border-2 px-5 font-display text-[17px] font-bold transition-colors",
              isWatched
                ? "border-ancora bg-ancora text-white hover:border-ancora-dark hover:bg-ancora-dark"
                : "border-ancora bg-white text-ancora hover:bg-ancora hover:text-white",
            )}
          >
            {isWatched ? (
              <>
                <Check size={18} /> Aula assistida
              </>
            ) : (
              "Marcar como assistida"
            )}
          </button>
        </div>
      </div>

      {/* Lista de aulas */}
      <div className="lg:col-span-1">
        {/* Vive aqui, e não no server component, pra acompanhar o clique em
            "Marcar como assistida" na hora — sem esperar recarregar a página. */}
        <ProgressSummary done={watched.size} total={lessons.length} />

        <h2 className="mb-3 font-display text-[21px] font-bold text-tinta">
          Aulas
        </h2>
        <ol className="flex flex-col gap-2.5">
          {lessons.map((lesson, i) => {
            const active = lesson.id === selected.id;
            const done = watched.has(lesson.id);
            return (
              <li key={lesson.id}>
                <button
                  onClick={() => setSelectedId(lesson.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-[13px] px-4 py-3 text-left transition-colors",
                    active
                      ? "border-2 border-ancora bg-ancora-light"
                      : "border border-tinta/5 bg-white hover:border-tinta/15",
                  )}
                >
                  <span className="shrink-0">
                    {active ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ancora text-[11px] text-white">
                        ▶
                      </span>
                    ) : done ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ancora text-[13px] font-bold text-white">
                        ✓
                      </span>
                    ) : (
                      <span className="block h-6 w-6 rounded-full border-2 border-dashed border-traco" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-[15px]",
                        active
                          ? "font-semibold text-ancora-dark"
                          : "text-grafite",
                      )}
                    >
                      Aula {i + 1}
                      {active && " · tocando agora"}
                    </span>
                    <span
                      className={cn(
                        "block text-[17px]",
                        active
                          ? "font-bold text-tinta"
                          : done
                            ? "text-grafite"
                            : "text-tinta",
                      )}
                    >
                      {lesson.title}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
