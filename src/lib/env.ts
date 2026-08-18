/**
 * Confere que uma variável de ambiente chegou até aqui.
 *
 * Recebe o valor JÁ LIDO de forma literal (`process.env.NEXT_PUBLIC_X`) em vez
 * do nome da variável: o Next.js grava as `NEXT_PUBLIC_*` dentro do bundle
 * durante o build procurando por essa escrita exata, então uma leitura
 * dinâmica (`process.env[nome]`) viria vazia no browser.
 */
export function required(value: string | undefined, name: string): string {
  if (value) return value;

  throw new Error(
    `[Nouê Estrelas] Variável de ambiente ausente: ${name}.\n` +
      `Cadastre em Vercel → Settings → Environment Variables e faça um NOVO DEPLOY. ` +
      `As variáveis NEXT_PUBLIC_* são gravadas durante o build, então só salvar não muda o site no ar.`,
  );
}
