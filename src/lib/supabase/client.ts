import { createBrowserClient } from "@supabase/ssr";

/**
 * Client do Supabase para Client Components (roda no browser).
 * Usa a anon key — a segurança real vem das políticas RLS no banco.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
