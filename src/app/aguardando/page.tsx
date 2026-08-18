import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { AppHeader } from "@/components/AppHeader";

/**
 * Tela mostrada a quem se cadastrou mas ainda não foi liberado pelo admin.
 * Fica FORA do grupo (app) pra não entrar em loop de redirect com o gate.
 */
export default async function AguardandoPage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/login");
  // Já liberado? Vai direto pros cursos.
  if (profile.access_granted || profile.role === "admin") redirect("/");

  const primeiroNome = profile.full_name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-blush">
      <AppHeader profile={profile} />
      <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <div className="text-6xl">✦</div>
        <h1 className="mt-6 font-display text-[30px] font-extrabold leading-tight text-tinta sm:text-[41px]">
          {primeiroNome ? `${primeiroNome}, seu` : "Seu"} cadastro está em análise
        </h1>
        <p className="mt-4 text-[19px] leading-relaxed text-grafite">
          Deu tudo certo com sua conta! Agora é só aguardar a liberação do seu
          acesso. Assim que liberarmos, os cursos aparecem aqui automaticamente.
        </p>
        <p className="mt-7 rounded-xl2 border border-ancora-line bg-ancora-light px-5 py-4 text-[17px] text-ancora-dark">
          Você pode fechar essa página e voltar depois. É só entrar de novo com
          seu email e senha.
        </p>
      </main>
    </div>
  );
}
