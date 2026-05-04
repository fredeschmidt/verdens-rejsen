import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify, stripTags, CITY_TAB_KEYS, type CityTabKey } from "./text";

export { slugify, stripTags, CITY_TAB_KEYS };
export type { CityTabKey };

const CONTENT_DIR = path.join(process.cwd(), "content");

marked.setOptions({
  gfm: true,
  breaks: false,
});

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    ...sanitizeHtml.defaults.allowedTags,
    "h1",
    "h2",
    "img",
    "figure",
    "figcaption",
  ],
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    "*": ["id"],
    img: ["src", "alt", "title", "width", "height", "loading"],
    a: ["href", "name", "target", "rel", "title"],
  },
  allowedSchemes: ["http", "https", "mailto", "tel"],
};

export type Heading3 = { id: string; text: string };
export type Heading2 = { id: string; text: string; children: Heading3[] };

/**
 * Én h3-blok udtrukket strukturelt fra markdown — bruges af accordion-UI
 * uden at re-parse HTML. headingHtml = inner-HTML af <h3> (uden tagget),
 * bodyHtml = alt indhold mellem h3 og næste h3/h2.
 */
export type ContentCard = { headingHtml: string; bodyHtml: string };

/**
 * En sektion = alt indhold under én h2 ("Før ankomst", "På stedet" osv.).
 * Page-template renderer hver sektion separat med eget visuelt udtryk
 * (accent-fyldt for "før", muted for "under").
 */
export type ContentSection = {
  id: string;
  label: string;
  html: string;
  headings: Heading3[];
  cards: ContentCard[];
};

export type CountryContent = {
  sections: ContentSection[];
};

/**
 * Decode HTML-entities i en kort streng (overskrift-tekst).
 */
function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Tilføj id'er på h2/h3 og udtræk overskrift-hierarki til TOC.
 */
function injectHeadingIds(html: string): { html: string; headings: Heading2[] } {
  const headings: Heading2[] = [];
  const seen = new Map<string, number>();

  const withIds = html.replace(
    /<(h2|h3)[^>]*>([\s\S]*?)<\/\1>/g,
    (_match, tag: string, rawInner: string) => {
      const text = decodeEntities(stripTags(rawInner)).trim();
      const base = slugify(text);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;

      if (tag === "h2") {
        headings.push({ id, text, children: [] });
      } else if (tag === "h3") {
        const last = headings[headings.length - 1];
        if (last) last.children.push({ id, text });
        else headings.push({ id, text, children: [] });
      }

      return `<${tag} id="${id}">${rawInner}</${tag}>`;
    },
  );

  return { html: withIds, headings };
}

/**
 * Indpak hver h3-sektion (h3 + søskende indtil næste h3 eller h2) i et
 * <section class="prose-card">.
 */
function wrapH3Sections(html: string): string {
  const indices: { index: number; isH3: boolean }[] = [];
  const regex = /<(h2|h3)\b[^>]*>/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    indices.push({ index: match.index, isH3: match[1] === "h3" });
  }
  if (indices.length === 0) return html;

  const chunks: { content: string; isH3: boolean }[] = [];
  if (indices[0].index > 0) {
    chunks.push({ content: html.slice(0, indices[0].index), isH3: false });
  }
  for (let i = 0; i < indices.length; i++) {
    const start = indices[i].index;
    const end = i + 1 < indices.length ? indices[i + 1].index : html.length;
    chunks.push({ content: html.slice(start, end), isH3: indices[i].isH3 });
  }

  return chunks
    .map((c) =>
      c.isH3 ? `<section class="prose-card">${c.content}</section>` : c.content,
    )
    .join("");
}

/**
 * Udtrækker hver h3-kort som strukturerede {headingHtml, bodyHtml} par
 * fra HTML der er pakket af `wrapH3Sections`. Coupling: formatet på
 * `<section class="prose-card">` skal matche begge funktioner.
 */
function parseCards(html: string): ContentCard[] {
  if (!html) return [];
  const result: ContentCard[] = [];
  const sectionRegex = /<section class="prose-card">([\s\S]*?)<\/section>/g;
  let m: RegExpExecArray | null;
  while ((m = sectionRegex.exec(html)) !== null) {
    const inner = m[1];
    const h3Match = inner.match(/<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*)/);
    if (h3Match) {
      result.push({
        headingHtml: h3Match[1],
        bodyHtml: h3Match[2].trim(),
      });
    }
  }
  return result;
}

/**
 * Splitter HTML på h2-grænser, så hver h2 + dens flow bliver én sektion.
 * H2-tagget fjernes fra section.html — page-template rendrer sit eget label.
 */
function splitByH2(html: string, headings: Heading2[]): ContentSection[] {
  const h2Regex = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
  const matches: { id: string; start: number; tagEnd: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(html)) !== null) {
    matches.push({
      id: m[1],
      start: m.index,
      tagEnd: m.index + m[0].length,
    });
  }

  return matches.map((mm, i) => {
    const next = matches[i + 1];
    const sectionHtml = html.slice(mm.tagEnd, next ? next.start : html.length);
    const heading = headings.find((h) => h.id === mm.id);
    return {
      id: mm.id,
      label: heading?.text ?? "",
      html: sectionHtml,
      headings: heading?.children ?? [],
      cards: parseCards(sectionHtml),
    };
  });
}

export async function getCountryContent(slug: string): Promise<CountryContent | null> {
  const filePath = path.join(CONTENT_DIR, "countries", `${slug}.md`);
  let file: string;
  try {
    file = await fs.readFile(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
  const parsed = matter(file);
  const rawHtml = marked.parse(parsed.content, { async: false }) as string;
  const sanitized = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
  const { html: withIds, headings } = injectHeadingIds(sanitized);
  const wrapped = wrapH3Sections(withIds);
  const sections = splitByH2(wrapped, headings);
  return { sections };
}

export type CityContent = {
  bySlug: string;
  byNavn: string;
  naetter: string | null;
  budgetDkk: { min: number; maks: number } | null;
  tabs: Partial<Record<CityTabKey, string>>;
};

const TAB_SLUG_TO_KEY: Record<string, CityTabKey> = {
  overnatning: "overnatning",
  oplevelser: "oplevelser",
  spise: "spise",
  billeder: "billeder",
  budget: "budget",
};

export async function getCityContent(
  landSlug: string,
  bySlug: string,
  byNavn: string,
): Promise<CityContent | null> {
  const filePath = path.join(CONTENT_DIR, "byer", landSlug, `${bySlug}.md`);
  let file: string;
  try {
    file = await fs.readFile(filePath, "utf8");
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
  const parsed = matter(file);
  const rawHtml = marked.parse(parsed.content, { async: false }) as string;
  const sanitized = sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
  const { html: withIds, headings } = injectHeadingIds(sanitized);
  const sections = splitByH2(withIds, headings);

  const tabs: Partial<Record<CityTabKey, string>> = {};
  for (const s of sections) {
    const key = TAB_SLUG_TO_KEY[s.id];
    if (key) tabs[key] = s.html.trim();
  }
  const naetterRaw = parsed.data?.naetter;
  const naetter =
    typeof naetterRaw === "number"
      ? String(naetterRaw)
      : typeof naetterRaw === "string" && naetterRaw.trim() !== ""
        ? naetterRaw.trim()
        : null;
  const budgetRaw = parsed.data?.budget;
  const budgetDkk =
    budgetRaw &&
    typeof budgetRaw === "object" &&
    typeof budgetRaw.min === "number" &&
    typeof budgetRaw.maks === "number"
      ? { min: budgetRaw.min, maks: budgetRaw.maks }
      : null;
  return { bySlug, byNavn, naetter, budgetDkk, tabs };
}

export async function getCitiesForCountry(
  landSlug: string,
  byer: { slug: string; navn: string }[],
): Promise<CityContent[]> {
  const results = await Promise.all(
    byer.map((b) => getCityContent(landSlug, b.slug, b.navn)),
  );
  return results.filter((c): c is CityContent => c !== null);
}
