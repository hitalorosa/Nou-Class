import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth";
import { CourseCard, type CourseCardData } from "@/components/CourseCard";

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

  const profile = await getCurrentProfile();
  const primeiroNome = profile?.full_name?.split(" ")[0];

  if (profile) {
    const [{ data: aulas }, { data: progresso }] = await Promise.all([
      supabase.from("lessons").select("id, course_id").eq("is_published", true),
      supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", profile.id),
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
      <div className="mb-10 overflow-hidden rounded-xl2 border border-tinta/5 bg-white shadow-[0_2px_10px_rgba(26,26,26,.05)]">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="order-2 flex flex-col justify-center gap-4 p-8 md:order-1 md:p-12">
            <p className="text-[13px] font-bold uppercase tracking-[0.14em] text-ancora">
              Seus cursos liberados
            </p>
            <h1 className="text-[34px] font-extrabold leading-[1.05] tracking-tight text-tinta md:text-[51px] md:leading-[1.03]">
              {primeiroNome ? `Oi, ${primeiroNome}.` : "Bem-vinda."}
              <br />
              Continue de onde parou.
            </h1>
            <p className="max-w-[42ch] text-[17px] leading-relaxed text-grafite md:text-[19px]">
              Cada aula fica marcada quando você termina. Dá pra parar no meio de
              uma e voltar depois — a plataforma lembra por você.
            </p>
          </div>
          {/* Quadro na proporção da foto (~1:1), não o contrário. */}
          <div className="relative order-1 aspect-square md:order-2 md:aspect-auto md:min-h-[500px]">
            {HERO_URL ? (
              <Image
                src={HERO_URL}
                alt="Cabeleireira da Nouê aplicando coloração no cabelo de uma cliente"
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-ancora to-roxo" />
            )}
          </div>
        </div>
      </div>

      <h2 className="mb-6 text-[23px] font-bold text-tinta md:text-[30px]">
        Cursos
      </h2>

      {courses.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-tinta/15 bg-white/60 px-6 py-16 text-center">
          <div className="text-5xl">✦</div>
          <p className="mt-4 text-[19px] font-bold text-tinta">
            Os cursos estão chegando!
          </p>
          <p className="mt-1 text-grafite">
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
