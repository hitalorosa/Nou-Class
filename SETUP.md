# Nouê Class — Guia de Setup

Passo a passo pra ligar o Supabase, o login com Google e colocar no ar.
Faça na ordem. Leva ~30 min na primeira vez.

---

## 1. Criar o projeto no Supabase

1. Entre em [supabase.com](https://supabase.com) → **New project**.
2. Nome: `noue-class`. Escolha uma senha de banco forte (guarde num gerenciador).
3. Region: **South America (São Paulo)**.
4. Espere o projeto subir (~2 min).

## 2. Criar as tabelas (rodar o schema)

1. No projeto → menu lateral **SQL Editor** → **New query**.
2. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste repositório, copie **tudo** e cole no editor.
3. Clique em **Run**. Deve aparecer "Success".

## 3. Pegar as credenciais → `.env.local`

1. No Supabase → **Project Settings** (engrenagem) → **API**.
2. Copie:
   - **Project URL** → vai em `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → vai em `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (clique pra revelar — é SECRETA) → vai em `SUPABASE_SERVICE_ROLE_KEY`
3. Na raiz do projeto, edite o arquivo **`.env.local`** e troque os placeholders pelos valores reais:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   NEXT_PUBLIC_HERO_IMAGE_URL=
   ```

   > A URL termina em `.supabase.co` e **para por aí**. Não é o endereço que
   > aparece em "Data API" com `/rest/v1/` no fim — o `supabase-js` acrescenta
   > esse pedaço sozinho, e colar ele aqui quebra o site inteiro.

   > ⚠️ Nunca comite a `service_role`. O `.env.local` já é ignorado pelo git.

### 3b. Imagem do hero (opcional)

A home tem um banner com foto. A imagem **não** vem no repositório — ela mora no
Storage do seu Supabase:

1. Supabase → **Storage** → **New bucket** → nome `covers`, marque **Public bucket**.
2. Faça upload da foto (ex: `hero.jpg`).
3. Clique no arquivo → **Copy URL** → cole em `NEXT_PUBLIC_HERO_IMAGE_URL` no `.env.local`.

Sem essa variável o hero mostra um gradiente verde e o site funciona normalmente.
Esse mesmo bucket serve pras capas dos cursos (campo "URL da imagem de capa" no painel).

## 4. Desligar a confirmação de email

Assim as senhoras não precisam clicar em link de confirmação (o gate é a sua liberação no painel).

1. Supabase → **Authentication** → **Sign In / Providers** → **Email**.
2. Desligue **"Confirm email"**. Salve.

## 5. Login com Google (opcional, mas recomendado)

### 5a. Criar as credenciais no Google Cloud
1. [console.cloud.google.com](https://console.cloud.google.com) → crie/selecione um projeto.
2. **APIs & Services → OAuth consent screen** → tipo **External** → preencha nome do app (`Nouê Class`), email de suporte e email do desenvolvedor. Salve.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID**:
   - Application type: **Web application**.
   - **Authorized JavaScript origins:** `http://localhost:3000` (e depois a URL da Vercel).
   - **Authorized redirect URIs:** cole a URL que o Supabase te mostra no próximo passo (formato `https://SEU-PROJETO.supabase.co/auth/v1/callback`).
   - Crie e **copie o Client ID e o Client Secret**.

### 5b. Ligar no Supabase
1. Supabase → **Authentication → Providers → Google** → ative.
2. Cole o **Client ID** e **Client Secret**. Salve.
3. A tela do Google mostra o "redirect URI" que você deve ter colado no passo 5a — se ainda não colou, copie de lá e cole no Google.

## 6. Configurar as URLs de redirecionamento

Supabase → **Authentication → URL Configuration**:
- **Site URL:** `http://localhost:3000` (troque pela URL da Vercel quando publicar).
- **Redirect URLs** (Add URL), adicione todas:
  - `http://localhost:3000/**`
  - `https://SEU-APP.vercel.app/**` (depois do deploy)

## 7. Rodar localmente e virar admin

1. No terminal, na pasta do projeto:
   ```bash
   npm install
   npm run dev
   ```
2. Abra `http://localhost:3000` → **Criar conta** com o email que vai ser o **admin**.
3. Você vai cair na tela "cadastro em análise". Agora vire admin: Supabase → **SQL Editor** → rode (troque o email):
   ```sql
   update public.profiles
   set role = 'admin', access_granted = true
   where email = 'SEU-EMAIL-ADMIN@exemplo.com';
   ```
4. Recarregue a página. Agora você vê o catálogo e o botão **Painel** no topo.

## 8. Usar o painel

- **Painel → Cursos:** crie um curso, adicione aulas (cole o link do YouTube não listado), publique.
- **Painel → Usuárias:** quando uma cabeleireira se cadastrar, ela aparece como "Aguardando". Clique **Liberar** e pronto — ela passa a ver todos os cursos publicados.

> Aula sem link de vídeo fica em **Standby** e não pode ser publicada (é a regra que você pediu pros vídeos "sem nome").

---

## 9. Publicar na Vercel (quando estiver pronto)

Repositório: [`hitalorosa/Nou-Class`](https://github.com/hitalorosa/Nou-Class).

1. Importe o repo em [vercel.com/new](https://vercel.com/new).
2. Em **Environment Variables**, adicione as variáveis do `.env.local` (com a `service_role` como secreta), marcando **Production + Preview + Development**.
3. Deploy. Depois volte no Supabase (passos 5a e 6) e adicione a URL da Vercel nas origins/redirects.
4. (Opcional) Subdomínio `curso.nouecosmeticos.com.br`: na Vercel → Domains, e crie um CNAME no seu DNS apontando pro Vercel.

> **Duas armadilhas que já custaram caro aqui:**
>
> - Variáveis `NEXT_PUBLIC_*` são gravadas dentro do JavaScript **durante o
>   build**. Salvar na Vercel não muda o site no ar — só vale depois de um novo
>   deploy, e com "Use existing Build Cache" **desmarcado**.
> - Pra conferir o que está realmente cadastrado, sem depender da tela:
>   `vercel env ls`. É como se descobriu que o projeto estava sem nenhuma.

---

## Checklist rápido
- [ ] Projeto Supabase criado
- [ ] `schema.sql` rodado
- [ ] `.env.local` preenchido
- [ ] Bucket `covers` criado (público) + hero enviado
- [ ] "Confirm email" desligado
- [ ] Google OAuth ligado (opcional)
- [ ] Site URL + Redirect URLs configurados
- [ ] Admin promovido via SQL
- [ ] Curso de teste criado e publicado
