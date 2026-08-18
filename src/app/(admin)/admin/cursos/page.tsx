import Link from "next/link";
import { ChevronUp, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Field, Input, Textarea } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { AutoResetForm } from "@/components/AutoResetForm";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PendingButton } from "@/components/PendingButton";
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
        <h1 className="mb-1 font-display text-[30px] font-extrabold text-tinta">Cursos</h1>
        <p className="text-[17px] text-grafite">
          Crie cursos e organize as aulas. Só cursos publicados aparecem para as
          alunas.
        </p>
      </div>

      {/* Criar curso */}
      <AutoResetForm
        action={createCourseAction}
        className="space-y-4 rounded-xl2 border border-tinta/10 bg-white p-6"
      >
        <h2 className="flex items-center gap-2 font-display text-[19px] font-bold text-tinta">
          <Plus size={18} className="text-ancora" /> Novo curso
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
      <div className="overflow-hidden rounded-xl2 border border-tinta/10 bg-white">
        <ul className="divide-y divide-tinta/5">
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
                <div className="truncate font-display font-bold text-tinta">{c.title}</div>
                <div className="text-[15px] text-grafite">
                  {c.lessons?.[0]?.count ?? 0} aula(s)
                </div>
              </div>

              {c.is_published ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ancora-line bg-ancora-light px-3 py-1.5 font-display text-[15px] font-bold text-ancora-dark">
                  ✓ Publicado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-tinta/10 bg-painel px-3 py-1.5 font-display text-[15px] font-bold text-grafite">
                  ○ Rascunho
                </span>
              )}

              <form action={toggleCoursePublishedAction}>
                <input type="hidden" name="id" value={c.id} />
                <input
                  type="hidden"
                  name="publish"
                  value={c.is_published ? "0" : "1"}
                />
                <PendingButton className="min-h-[44px] rounded-[13px] border-2 border-tinta/[0.12] px-4 font-display text-[16px] font-bold text-tinta hover:border-ancora hover:text-ancora disabled:opacity-60">
                  {c.is_published ? "Despublicar" : "Publicar"}
                </PendingButton>
              </form>

              <Link
                href={`/admin/cursos/${c.id}`}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-[13px] bg-roxo px-4 font-display text-[16px] font-bold text-white transition-opacity hover:opacity-90"
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
          <p className="px-4 py-10 text-center text-grafite">
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
      <PendingButton
        disabled={disabled}
        title={dir === "up" ? "Subir" : "Descer"}
        className="p-1 text-traco hover:text-ancora disabled:opacity-20"
      >
        {children}
      </PendingButton>
    </form>
  );
}
