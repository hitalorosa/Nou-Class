import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Client do Supabase para Server Components, Server Actions e Route Handlers.
 * Lê/escreve a sessão via cookies. No Next 14 `cookies()` é síncrono.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Chamado de dentro de um Server Component (não pode setar cookie).
            // Tudo bem: o middleware é quem renova a sessão a cada request.
          }
        },
      },
    },
  );
}
