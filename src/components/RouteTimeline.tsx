import Link from "next/link";
import type { CSSProperties } from "react";
import {
  ACCENT_HEX,
  ETAPER,
  FASER,
  TRIP_META,
  accentVars,
  daysUntilDeparture,
  etapeAccent,
  type Etape,
  type Fase,
  type InternTransport,
} from "@/lib/trip";

const TRANSPORT_ICON: Record<InternTransport, string> = {
  camper: "🚐",
  tog: "🚆",
  bil: "🚗",
  mix: "✈️",
};

export function RouteTimeline() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
      {FASER.map((fase) => {
        const items = fase.etaper
          .map((slug) => ETAPER.find((e) => e.slug === slug))
          .filter((e): e is Etape => Boolean(e));
        return <FaseWidget key={fase.id} fase={fase} items={items} />;
      })}
      <SamletWidget />
    </div>
  );
}

function FaseWidget({ fase, items }: { fase: Fase; items: Etape[] }) {
  const totalUger = items.reduce((s, e) => s + e.uger, 0);
  const accent = accentVars(fase.accent) as CSSProperties;
  const andelPct = (totalUger / TRIP_META.totalUger) * 100;

  return (
    <article
      style={accent}
      className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-[0_20px_40px_-20px_rgba(20,20,20,0.35)]"
    >
      <div className="p-4 sm:p-5">
        <header>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3
                className="display text-lg leading-tight sm:text-xl"
                style={{ color: "var(--accent)" }}
              >
                {fase.navn}
              </h3>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
                {fase.periode}
              </p>
            </div>
            <span
              className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "var(--accent-soft)",
                borderColor:
                  "color-mix(in oklab, var(--accent) 25%, transparent)",
                color: "var(--accent)",
              }}
            >
              {totalUger} uger
            </span>
          </div>
        </header>

        <div
          className="relative my-3 h-1 overflow-hidden rounded-full bg-[var(--color-muted)]"
          aria-label={`${totalUger} af ${TRIP_META.totalUger} uger`}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ width: `${andelPct}%`, background: "var(--accent)" }}
          />
        </div>

        <ol>
          {items.map((etape) => (
            <CountryRow key={etape.slug} etape={etape} />
          ))}
        </ol>
      </div>
    </article>
  );
}

function SamletWidget() {
  const dage = daysUntilDeparture();
  return (
    <article className="overflow-hidden rounded-3xl border border-[var(--color-foreground)]/15 bg-[var(--color-card)] shadow-[0_28px_56px_-24px_rgba(20,20,20,0.4)]">
      <div className="p-4 sm:p-5">
        <header>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="display text-lg leading-tight text-[var(--color-foreground)] sm:text-xl">
                Samlet
              </h3>
              <p className="mt-0.5 text-[11px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
                aug 2030 – okt 2031
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-[var(--color-foreground)] px-2.5 py-1 text-xs font-semibold text-[var(--color-background)]">
              {TRIP_META.totalUger} uger
            </span>
          </div>
        </header>

        <div className="mt-4">
          <p className="display text-4xl tabular-nums leading-none text-[var(--color-foreground)] sm:text-5xl">
            {dage.toLocaleString("da-DK")}
          </p>
          <p className="mt-1 text-[11px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
            dage til afrejse
          </p>
        </div>

        <div className="mt-4">
          <RouteBar />
          <p className="mt-2 text-[11px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {TRIP_META.antalLande} lande · {TRIP_META.varighed}
          </p>
        </div>
      </div>
    </article>
  );
}

function RouteBar() {
  return (
    <div className="flex h-2 overflow-hidden rounded-full">
      {ETAPER.map((etape) => (
        <div
          key={etape.slug}
          title={`${etape.navn} · ${etape.uger} uger`}
          style={{
            width: `${(etape.uger / TRIP_META.totalUger) * 100}%`,
            backgroundColor: ACCENT_HEX[etapeAccent(etape.slug)],
          }}
        />
      ))}
    </div>
  );
}

function CountryRow({ etape }: { etape: Etape }) {
  const periode =
    etape.startMaaned === etape.slutMaaned
      ? etape.startMaaned
      : `${etape.startMaaned} – ${etape.slutMaaned}`;

  return (
    <li>
      <Link
        href={`/lande/${etape.slug}`}
        className="group flex items-center gap-3 rounded-2xl px-2 py-2 transition-colors hover:bg-[var(--accent-soft)]"
      >
        <span aria-hidden className="text-base leading-none">
          {etape.flag}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-[var(--color-foreground)]">
            {etape.navn}
          </span>
          <span className="block text-[10px] text-[var(--color-muted-foreground)]">
            {periode} · <span aria-hidden>{TRANSPORT_ICON[etape.intern]}</span>{" "}
            <span className="sr-only">{etape.intern}</span>
          </span>
        </span>
        <span
          className="shrink-0 text-xs font-semibold tabular-nums"
          style={{ color: "var(--accent)" }}
        >
          {etape.uger}u
        </span>
      </Link>
    </li>
  );
}
