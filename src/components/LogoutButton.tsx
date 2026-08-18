"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/components/ui";

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
        // Contornado no desktop, texto puro no celular — no cabeçalho de 64px
        // uma borda a mais compete com o wordmark.
        "inline-flex min-h-[44px] items-center gap-1.5 rounded-[13px] text-[16px] font-bold text-grafite transition-colors hover:text-tinta disabled:opacity-50 sm:border-2 sm:border-tinta/[0.12] sm:px-4 sm:hover:border-tinta",
        className,
      )}
    >
      <LogOut size={16} /> Sair
    </button>
  );
}
