-- ============================================================================
-- Nouê Estrelas — schema do banco (Postgres / Supabase)
-- Rode este arquivo INTEIRO no Supabase → SQL Editor (uma vez).
-- Ele é idempotente o suficiente pra rodar de novo em dev sem quebrar.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABELAS
-- ---------------------------------------------------------------------------

-- profiles: estende auth.users 1:1
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text,
  full_name      text,
  role           text not null default 'user' check (role in ('user','admin')),
  access_granted boolean not null default false,
  created_at     timestamptz not null default now()
);

create table if not exists public.courses (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  description  text,
  cover_url    text,
  is_published boolean not null default false,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.lessons (
  id           uuid primary key default gen_random_uuid(),
  course_id    uuid not null references public.courses(id) on delete cascade,
  title        text not null,
  description  text,
  youtube_id   text,
  is_published boolean not null default false,
  position     int not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  -- Regra "standby": não dá pra publicar aula sem vídeo.
  constraint lesson_needs_video_to_publish
    check (is_published = false or youtube_id is not null)
);
create index if not exists lessons_course_position_idx
  on public.lessons (course_id, position);

-- Progresso mínimo: a existência da linha = aula assistida.
create table if not exists public.lesson_progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  lesson_id  uuid not null references public.lessons(id) on delete cascade,
  watched_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ---------------------------------------------------------------------------
-- 2. TRIGGER: cria profile automaticamente no signup
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'   -- Google manda 'name'
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. FUNÇÕES AUXILIARES (SECURITY DEFINER — evitam recursão de RLS)
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.has_access()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and (access_granted = true or role = 'admin')
  );
$$;

-- ---------------------------------------------------------------------------
-- 4. RLS — o gate de acesso vive no BANCO, não só na UI
-- ---------------------------------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.courses         enable row level security;
alter table public.lessons         enable row level security;
alter table public.lesson_progress enable row level security;

-- PROFILES ------------------------------------------------------------------
drop policy if exists "profile_select_own"     on public.profiles;
drop policy if exists "profile_select_admin"   on public.profiles;
drop policy if exists "profile_update_admin"   on public.profiles;
drop policy if exists "profile_delete_admin"   on public.profiles;

create policy "profile_select_own" on public.profiles
  for select using (id = auth.uid());
create policy "profile_select_admin" on public.profiles
  for select using (public.is_admin());
create policy "profile_update_admin" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());
create policy "profile_delete_admin" on public.profiles
  for delete using (public.is_admin());
-- INSERT: nenhuma policy — só o trigger (security definer) insere.
-- Usuário comum NÃO altera o próprio role/access_granted.

-- COURSES -------------------------------------------------------------------
drop policy if exists "course_select_approved" on public.courses;
drop policy if exists "course_select_admin"    on public.courses;
drop policy if exists "course_write_admin"     on public.courses;

create policy "course_select_approved" on public.courses
  for select using (is_published and public.has_access());
create policy "course_select_admin" on public.courses
  for select using (public.is_admin());
create policy "course_write_admin" on public.courses
  for all using (public.is_admin()) with check (public.is_admin());

-- LESSONS -------------------------------------------------------------------
drop policy if exists "lesson_select_approved" on public.lessons;
drop policy if exists "lesson_select_admin"    on public.lessons;
drop policy if exists "lesson_write_admin"     on public.lessons;

create policy "lesson_select_approved" on public.lessons
  for select using (
    public.has_access()
    and is_published
    and exists (
      select 1 from public.courses c
      where c.id = course_id and c.is_published
    )
  );
create policy "lesson_select_admin" on public.lessons
  for select using (public.is_admin());
create policy "lesson_write_admin" on public.lessons
  for all using (public.is_admin()) with check (public.is_admin());

-- LESSON_PROGRESS -----------------------------------------------------------
drop policy if exists "progress_select_own" on public.lesson_progress;
drop policy if exists "progress_insert_own" on public.lesson_progress;
drop policy if exists "progress_delete_own" on public.lesson_progress;

create policy "progress_select_own" on public.lesson_progress
  for select using (user_id = auth.uid());
create policy "progress_insert_own" on public.lesson_progress
  for insert with check (user_id = auth.uid() and public.has_access());
create policy "progress_delete_own" on public.lesson_progress
  for delete using (user_id = auth.uid());

-- ============================================================================
-- FIM. Depois de rodar, faça signup com o email do admin e rode:
--
--   update public.profiles
--   set role = 'admin', access_granted = true
--   where email = 'SEU-EMAIL-ADMIN@exemplo.com';
--
-- ============================================================================
