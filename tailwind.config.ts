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
        // Identidade Nouê (extraída do tema real da loja)
        verde: {
          DEFAULT: "#00A341", // cor-âncora: CTA, preços, ofertas
          dark: "#008A37", // hover
          light: "#E0F4E8", // fundo de sucesso/destaque suave
        },
        tinta: "#1A1A1A", // títulos / texto principal (quase-preto)
        ambar: "#FFB74A", // estrelas / avaliação (uso pontual)
        erro: "#F83A3A",
      },
      fontFamily: {
        sans: ["Satoshi", "ui-sans-serif", "system-ui", "sans-serif"],
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
