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
        "inline-flex items-center gap-1.5 text-sm font-semibold text-black/60 transition-colors hover:text-erro disabled:opacity-50",
        className,
      )}
    >
      <LogOut size={16} /> Sair
    </button>
  );
}
