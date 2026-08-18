"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { Check } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { setWatched } from "@/app/actions/progress";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { ProgressSummary } from "@/components/Progress";
import { cn } from "@/components/ui";

// A IFrame Player API do YouTube injeta este objeto global.
declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, opts: unknown) => unknown;
      PlayerState: { ENDED: number };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

/**
 * Carrega o script da IFrame API uma vez. Resolve `true` quando window.YT
 * existe, ou `false` se não veio em ~6s — aí o player cai no iframe simples,
 * sem o auto-marcar, mas o vídeo ainda toca.
 */
function carregarYouTubeApi(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve(true);
    if (!document.getElementById("yt-iframe-api")) {
      const tag = document.createElement("script");
      tag.id = "yt-iframe-api";
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }
    let tentativas = 0;
    const t = setInterval(() => {
      if (window.YT?.Player) {
        clearInterval(t);
        resolve(true);
      } else if (++tentativas > 60) {
        clearInterval(t);
        resolve(false);
      }
    }, 100);
  });
}

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

  // Espelho do estado para o callback do player não ler um `watched` velho.
  const watchedRef = useRef(watched);
  watchedRef.current = watched;

  function marcar(lessonId: string, assistir: boolean) {
    setWatchedState((prev) => {
      const next = new Set(prev);
      if (assistir) next.add(lessonId);
      else next.delete(lessonId);
      return next;
    });
    startTransition(() => {
      setWatched(lessonId, assistir);
    });
  }

  function toggleWatched() {
    marcar(selected.id, !watched.has(selected.id));
  }

  // Monta o player via IFrame API e marca a aula ao terminar o vídeo — sem a
  // aluna precisar clicar. Recria a cada troca de aula.
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = selected?.youtube_id;
    if (!id || !containerRef.current) return;

    let player: { destroy?: () => void } | null = null;
    let cancelado = false;

    carregarYouTubeApi().then((ok) => {
      if (cancelado || !containerRef.current) return;
      if (!ok || !window.YT) {
        // Fallback: iframe simples. O vídeo toca, mas sem o auto-marcar.
        const iframe = document.createElement("iframe");
        iframe.src = youtubeEmbedUrl(id);
        iframe.className = "h-full w-full";
        iframe.allow =
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
        iframe.allowFullscreen = true;
        containerRef.current.replaceChildren(iframe);
        return;
      }
      player = new window.YT.Player(containerRef.current, {
        host: "https://www.youtube-nocookie.com",
        videoId: id,
        width: "100%",
        height: "100%",
        playerVars: { rel: 0, modestbranding: 1, playsinline: 1 },
        events: {
          onStateChange: (e: { data: number }) => {
            // ENDED === 0. Marca só se ainda não estava assistida.
            if (
              e.data === window.YT?.PlayerState.ENDED &&
              !watchedRef.current.has(selected.id)
            ) {
              marcar(selected.id, true);
            }
          },
        },
      }) as { destroy?: () => void };
    });

    return () => {
      cancelado = true;
      player?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected?.id, selected?.youtube_id]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* Player */}
      <div className="lg:col-span-2">
        <div className="aspect-video w-full overflow-hidden rounded-xl2 bg-[#0F0F0F]">
          {selected.youtube_id ? (
            // A IFrame API substitui este div por um iframe de 100%×100%.
            <div key={selected.id} ref={containerRef} className="h-full w-full" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-white/70">
              Vídeo indisponível
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-[21px] font-bold text-tinta">{selected.title}</h2>
            {selected.description && (
              <p className="mt-1.5 max-w-xl whitespace-pre-line text-[17px] leading-relaxed text-grafite">
                {selected.description}
              </p>
            )}
          </div>
          <button
            onClick={toggleWatched}
            className={cn(
              "inline-flex min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-[13px] border-2 px-5 text-[17px] font-bold transition-colors",
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
        {!isWatched && (
          <p className="mt-2 text-[15px] text-grafite">
            A aula é marcada sozinha quando o vídeo termina.
          </p>
        )}
      </div>

      {/* Lista de aulas */}
      <div className="lg:col-span-1">
        {/* Vive aqui, e não no server component, pra acompanhar o clique em
            "Marcar como assistida" na hora — sem esperar recarregar a página. */}
        <ProgressSummary done={watched.size} total={lessons.length} />

        <h2 className="mb-3 text-[21px] font-bold text-tinta">Aulas</h2>
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
                        active ? "font-semibold text-ancora-dark" : "text-grafite",
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
