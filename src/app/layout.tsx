import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nouê Class",
  description: "A escola da Nouê para cabeleireiras.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        {/* Satoshi é a fonte oficial da Nouê (Fontshare) */}
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-white font-sans text-tinta antialiased">
        {children}
      </body>
    </html>
  );
}
