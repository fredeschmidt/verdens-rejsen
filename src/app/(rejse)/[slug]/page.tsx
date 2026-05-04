import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ETAPER, accentVars, etapeAccent, findEtape } from "@/lib/trip";
import { getCountryContent, type ContentSection } from "@/lib/content";
import { CountryBriefTabs, type BriefTab } from "@/components/CountryBriefTabs";

const VIBE_LABEL: Record<string, { label: string; emoji: string }> = {
  natur: { label: "Natur", emoji: "🌲" },
  skov: { label: "Skov", emoji: "🌳" },
  strand: { label: "Strand", emoji: "🏖️" },
  by: { label: "By", emoji: "🏙️" },
  kultur: { label: "Kultur", emoji: "🎭" },
  eventyr: { label: "Eventyr", emoji: "🧗" },
};

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

export default async function RejseLandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const etape = findEtape(slug);
  if (!etape) notFound();

  const content = await getCountryContent(slug);
  const accent = accentVars(etapeAccent(etape.slug)) as CSSProperties;
  const periode =
    etape.startMaaned === etape.slutMaaned
      ? etape.startMaaned
      : `${etape.startMaaned} – ${etape.slutMaaned}`;

  const sections: ContentSection[] = content?.sections ?? [];
  const beforeSection = sections.find((s) => /før/i.test(s.label));
  const onSiteSection = sections.find((s) =>
    /på stedet|under|undervejs/i.test(s.label),
  );

  const tabs: BriefTab[] = [];
  if (beforeSection) {
    tabs.push({
      id: beforeSection.id,
      label: "Før",
      heading: beforeSection.label,
      html: decorateHeadingsWithEmoji(beforeSection.html),
      variant: "before",
    });
  }
  if (onSiteSection) {
    tabs.push({
      id: onSiteSection.id,
      label: "Under",
      heading: onSiteSection.label,
      html: decorateHeadingsWithEmoji(onSiteSection.html),
      variant: "onsite",
    });
  }

  return (
    <article
      style={accent}
      className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_28px_56px_-24px_rgba(20,20,20,0.4)]"
    >
      <header
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, var(--accent-soft) 0%, transparent 100%)",
        }}
      >
        <div className="px-6 pt-9 pb-7 sm:px-10 sm:pt-12 sm:pb-9">
          <p
            className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "var(--accent)" }}
          >
            {periode} · {etape.uger} uger
          </p>

          <div className="mt-5 flex items-baseline gap-4 sm:gap-5">
            <span aria-hidden className="text-5xl leading-none sm:text-6xl">
              {etape.flag}
            </span>
            <h1 className="display text-balance text-4xl leading-[1.02] sm:text-6xl">
              {etape.navn}
            </h1>
          </div>

          {etape.rute.length > 0 ? (
            <ol
              aria-label="Rute"
              className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.95rem] font-medium leading-snug text-[var(--color-foreground)] sm:text-base"
            >
              {etape.rute.map((stop, i) => (
                <li key={i} className="inline-flex items-center gap-x-3">
                  {i > 0 && (
                    <span
                      aria-hidden
                      className="font-mono text-sm"
                      style={{ color: "var(--accent)" }}
                    >
                      →
                    </span>
                  )}
                  <span>{stop}</span>
                </li>
              ))}
            </ol>
          ) : null}

          <ul className="mt-6 flex flex-wrap items-center gap-2 text-xl">
            {etape.vibes.map((v) => {
              const vibe = VIBE_LABEL[v];
              return (
                <li
                  key={v}
                  aria-label={vibe.label}
                  title={vibe.label}
                  className="leading-none"
                >
                  <span aria-hidden>{vibe.emoji}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      {tabs.length > 0 ? <CountryBriefTabs tabs={tabs} /> : null}
    </article>
  );
}
