"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Input, Alert, Spinner } from "@/components/ui";
import { GoogleButton } from "@/components/GoogleButton";

export default function CadastroPage() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function cadastrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha,
      options: {
        data: { full_name: nome.trim() },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setErro(
        error.message.includes("already")
          ? "Esse email já tem conta. Tente entrar."
          : "Não consegui criar a conta. Confira os dados e tente de novo.",
      );
      setLoading(false);
      return;
    }
    // Confirmação de email está desligada → já entra logada.
    router.push("/");
    router.refresh();
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
