import type { Metadata } from "next";
import { Archivo, Source_Sans_3 } from "next/font/google";
import { NavProgress } from "@/components/NavProgress";
import "./globals.css";

// Auto-hospedadas pelo Next: sem ida a CDN externo no primeiro carregamento,
// que é justamente onde a conexão da aluna é pior. Ambas variáveis e OFL.
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--fonte-titulo",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--fonte-corpo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nouê Estrelas",
  description: "A plataforma das creators Nouê.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${sourceSans.variable}`}>
      <body className="min-h-screen bg-blush font-sans text-tinta antialiased">
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
