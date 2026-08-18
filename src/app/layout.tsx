import type { Metadata } from "next";
import localFont from "next/font/local";
import { NavProgress } from "@/components/NavProgress";
import "./globals.css";

/**
 * Satoshi — a fonte da Nouê. Variável, um arquivo só de 42 KB cobrindo os
 * pesos 300 a 900, servida pelo nosso próprio domínio via next/font.
 *
 * O CDN da Fontshare ficava fora, e é no primeiro carregamento que a conexão
 * da aluna é pior: uma ida a outro servidor antes de a página desenhar o texto.
 */
const satoshi = localFont({
  src: "./fonts/Satoshi-Variable.woff2",
  variable: "--fonte",
  display: "swap",
  weight: "300 900",
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
    <html lang="pt-BR" className={satoshi.variable}>
      <body className="min-h-screen bg-white font-sans text-tinta antialiased">
        <NavProgress />
        {children}
      </body>
    </html>
  );
}
