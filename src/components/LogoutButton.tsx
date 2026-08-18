"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/components/ui";

/**
 * Herda a cor do cabeçalho via currentColor: fica branco sobre o header rosa
 * do app e escuro sobre o header claro do admin, sem precisar de duas versões.
 */
export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function sair() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={sair}
      disabled={loading}
      className={cn(
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-[13px] text-[16px] font-bold text-current opacity-90 transition-opacity hover:opacity-100 disabled:opacity-50 sm:border-2 sm:border-current/30 sm:px-4 sm:hover:border-current/70",
        className,
      )}
    >
      <LogOut size={16} /> Sair
    </button>
  );
}
