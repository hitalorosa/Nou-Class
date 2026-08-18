import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Course, Lesson } from "@/lib/types";
import { Field, Input, Textarea, Alert } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import { AutoResetForm } from "@/components/AutoResetForm";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PendingButton } from "@/components/PendingButton";
import {
  updateCourseAction,
  createLessonAction,
  updateLessonAction,
  deleteLessonAction,
  toggleLessonPublishedAction,
  moveLessonAction,
} from "@/app/actions/admin";

export default async function AdminCursoEditPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { erro?: string };
}) {
  const supabase = createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("*")
    .eq("id", params.id)
    .single<Course>();
  if (!course) notFound();

  const { data: lessonsData } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .order("position", { ascending: true });
  const lessons = (lessonsData as Lesson[]) ?? [];

  return (
    <div className="space-y-8">
      <Link
        href="/admin/cursos"
        className="inline-flex min-h-[44px] items-center gap-2 text-[17px] font-bold text-ancora hover:text-ancora-dark"
      >
        <ChevronLeft size={16} /> Voltar aos cursos
      </Link>

      {searchParams.erro === "link" && (
        <Alert kind="error">
          <strong>Não consegui ler esse link do YouTube.</strong> Nada foi
          alterado — a aula continua como estava. Copie o endereço da barra do
          navegador na página do vídeo (formato{" "}
          <code>https://youtu.be/ABC123</code> ou{" "}
          <code>youtube.com/watch?v=ABC123</code>) e cole de novo. Link de
          playlist ou de canal não serve: precisa ser o do vídeo.
        </Alert>
      )}

      {/* Editar dados do curso */}
      <form
        action={updateCourseAction}
        className="space-y-4 rounded-xl2 border border-tinta/10 bg-white p-6"
      >
        <input type="hidden" name="id" value={course.id} />
        <h2 className="text-[19px] font-bold text-tinta">Dados do curso</h2>
        <Field label="Título">
          <Input name="title" required defaultValue={course.title} />
        </Field>
        <Field label="Descrição">
          <Textarea
            name="description"
            rows={2}
            defaultValue={course.description ?? ""}
          />
        </Field>
        <Field label="URL da imagem de capa">
          <Input name="cover_url" defaultValue={course.cover_url ?? ""} placeholder="https://…" />
        </Field>
        <SubmitButton pendingLabel="Salvando…" block={false}>
          Salvar
        </SubmitButton>
      </form>

      {/* Nova aula */}
      <AutoResetForm
        action={createLessonAction}
        className="space-y-4 rounded-xl2 border border-tinta/10 bg-white p-6"
      >
        <input type="hidden" name="courseId" value={course.id} />
        <h2 className="flex items-center gap-2 text-[19px] font-bold text-tinta">
          <Plus size={18} className="text-ancora" /> Nova aula
        </h2>
        <Field label="Título da aula">
          <Input name="title" required placeholder="Ex: Aula 1 — Definindo seu nicho" />
        </Field>
        <Field
          label="Link do vídeo (YouTube)"
          hint="Cole o link do YouTube (não listado). Sem link, a aula fica em standby e não pode ser publicada."
        >
          <Input name="youtubeUrl" placeholder="https://youtu.be/… (opcional agora)" />
        </Field>
        <Field label="Descrição da aula" hint="Opcional. Aparece abaixo do vídeo.">
          <Textarea name="description" rows={2} />
        </Field>
        <SubmitButton pendingLabel="Adicionando…" block={false}>
          Adicionar aula
        </SubmitButton>
      </AutoResetForm>

      {/* Lista de aulas */}
      <div>
        <h2 className="mb-3 text-[21px] font-bold text-tinta">
          Aulas ({lessons.length})
        </h2>
        <div className="overflow-hidden rounded-xl2 border border-tinta/10 bg-white">
          <ul className="divide-y divide-tinta/5">
            {lessons.map((l, i) => (
              <li key={l.id} className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col">
                    <MoveLesson
                      id={l.id}
                      courseId={course.id}
                      dir="up"
                      disabled={i === 0}
                    >
                      <ChevronUp size={16} />
                    </MoveLesson>
                    <MoveLesson
                      id={l.id}
                      courseId={course.id}
                      dir="down"
                      disabled={i === lessons.length - 1}
                    >
                      <ChevronDown size={16} />
                    </MoveLesson>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-tinta">
                      {l.title}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {!l.youtube_id ? (
                        <span className="font-bold text-ambar-ink">
                          ⏸ Standby (sem vídeo)
                        </span>
                      ) : l.is_published ? (
                        <span className="font-bold text-ancora-dark">
                          ● Publicada
                        </span>
                      ) : (
                        <span className="font-bold text-grafite">
                          ○ Rascunho
                        </span>
                      )}
                    </div>
                  </div>

                  {/* publicar / despublicar */}
                  {l.youtube_id && (
                    <form action={toggleLessonPublishedAction}>
                      <input type="hidden" name="id" value={l.id} />
                      <input type="hidden" name="courseId" value={course.id} />
                      <input
                        type="hidden"
                        name="publish"
                        value={l.is_published ? "0" : "1"}
                      />
                      <PendingButton className="min-h-[44px] rounded-[13px] border-2 border-tinta/[0.12] px-4 text-[16px] font-bold text-tinta hover:border-ancora hover:text-ancora disabled:opacity-60">
                        {l.is_published ? "Despublicar" : "Publicar"}
                      </PendingButton>
                    </form>
                  )}

                  <form action={deleteLessonAction}>
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="courseId" value={course.id} />
                    <ConfirmSubmit message={`Excluir a aula "${l.title}"?`}>
                      <Trash2 size={16} />
                    </ConfirmSubmit>
                  </form>
                </div>

                {/* editar aula (expansível) */}
                <details className="mt-2">
                  <summary className="inline-flex min-h-[44px] cursor-pointer select-none items-center text-[16px] font-bold text-ancora hover:text-ancora-dark">
                    Editar aula
                  </summary>
                  <form
                    action={updateLessonAction}
                    className="mt-3 space-y-3 rounded-[13px] bg-painel p-4"
                  >
                    <input type="hidden" name="id" value={l.id} />
                    <input type="hidden" name="courseId" value={course.id} />
                    <Field label="Título">
                      <Input name="title" required defaultValue={l.title} />
                    </Field>
                    <Field
                      label="Link do vídeo (YouTube)"
                      hint="Deixe em branco para voltar ao standby."
                    >
                      {/* Mostra a URL completa, não o ID cru: o campo se chama
                          "Link do vídeo" e voltar com `fae8g3f8w8Y` na tela
                          parece que o link foi truncado ou perdido. */}
                      <Input
                        name="youtubeUrl"
                        defaultValue={
                          l.youtube_id ? `https://youtu.be/${l.youtube_id}` : ""
                        }
                        placeholder="https://youtu.be/…"
                      />
                    </Field>
                    <Field label="Descrição">
                      <Textarea
                        name="description"
                        rows={2}
                        defaultValue={l.description ?? ""}
                      />
                    </Field>
                    <SubmitButton pendingLabel="Salvando…" block={false}>
                      Salvar aula
                    </SubmitButton>
                  </form>
                </details>
              </li>
            ))}
          </ul>
          {lessons.length === 0 && (
            <p className="px-4 py-10 text-center text-grafite">
              Nenhuma aula ainda. Adicione a primeira acima 👆
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MoveLesson({
  id,
  courseId,
  dir,
  disabled,
  children,
}: {
  id: string;
  courseId: string;
  dir: "up" | "down";
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <form action={moveLessonAction}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="courseId" value={courseId} />
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
