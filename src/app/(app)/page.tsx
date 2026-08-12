import { createClient } from "@/lib/supabase/server";
import { CourseCard, type CourseCardData } from "@/components/CourseCard";
import Image from "next/image";

// Imagem do hero: sobe pro bucket `covers` do Supabase e cola a URL pública
// em NEXT_PUBLIC_HERO_IMAGE_URL. Sem a variável, o hero cai num gradiente.
const HERO_URL = process.env.NEXT_PUBLIC_HERO_IMAGE_URL;

export default async function CatalogoPage() {
  const supabase = createClient();

  const { data } = await supabase
    .from("courses")
    .select("id, title, description, cover_url, position, lessons(count)")
    .eq("is_published", true)
    .order("position", { ascending: true });

  type Row = {
    id: string;
    title: string;
    description: string | null;
    cover_url: string | null;
    position: number;
    lessons: { count: number }[] | null;
  };

  // Progresso por curso: total de aulas e quantas a aluna já assistiu.
  //
  // Os dois números saem da MESMA lista de aulas de propósito. O
  // `lessons(count)` da query acima não serve como denominador porque a RLS
  // deixa o admin enxergar rascunhos: ele veria "1 de 3" com uma aula que
  // ninguém mais tem como assistir. Contando aqui, numerador e denominador
  // olham sempre o mesmo conjunto e a barra não tem como passar de 100%.
  const totalPorCurso = new Map<string, number>();
  const assistidasPorCurso = new Map<string, number>();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const [{ data: aulas }, { data: progresso }] = await Promise.all([
      supabase.from("lessons").select("id, course_id").eq("is_published", true),
      supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id),
    ]);

    const assistidas = new Set((progresso ?? []).map((p) => p.lesson_id));
    for (const aula of (aulas ?? []) as { id: string; course_id: string }[]) {
      totalPorCurso.set(
        aula.course_id,
        (totalPorCurso.get(aula.course_id) ?? 0) + 1,
      );
      if (assistidas.has(aula.id)) {
        assistidasPorCurso.set(
          aula.course_id,
          (assistidasPorCurso.get(aula.course_id) ?? 0) + 1,
        );
      }
    }
  }

  const courses: CourseCardData[] = ((data ?? []) as Row[]).map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    cover_url: c.cover_url,
    lessonCount: totalPorCurso.get(c.id) ?? c.lessons?.[0]?.count ?? 0,
    watchedCount: assistidasPorCurso.get(c.id) ?? 0,
  }));

  return (
    <div>
      {/* Hero */}
      <div className="relative mb-10 overflow-hidden rounded-xl2 bg-white shadow-sm ring-1 ring-black/5">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative order-2 flex flex-col justify-center p-8 md:order-1 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-verde">
              Nouê Class
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-tinta md:text-5xl">
              A escola da Nouê pra cabeleireira.
            </h1>
            <p className="mt-4 max-w-md text-lg text-black/70">
              Aprenda a se posicionar na internet, criar conteúdo e crescer
              como profissional. Aulas curtas, prática e Nouê do começo ao fim.
            </p>
          </div>
          <div className="relative order-1 aspect-[4/3] md:order-2 md:aspect-auto md:min-h-[380px]">
            {HERO_URL ? (
              <Image
                src={HERO_URL}
                alt="Cabeleireira em salão minimalista"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-verde to-verde-dark" />
            )}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-tinta">Seus cursos</h2>
        <p className="mt-1 text-black/60">
          Escolha um curso para começar a assistir.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-black/15 bg-black/[0.02] px-6 py-16 text-center">
          <div className="text-5xl">📚</div>
          <p className="mt-4 text-lg font-semibold text-tinta">
            Os cursos estão chegando!
          </p>
          <p className="mt-1 text-black/60">
            Ainda não há cursos publicados. Volte em breve.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
