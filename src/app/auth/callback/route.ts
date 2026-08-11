import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Recebe o `code` do OAuth (Google) e do fluxo de recuperação de senha,
 * troca por uma sessão (PKCE) e redireciona. Sem isso, nem Google nem reset
 * de senha completam.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?erro=auth`);
}
