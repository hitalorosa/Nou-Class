"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { mensagemDeErro } from "@/lib/auth-errors";
import { Button, Field, Input, Alert, Spinner } from "@/components/ui";
import { GoogleButton } from "@/components/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    });
    if (error) {
      setErro(mensagemDeErro(error));
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold text-tinta">Bem-vinda de volta 💚</h1>
        <p className="text-black/60">Entre para continuar seus cursos.</p>
      </div>

      <GoogleButton />

      <div className="flex items-center gap-3 text-sm text-black/40">
        <span className="h-px flex-1 bg-black/10" /> ou <span className="h-px flex-1 bg-black/10" />
      </div>

      <form onSubmit={entrar} className="space-y-4">
        {erro && <Alert kind="error">{erro}</Alert>}
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
        <Field label="Senha" htmlFor="senha">
          <Input
            id="senha"
            type="password"
            autoComplete="current-password"
            required
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <div className="text-right">
          <Link
            href="/esqueci-senha"
            className="text-sm font-semibold text-verde hover:underline"
          >
            Esqueci minha senha
          </Link>
        </div>
        <Button type="submit" block disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Entrando…
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      <p className="text-center text-sm text-black/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-verde hover:underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
