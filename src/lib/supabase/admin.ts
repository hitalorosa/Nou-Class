import "server-only";
import { createClient } from "@supabase/supabase-js";
import { required } from "@/lib/env";

/**
 * Client com a SERVICE ROLE — ignora RLS. Use APENAS no servidor, e sempre
 * depois de validar que o chamador é admin (ver src/lib/auth.ts).
 * O `server-only` acima quebra o build se este arquivo vazar pro client.
 */
export function createAdminClient() {
  return createClient(
    required(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    required(
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY",
    ),
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
