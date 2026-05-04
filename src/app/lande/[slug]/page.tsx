import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ETAPER, accentVars, etapeAccent, findEtape } from "@/lib/trip";
import { getCountryContent, type ContentSection } from "@/lib/content";
import { SectionNav } from "@/components/SectionNav";

const VIBE_LABEL: Record<string, { label: string; emoji: string }> = {
  natur: { label: "Natur", emoji: "🌲" },
  skov: { label: "Skov", emoji: "🌳" },
  strand: { label: "Strand", emoji: "🏖️" },
  by: { label: "By", emoji: "🏙️" },
  kultur: { label: "Kultur", emoji: "🎭" },
  eventyr: { label: "Eventyr", emoji: "🧗" },
};

const TRANSPORT_LABEL: Record<string, { label: string; emoji: string }> = {
  camper: { label: "Camper", emoji: "🚐" },
  tog: { label: "Tog", emoji: "🚆" },
  bil: { label: "Bil", emoji: "🚗" },
  mix: { label: "Mix", emoji: "🔀" },
};

/**
 * Mapper en h3-overskrift til en passende emoji.
 * Bruger keyword-matching så det virker for alle lande uden at skulle
 * tilføje emojier i markdown'en. Falder tilbage til ✨ hvis intet matcher.
 */
function emojiForHeading(text: string): string {
  const t = text.toLowerCase();
  if (/(pak|tøj|bagage|kuffert)/.test(t)) return "🎒";
  if (/(visum|papir|pas|esta|eta)/.test(t)) return "📄";
  if (/(valuta|penge|pris|budget|kontant)/.test(t)) return "💰";
  if (/(klima|vejr|temperatur|sæson|regn)/.test(t)) return "🌤️";
  if (/(start|hvor|rute)/.test(t)) return "🗺️";
  if (/(top|oplev|attrakt|highlight)/.test(t)) return "⭐";
  if (/(mad|spise|restaur|køkken)/.test(t)) return "🍽️";
  if (/(camper|bobil|køretøj)/.test(t)) return "🚐";
  if (/(børn|fælde|forældre|tip)/.test(t)) return "👶";
  if (/(transport|bus|tog|fly)/.test(t)) return "🚆";
  if (/(sundhed|sygesikring|læge|skadestue)/.test(t)) return "🏥";
  if (/(sprog|kommunikation)/.test(t)) return "💬";
  if (/(bolig|hotel|airbnb|overnat)/.test(t)) return "🏠";
  if (/(strand|surf|hav)/.test(t)) return "🌊";
  if (/(bjerg|fjeld|vandring)/.test(t)) return "⛰️";
  if (/(skov|natur|park)/.test(t)) return "🌲";
  if (/(næste|videre|skridt)/.test(t)) return "➡️";
  return "✨";
}

/**
 * Vælg emoji til selve sektion-h2'en. "Før" = 🎒 (forberedelse),
 * "Under/På stedet" = 🧭 (kompas, on-the-ground).
 */
function emojiForSection(label: string): string {
  const t = label.toLowerCase();
  if (/før/.test(t)) return "🎒";
  if (/på stedet|under|undervejs/.test(t)) return "🧭";
  if (/næste/.test(t)) return "➡️";
  return "📍";
}

/**
 * Korte tab-labels — markdown-h2'erne kan være lange, så vi giver dem
 * et UI-venligt navn til segment-navigationen.
 */
function tabLabel(label: string): string {
  const t = label.toLowerCase();
  if (/før/.test(t)) return "Før";
  if (/på stedet|under/.test(t)) return "Under";
  if (/næste/.test(t)) return "Næste";
  return label;
}

/**
 * Beriger den rå HTML med emoji-prefix på hver h3, så hver kort-titel
 * får sin egen lille indikator. Vi sætter emoji'en før h3-teksten via
 * en simpel regex på den allerede-renderede HTML.
 */
function decorateHeadingsWithEmoji(html: string): string {
  return html.replace(
    /<h3([^>]*)>([\s\S]*?)<\/h3>/g,
    (_full, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      const emoji = emojiForHeading(text);
      return `<h3${attrs}>${inner}<span class="prose-h3-emoji" aria-hidden="true">${emoji}</span></h3>`;
    },
  );
}

export function generateStaticParams() {
  return ETAPER.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const etape = findEtape(slug);
  if (!etape) return {};
  return { title: etape.navn };
}

export default async function LandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const etape = findEtape(slug);
  if (!etape) notFound();

  const index = ETAPER.findIndex((e) => e.slug === slug);
  const prev = index > 0 ? ETAPER[index - 1] : null;
  const next = index < ETAPER.length - 1 ? ETAPER[index + 1] : null;

  const content = await getCountryContent(slug);
  const accent = accentVars(etapeAccent(etape.slug)) as CSSProperties;
  const periode =
    etape.startMaaned === etape.slutMaaned
      ? etape.startMaaned
      : `${etape.startMaaned} – ${etape.slutMaaned}`;

  // Klassificér de to hovedsektioner — "før" og "under". Resten
  // (typisk "næste skridt") rendres uden særlig farve-behandling.
  const sections: ContentSection[] = content?.sections ?? [];
  const beforeSection = sections.find((s) => /før/i.test(s.label));
  const onSiteSection = sections.find((s) => /på stedet|under|undervejs/i.test(s.label));
  const otherSections = sections.filter(
    (s) => s !== beforeSection && s !== onSiteSection,
  );

  const transport = TRANSPORT_LABEL[etape.intern];

  return (
    <div style={accent}>
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto max-w-4xl px-5 py-10 sm:py-14 lg:px-8 lg:py-16">
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--accent)]"
          >
            ← Rejse
          </Link>
          <div className="mt-5 flex items-start gap-4 sm:gap-6">
            <span aria-hidden className="text-5xl sm:text-6xl">
              {etape.flag}
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                Etape {String(index + 1).padStart(2, "0")} · {periode}
              </p>
              <h1 className="display mt-2 text-balance text-4xl leading-[1.05] sm:text-6xl">
                {etape.navn}
              </h1>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-[var(--color-muted-foreground)] sm:text-base">
                {etape.blurb}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HURTIG INFO — emoji-pille-væg i stedet for kold dl-grid */}
      <section className="mx-auto max-w-4xl px-5 py-8 lg:px-8">
        <h2 className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
          Hurtig info
        </h2>
        <ul className="flex flex-wrap gap-1.5">
          <InfoChip emoji="📅" label="Periode" value={periode} />
          <InfoChip emoji="⏳" label="Varighed" value={`${etape.uger} uger`} />
          <InfoChip emoji={transport.emoji} label="Transport" value={transport.label} />
          <InfoChip emoji="📄" label="Visum" value={etape.visumDanske} />
          <InfoChip emoji="🌤️" label="Klima" value={etape.klimaNote} />
          <InfoChip emoji="🎯" label="Fokus" value={etape.hovedfokus} />
          {etape.vibes.map((v) => {
            const vibe = VIBE_LABEL[v];
            return (
              <span
                key={v}
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.78rem] font-medium"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  borderColor: "color-mix(in oklab, var(--accent) 30%, transparent)",
                  color: "var(--accent)",
                }}
              >
                <span aria-hidden>{vibe.emoji}</span>
                {vibe.label}
              </span>
            );
          })}
        </ul>
      </section>

      {/* PRE-ARRIVAL BRIEF — to tydeligt adskilte sektioner */}
      {content && sections.length > 0 ? (
        <>
          <SectionNav
            items={sections.map((s) => ({
              id: s.id,
              label: tabLabel(s.label),
              emoji: emojiForSection(s.label),
            }))}
          />

          {beforeSection ? (
            <SectionBlock
              variant="before"
              section={beforeSection}
              emoji={emojiForSection(beforeSection.label)}
            />
          ) : null}

          {onSiteSection ? (
            <SectionBlock
              variant="onsite"
              section={onSiteSection}
              emoji={emojiForSection(onSiteSection.label)}
            />
          ) : null}

          {otherSections.map((s) => (
            <SectionBlock
              key={s.id}
              variant="onsite"
              section={s}
              emoji={emojiForSection(s.label)}
            />
          ))}
        </>
      ) : (
        <section className="mx-auto max-w-4xl px-5 pb-16 lg:px-8">
          <div className="rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center">
            <p className="display text-2xl">Indhold på vej</p>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Pre-arrival brief og on-the-ground reference til {etape.navn} skrives af rejseguiden — én etape ad gangen.
            </p>
          </div>
        </section>
      )}

      <nav className="mx-auto max-w-4xl border-t border-[var(--color-border)] px-5 py-10 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={`/lande/${prev.slug}`}
              className="group flex flex-col items-start gap-1 text-left"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                ← Forrige etape
              </span>
              <span className="display text-lg text-[var(--color-foreground)] group-hover:text-[var(--accent)]">
                {prev.flag} {prev.navn}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/lande/${next.slug}`}
              className="group flex flex-col items-end gap-1 text-right sm:ml-auto"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
                Næste etape →
              </span>
              <span className="display text-lg text-[var(--color-foreground)] group-hover:text-[var(--accent)]">
                {next.navn} {next.flag}
              </span>
            </Link>
          ) : null}
        </div>
      </nav>
    </div>
  );
}

function InfoChip({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <li className="inline-flex max-w-full items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5">
      <span aria-hidden className="text-base leading-none">
        {emoji}
      </span>
      <span className="flex min-w-0 items-baseline gap-1.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--color-muted-foreground)]">
          {label}
        </span>
        <span className="truncate text-[0.82rem] text-[var(--color-foreground)]">
          {value}
        </span>
      </span>
    </li>
  );
}

/**
 * SectionBlock — én h2-sektion ("Før ankomst" eller "På stedet").
 *
 * `variant="before"` = accent-fyldt panel: accent-soft baggrund,
 *                      accent-border, accent-h3-prik. Føles forberedt,
 *                      pakke-klar.
 * `variant="onsite"` = neutralt jord-tone-panel: muted baggrund,
 *                      diskret accent-streg som indikator. Føles
 *                      on-the-ground, ro.
 */
function SectionBlock({
  variant,
  section,
  emoji,
}: {
  variant: "before" | "onsite";
  section: ContentSection;
  emoji: string;
}) {
  const decorated = decorateHeadingsWithEmoji(section.html);
  const isBefore = variant === "before";

  return (
    <section
      id={section.id}
      className={`mx-auto max-w-4xl px-5 py-6 lg:px-8 prose-section prose-section--${variant}`}
    >
      <div
        className={`rounded-3xl border px-5 py-6 sm:px-8 sm:py-8 ${
          isBefore ? "prose-section__panel--before" : "prose-section__panel--onsite"
        }`}
      >
        <header className="mb-4 flex items-center gap-2 border-b border-[var(--color-border)] pb-3">
          <span aria-hidden className="text-lg leading-none">
            {emoji}
          </span>
          <div className="min-w-0">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
              {isBefore ? "Inden afrejse" : "På stedet"}
            </p>
            <h2 className="display text-xl leading-tight text-[var(--color-foreground)] sm:text-2xl">
              {section.label}
            </h2>
          </div>
        </header>
        <div
          className="prose-rejse"
          dangerouslySetInnerHTML={{ __html: decorated }}
        />
      </div>
    </section>
  );
}
