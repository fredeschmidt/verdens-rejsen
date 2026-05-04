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
    .replace(/[\u0300-\u036f]/g, "")
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

export const CITY_TAB_KEYS = [
  "overnatning",
  "oplevelser",
  "spise",
  "billeder",
  "budget",
] as const;

export type CityTabKey = (typeof CITY_TAB_KEYS)[number];

export type ChecklistItem = { id: string; html: string };
export type ChecklistData = {
  prefaceHtml: string;
  items: ChecklistItem[];
  afterHtml: string;
};

/**
 * Headings der skal renderes som interaktiv tjekliste i stedet for
 * standard prose-list. Matches på normaliseret heading-tekst.
 */
const CHECKLIST_HEADING_PATTERN =
  /^(tjekliste|visum|valuta|pakkeliste)\b/i;

export function isChecklistHeading(text: string): boolean {
  return CHECKLIST_HEADING_PATTERN.test(text.trim());
}

/**
 * Parser bodyHtml for et h3-kort til checklist-struktur:
 * tekst før <ul>, hvert <li>, og evt. <blockquote> efter.
 * Bruges af ChecklistCard. Returnerer null hvis der ikke er en <ul>.
 */
export function parseChecklistFromHtml(bodyHtml: string): ChecklistData | null {
  const ulMatch = bodyHtml.match(/<ul>([\s\S]*?)<\/ul>/);
  if (!ulMatch || ulMatch.index === undefined) return null;

  const start = ulMatch.index;
  const end = start + ulMatch[0].length;
  const prefaceHtml = bodyHtml.slice(0, start).trim();
  const afterHtml = bodyHtml.slice(end).trim();

  const items: ChecklistItem[] = [];
  const liRegex = /<li>([\s\S]*?)<\/li>/g;
  const seen = new Map<string, number>();
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = liRegex.exec(ulMatch[1])) !== null) {
    const inner = m[1].trim();
    const slug = slugify(stripTags(inner)).slice(0, 60);
    const base = slug || `item-${i}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count + 1}`;
    items.push({ id, html: inner });
    i++;
  }

  if (items.length === 0) return null;
  return { prefaceHtml, items, afterHtml };
}
