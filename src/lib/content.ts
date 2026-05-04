import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";
import { slugify, stripTags } from "./text";

export { slugify, stripTags };

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
  /** Indhold uden h2-overskrift (intro før første h2). Sjældent brugt. */
  intro: string;
  headings: Heading2[];
  frontmatter: Record<string, unknown>;
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
 * Returnerer `intro` for evt. indhold før første h2, og `sections` for
 * resten. H2-tagget fjernes fra section.html — page-template rendrer
 * sit eget label.
 */
function splitByH2(
  html: string,
  headings: Heading2[],
): { intro: string; sections: ContentSection[] } {
  const h2Regex = /<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/g;
  const matches: { id: string; start: number; end: number; tagEnd: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = h2Regex.exec(html)) !== null) {
    matches.push({
      id: m[1],
      start: m.index,
      end: m.index + m[0].length,
      tagEnd: m.index + m[0].length,
    });
  }

  if (matches.length === 0) {
    return { intro: html, sections: [] };
  }

  const intro = html.slice(0, matches[0].start);
  const sections: ContentSection[] = matches.map((mm, i) => {
    const next = matches[i + 1];
    // Skip h2-tagget selv (vi rendrer label separat) — start fra tagEnd
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

  return { intro, sections };
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
  const { intro, sections } = splitByH2(wrapped, headings);
  return { sections, intro, headings, frontmatter: parsed.data };
}
