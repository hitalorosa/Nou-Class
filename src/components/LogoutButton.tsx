"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/components/ui";

/**
 * Botão Sair dos cabeçalhos rosa (app e admin). Branco sólido de contorno,
 * texto branco puro (5,72:1 sobre a âncora — o meio-tom anterior era
 * ilegível), preenche de branco no hover.
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
        "inline-flex min-h-[44px] items-center gap-2 rounded-[13px] text-[16px] font-bold text-white transition-colors hover:text-white/80 disabled:opacity-50 sm:border-2 sm:border-white/70 sm:px-4 sm:hover:border-white sm:hover:bg-white sm:hover:text-ancora-dark",
        className,
      )}
    >
      <LogOut size={18} /> Sair
    </button>
  );
}
