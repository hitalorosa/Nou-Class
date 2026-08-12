"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { mensagemDeErro } from "@/lib/auth-errors";
import { Button, Field, Input, Alert, Spinner } from "@/components/ui";
import { GoogleButton } from "@/components/GoogleButton";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmarEmail, setConfirmarEmail] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha,
      options: {
        data: { full_name: nome.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErro(mensagemDeErro(error));
      setLoading(false);
      return;
    }
    // Com "Confirm email" LIGADO no Supabase o signUp não devolve sessão: a
    // pessoa só entra depois de clicar no link do email. Empurrar pra "/" nesse
    // caso faria o middleware jogar ela de volta no login, sem explicação
    // nenhuma. Então o fluxo se adapta ao que o Supabase respondeu.
    if (!data.session) {
      setConfirmarEmail(true);
      setLoading(false);
      return;
    }

    // Sem confirmação → já entra logada e cai na tela de "aguardando liberação".
    router.push("/");
    router.refresh();
  }

  if (confirmarEmail) {
    return (
      <div className="space-y-5 text-center">
        <div className="text-5xl">📩</div>
        <h1 className="text-2xl font-bold text-tinta">Confirme seu email</h1>
        <Alert kind="success">
          Enviamos um link para <strong>{email.trim()}</strong>. Abra o email e
          clique no link para ativar sua conta.
        </Alert>
        <p className="text-sm text-black/60">
          Não chegou? Espere um minutinho e olhe na caixa de <strong>spam</strong> ou
          lixo eletrônico — é onde costuma cair.
        </p>
        <Link
          href="/login"
          className="inline-block font-semibold text-verde hover:underline"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-tinta">Criar minha conta</h1>
        <p className="text-black/60">É rapidinho. Leva menos de 1 minuto.</p>
      </div>

      <GoogleButton label="Cadastrar com o Google" />

      <div className="flex items-center gap-3 text-sm text-black/40">
        <span className="h-px flex-1 bg-black/10" /> ou <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={cadastrar} className="space-y-4">
        {erro && <Alert kind="error">{erro}</Alert>}
        <Field label="Seu nome" htmlFor="nome">
          <Input
            id="nome"
            type="text"
            autoComplete="name"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Como você quer ser chamada"
          />
        </Field>
        <Field label="Email" htmlFor="email">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />
        </Field>
        <Field label="Crie uma senha" htmlFor="senha" hint="Pelo menos 6 caracteres.">
          <Input
            id="senha"
            type="password"
            autoComplete="new-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" block disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Criando…
            </>
          ) : (
            "Criar conta"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-black/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-verde hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
