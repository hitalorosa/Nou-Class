"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Barra fina no topo da tela enquanto a próxima página carrega.
 *
 * O App Router do Next 14 não expõe eventos de navegação, então a barra
 * acende no clique do link e apaga quando o pathname muda de verdade.
 *
 * Usa só `usePathname` de propósito: `useSearchParams` exigiria um Suspense
 * aqui no layout raiz e tiraria login e cadastro da geração estática.
 */
export function NavProgress() {
  const pathname = usePathname();
  const [carregando, setCarregando] = useState(false);

  // Chegou na página nova → apaga.
  useEffect(() => {
    setCarregando(false);
  }, [pathname]);

  useEffect(() => {
    function aoClicar(evento: MouseEvent) {
      // Deixa passar o que não é navegação normal: botão do meio, clique com
      // Ctrl/Cmd (abre em outra aba), download, link já cancelado.
      if (evento.defaultPrevented || evento.button !== 0) return;
      if (evento.metaKey || evento.ctrlKey || evento.shiftKey || evento.altKey)
        return;

      const link = (evento.target as HTMLElement | null)?.closest?.("a");
      if (!(link instanceof HTMLAnchorElement)) return;
      if (link.hasAttribute("download")) return;
      if (link.target && link.target !== "_self") return;

      const destino = new URL(link.href, window.location.href);
      if (destino.origin !== window.location.origin) return;
      // Mesma página ou âncora "#": não há o que carregar.
      if (destino.pathname === window.location.pathname) return;

      setCarregando(true);
    }

    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);

  // Rede ruim ou navegação abandonada: a barra não pode ficar acesa pra sempre.
  useEffect(() => {
    if (!carregando) return;
    const limite = setTimeout(() => setCarregando(false), 15000);
    return () => clearTimeout(limite);
  }, [carregando]);

  if (!carregando) return null;

  return (
    <div
      role="status"
      aria-label="Carregando página"
      className="fixed inset-x-0 top-0 z-50 h-1 bg-ancora/15"
    >
      <div className="h-full animate-nav-progress bg-ancora" />
    </div>
  );
}
