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
    },
  },
  plugins: [],
};
export default config;
