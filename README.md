# Nouê Class 💚

Plataforma de cursos própria da Nouê, para cabeleireiras. Alternativa sem taxas
às plataformas tipo Hotmart. Vídeos hospedados no YouTube (não listados) e
embedados aqui.

## Como funciona
- Cabeleireira se cadastra (Google ou email/senha).
- Cai numa tela "cadastro em análise". Um **admin libera** o acesso no painel.
- Liberada → vê **todos os cursos publicados** e assiste as aulas.
- Recuperação de senha por email, pensada para o público 40+.
- Painel admin: liberar/revogar/excluir usuárias, criar/publicar/ordenar cursos e aulas.

O bloqueio de acesso é **no banco (RLS)**, não só na tela: quem não foi
liberada não consegue puxar dado de aula nem pela API.

## Stack
Next.js 14 (App Router) · TypeScript · Tailwind · Supabase (Auth + Postgres + RLS) · Vercel.

## Rodar
```bash
npm install
npm run dev
```
Precisa das variáveis de ambiente configuradas — veja **[SETUP.md](SETUP.md)**.

## Estrutura
```
src/
  app/
    (auth)/        login, cadastro, esqueci-senha, nova-senha
    (app)/         catálogo + página do curso com player (gate: liberada)
    (admin)/admin/ painel (gate: admin)
    aguardando/    tela de "cadastro em análise"
    auth/callback/ troca de code por sessão (Google + reset de senha)
    actions/       Server Actions (admin, progresso)
  lib/supabase/    clients: client (browser), server (RSC), admin (service_role), middleware
  components/      UI reutilizável
supabase/schema.sql  tabelas + trigger + RLS (rodar no Supabase)
```

## Setup e deploy
Passo a passo completo em **[SETUP.md](SETUP.md)**.
