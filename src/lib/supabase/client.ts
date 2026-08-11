import { createBrowserClient } from "@supabase/ssr";
import { required } from "@/lib/env";

/**
 * Client do Supabase para Client Components (roda no browser).
 * Usa a anon key — a segurança real vem das políticas RLS no banco.
 */
export function createClient() {
  return createBrowserClient(
    required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    required(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
  );
}
