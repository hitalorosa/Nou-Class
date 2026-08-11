/**
 * Extrai o ID (11 chars) de um vídeo do YouTube a partir de vários formatos:
 * - https://www.youtube.com/watch?v=ID
 * - https://youtu.be/ID
 * - https://www.youtube.com/embed/ID
 * - https://www.youtube.com/shorts/ID
 * - https://www.youtube.com/live/ID
 * - ou o próprio ID colado direto
 * Retorna null se não conseguir extrair.
 */
export function extractYouTubeId(input: string | null | undefined): string | null {
  if (!input) return null;
  const s = input.trim();

  // Já é um ID válido
  if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;

  const pattern =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const m = s.match(pattern);
  if (m) return m[1];

  // Fallback: tenta ler o parâmetro ?v=
  try {
    const url = new URL(s);
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
  } catch {
    // não era URL
  }
  return null;
}

/** URL de embed (nocookie por privacidade) pronta pro iframe. */
export function youtubeEmbedUrl(youtubeId: string): string {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1`;
}

/** Thumbnail padrão do vídeo (usada como capa fallback da aula). */
export function youtubeThumb(youtubeId: string): string {
  return `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`;
}
