import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";

/**
 * Gate do app: só entra quem está logado E liberado (ou admin).
 * Uma única query de profile decide o estado de acesso.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  if (!profile.access_granted && profile.role !== "admin") {
    redirect("/aguardando");
  }

  return (
    <div className="min-h-screen bg-blush">
      <AppHeader profile={profile} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
