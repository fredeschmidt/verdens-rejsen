import type { CSSProperties } from "react";
import { FASER, accentVars, etapeAccent, type Etape } from "@/lib/trip";
import { stripTags, type CountryContent, type ContentCard } from "@/lib/content";
import { RuteNavigation } from "@/components/RuteNavigation";

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

function decorateHeading(headingInnerHtml: string): string {
  const text = stripTags(headingInnerHtml).trim();
  const emoji = emojiForHeading(text);
  return `${headingInnerHtml} <span class="prose-h3-emoji" aria-hidden="true">${emoji}</span>`;
}

export function CountrySection({
  etape,
  content,
}: {
  etape: Etape;
  content: CountryContent | null;
}) {
  const accent = accentVars(etapeAccent(etape.slug)) as CSSProperties;
  const periode =
    etape.startMaaned === etape.slutMaaned
      ? etape.startMaaned
      : `${etape.startMaaned} – ${etape.slutMaaned}`;
  const fase = FASER.find((f) => f.etaper.includes(etape.slug));

  const sections = content?.sections ?? [];
  const beforeSection = sections.find((s) => /før/i.test(s.label));
  const onSiteSection = sections.find((s) =>
    /på stedet|under|undervejs/i.test(s.label),
  );

  const countrySections: ContentCard[] = [
    ...(beforeSection?.cards ?? []),
    ...(onSiteSection?.cards ?? []),
  ].map((card) => ({
    headingHtml: decorateHeading(card.headingHtml),
    bodyHtml: card.bodyHtml,
  }));

  return (
    <article
      id={etape.slug}
      style={{ ...accent, scrollMarginTop: "5rem" }}
      className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_28px_56px_-24px_rgba(20,20,20,0.4)]"
    >
      <RuteNavigation
        lead={{ name: etape.navn, slug: etape.slug, flag: etape.flag }}
        stops={etape.rute}
        transport={etape.intern}
        countrySections={countrySections}
        fase={fase?.navn ?? null}
        periode={periode}
        weeks={etape.uger}
      />
    </article>
  );
}
