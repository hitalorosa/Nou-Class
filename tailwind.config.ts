import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identidade Nouê Estrelas.
        // Os nomes são o PAPEL da cor, não a cor em si — foi trocar o verde
        // por rosa uma vez pra ficar claro que "verde-dark" envelhece mal.
        ancora: {
          DEFAULT: "#C21B6D", // botão principal, links, progresso, rótulo do hero
          dark: "#8E1049", // hover e texto da âncora sobre fundo claro
          light: "#FDEAF1", // aula atual, sucesso, fundo das telas de acesso
          line: "#F6C9DB", // borda de etiqueta sobre âncora-clara
        },
        rosa: "#FE64A3", // Beijo de Rosa: marca e áreas grandes, nunca texto pequeno
        roxo: "#643A71", // etiqueta Admin, botão Painel, capa sem imagem, conclusão
        tinta: "#1A1A1A", // títulos e corpo
        grafite: "#5C4F55", // cinza de apoio — 7,3:1 sobre branco
        fantasma: "#8C8189", // placeholder de campo
        traco: "#B5A8AF", // círculo tracejado de aula não assistida
        ambar: {
          DEFAULT: "#FFB74A", // aguardando, standby, pendência
          bg: "#FFF3E0",
          ink: "#7A4E00",
        },
        erro: "#C4271C",
        blush: "#FDF4F7", // fundo das telas de dentro (substitui o branco)
        painel: "#F7F3F5", // fundo do admin
      },
      fontFamily: {
        // Uma família só: a Satoshi da Nouê. Título e corpo se separam pelo
        // PESO (900 e 400), não por famílias diferentes.
        sans: ["var(--fonte)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      keyframes: {
        // Cresce rápido no começo e vai desacelerando, sem nunca chegar a
        // 100%: quem termina a barra é a página carregando de verdade.
        "nav-progress": {
          "0%": { width: "0%" },
          "25%": { width: "45%" },
          "60%": { width: "75%" },
          "100%": { width: "93%" },
        },
      },
      animation: {
        "nav-progress": "nav-progress 6s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
      },
    },
  },
  plugins: [],
};
export default config;
