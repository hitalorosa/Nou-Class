"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button, Field, Input, Alert, Spinner } from "@/components/ui";

export default function NovaSenhaPage() {
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    if (senha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    if (senha !== confirma) {
      setErro("As duas senhas não são iguais.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: senha });
    if (error) {
      setErro(
        "O link expirou ou já foi usado. Peça um novo em 'Esqueci minha senha'.",
      );
      setLoading(false);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-[30px] font-extrabold leading-tight text-tinta sm:text-[34px]">Criar senha nova</h1>
        <p className="text-grafite">Digite a nova senha duas vezes.</p>
      </div>

      <form onSubmit={salvar} className="space-y-4">
        {erro && <Alert kind="error">{erro}</Alert>}
        <Field label="Nova senha" htmlFor="senha" hint="Pelo menos 6 caracteres.">
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
        <Field label="Repita a nova senha" htmlFor="confirma">
          <Input
            id="confirma"
            type="password"
            autoComplete="new-password"
            required
            value={confirma}
            onChange={(e) => setConfirma(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" block disabled={loading}>
          {loading ? (
            <>
              <Spinner /> Salvando…
            </>
          ) : (
            "Salvar senha"
          )}
        </Button>
      </form>
    </div>
  );
}
