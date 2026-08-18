import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ancora px-4 py-10">
      <Link href="/" className="mb-7">
        <Logo tamanho="lg" tom="claro" />
      </Link>
      <div className="w-full max-w-md rounded-xl2 border border-tinta/5 bg-white p-7 shadow-[0_2px_10px_rgba(26,26,26,.05)] sm:p-8">
        {children}
      </div>
      <p className="mt-7 max-w-md text-center text-[15px] font-semibold text-white">
        A plataforma das creators Nouê.
      </p>
    </div>
  );
}
