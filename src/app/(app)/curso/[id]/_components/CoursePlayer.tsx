"use client";

import { useState, useTransition } from "react";
import { Check, Circle, PlayCircle } from "lucide-react";
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
        <div className="aspect-video w-full overflow-hidden rounded-xl2 bg-black">
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

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-tinta">{selected.title}</h2>
            {selected.description && (
              <p className="mt-1 max-w-xl whitespace-pre-line text-black/60">
                {selected.description}
              </p>
            )}
          </div>
          <button
            onClick={toggleWatched}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors",
              isWatched
                ? "bg-verde text-white hover:bg-verde-dark"
                : "border-2 border-black/15 text-tinta hover:border-verde hover:text-verde",
            )}
          >
            {isWatched ? (
              <>
                <Check size={16} /> Aula assistida
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

        <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-black/40">
          Aulas do curso
        </h3>
        <ol className="space-y-1">
          {lessons.map((lesson, i) => {
            const active = lesson.id === selected.id;
            const done = watched.has(lesson.id);
            return (
              <li key={lesson.id}>
                <button
                  onClick={() => setSelectedId(lesson.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
                    active ? "bg-verde-light" : "hover:bg-black/5",
                  )}
                >
                  <span className="shrink-0">
                    {done ? (
                      <Check size={18} className="text-verde" />
                    ) : active ? (
                      <PlayCircle size={18} className="text-verde" />
                    ) : (
                      <Circle size={18} className="text-black/25" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="block text-xs font-semibold text-black/40">
                      Aula {i + 1}
                    </span>
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        active ? "text-verde-dark" : "text-tinta",
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
