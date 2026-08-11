import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-verde-light/40 px-4 py-10">
      <Link href="/" className="mb-6">
        <Logo className="scale-125" />
      </Link>
      <div className="w-full max-w-md rounded-xl2 border border-black/5 bg-white p-8 shadow-sm">
        {children}
      </div>
      <p className="mt-6 max-w-md text-center text-sm text-black/50">
        A escola da Nouê para cabeleireiras. Aprenda a se posicionar, criar
        conteúdo e crescer.
      </p>
    </div>
  );
}
