import Link from "next/link";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Field, Input, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { AutoResetForm } from "@/components/AutoResetForm";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import {
  createCourseAction,
  deleteCourseAction,
  toggleCoursePublishedAction,
  moveCourseAction,
} from "@/app/actions/admin";

export default async function AdminCursosPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from("courses")
    .select("id, title, is_published, position, lessons(count)")
    .order("position", { ascending: true });

  const courses = (data ?? []) as Array<{
    id: string;
    title: string;
    is_published: boolean;
    position: number;
    lessons: { count: number }[];
  }>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold text-tinta">Cursos</h1>
        <p className="text-black/60">
          Crie cursos e organize as aulas. Só cursos publicados aparecem para as
          alunas.
        </p>
      </div>

      {/* Criar curso */}
      <AutoResetForm
        action={createCourseAction}
        className="space-y-4 rounded-xl2 border border-black/10 bg-white p-6"
      >
        <h2 className="flex items-center gap-2 text-lg font-bold text-tinta">
          <Plus size={18} className="text-verde" /> Novo curso
        </h2>
        <Field label="Título do curso">
          <Input name="title" required placeholder="Ex: Como se posicionar no Instagram" />
        </Field>
        <Field label="Descrição" hint="Aparece no card e no topo do curso.">
          <Textarea name="description" rows={2} placeholder="Resumo curto do que a aluna vai aprender." />
        </Field>
        <Field label="URL da imagem de capa" hint="Opcional. Cole o link de uma imagem (16:9 fica melhor).">
          <Input name="cover_url" placeholder="https://…" />
        </Field>
        <SubmitButton pendingLabel="Criando…" block={false}>
          Criar curso
        </SubmitButton>
      </AutoResetForm>

      {/* Lista */}
      <div className="overflow-hidden rounded-xl2 border border-black/10 bg-white">
        <ul className="divide-y divide-black/5">
          {courses.map((c, i) => (
            <li key={c.id} className="flex items-center gap-3 px-4 py-3">
              <div className="flex flex-col">
                <MoveButton id={c.id} dir="up" disabled={i === 0}>
                  <ChevronUp size={16} />
                </MoveButton>
                <MoveButton
                  id={c.id}
                  dir="down"
                  disabled={i === courses.length - 1}
                >
                  <ChevronDown size={16} />
                </MoveButton>
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-semibold text-tinta">{c.title}</div>
                <div className="text-sm text-black/50">
                  {c.lessons?.[0]?.count ?? 0} aula(s)
                </div>
              </div>

              {c.is_published ? (
                <span className="rounded-full bg-verde-light px-2.5 py-1 text-xs font-bold text-verde-dark">
                  Publicado
                </span>
              ) : (
                <span className="rounded-full bg-black/10 px-2.5 py-1 text-xs font-bold text-black/50">
                  Rascunho
                </span>
              )}

              <form action={toggleCoursePublishedAction}>
                <input type="hidden" name="id" value={c.id} />
                <input
                  type="hidden"
                  name="publish"
                  value={c.is_published ? "0" : "1"}
                />
                <button
                  type="submit"
                  className="rounded-lg border-2 border-black/15 px-3 py-1.5 text-sm font-bold text-tinta hover:border-verde hover:text-verde"
                >
                  {c.is_published ? "Despublicar" : "Publicar"}
                </button>
              </form>

              <Link
                href={`/admin/cursos/${c.id}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-tinta px-3 py-1.5 text-sm font-bold text-white hover:bg-black"
              >
                <Pencil size={14} /> Editar
              </Link>

              <form action={deleteCourseAction}>
                <input type="hidden" name="id" value={c.id} />
                <ConfirmSubmit
                  message={`Excluir o curso "${c.title}" e todas as aulas dele?`}
                >
                  <Trash2 size={16} />
                </ConfirmSubmit>
              </form>
            </li>
          ))}
        </ul>
        {courses.length === 0 && (
          <p className="px-4 py-10 text-center text-black/50">
            Nenhum curso ainda. Crie o primeiro acima 👆
          </p>
        )}
      </div>
    </div>
  );
}

function MoveButton({
  id,
  dir,
  disabled,
  children,
}: {
  id: string;
  dir: "up" | "down";
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={moveCourseAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="dir" value={dir} />
      <button
        type="submit"
        disabled={disabled}
        className="text-black/40 hover:text-verde disabled:opacity-20"
      >
        {children}
      </button>
    </form>
  );
}
