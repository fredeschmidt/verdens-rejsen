/**
 * Tekst-hjælpere uden server-deps. Sikre at importere fra både
 * server- og client-components (modsat `lib/content.ts` der drager
 * fs/path/marked med sig).
 */

/**
 * Slugify dansk + accentueret tekst til id'er og fil-paths.
 * å/æ/ø → a/ae/o, øvrige diakritiske tegn fjernes via NFD-normalize
 * (så "San Sebastián" → "san-sebastian" og virker som filnavn).
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/å/g, "a")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, "");
}
