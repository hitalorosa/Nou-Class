"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Input, Alert, Spinner } from "@/components/ui";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    // Não revela se o email existe ou não (segurança). Sempre mostra sucesso.
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/nova-senha`,
    });
    setEnviado(true);
    setLoading(false);
  }

  if (enviado) {
    return (
      <div className="space-y-5 text-center">
        <div className="text-5xl">📬</div>
        <h1 className="font-display text-[30px] font-extrabold leading-tight text-tinta sm:text-[34px]">Confira seu email</h1>
        <p className="text-grafite">
          Se existir uma conta com <strong>{email}</strong>, enviamos um link
          para você criar uma senha nova. Pode demorar alguns minutinhos.
        </p>
        <Alert kind="info">
          Não achou? Olhe na caixa de <strong>spam</strong> ou lixo eletrônico.
        </Alert>
        <Link
          href="/login"
          className="inline-block font-semibold text-ancora underline underline-offset-2 hover:text-ancora-dark"
        >
          Voltar para o login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="font-display text-[30px] font-extrabold leading-tight text-tinta sm:text-[34px]">Esqueceu a senha?</h1>
        <p className="text-grafite">
          Sem problema. Digite seu email que a gente te manda um link.
        </p>
      </div>

      <form onSubmit={enviar} className="space-y-4">
        <Field label="Seu email" htmlFor="email">
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
        <Button type="submit" block disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Enviando…
            </>
          ) : (
            "Enviar link"
          )}
        </Button>
      </form>

      <p className="text-center text-[17px] text-grafite">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-semibold text-ancora underline underline-offset-2 hover:text-ancora-dark">
          Entrar
        </Link>
      </p>
    </div>
  );
}
