import Link from "next/link";
import type { CSSProperties } from "react";
import { accentVars, etapeAccent, type Etape } from "@/lib/trip";

const VIBE_LABEL: Record<Etape["vibes"][number], string> = {
  natur: "Natur",
  skov: "Skov",
  strand: "Strand",
  by: "By",
  kultur: "Kultur",
  eventyr: "Eventyr",
};

const TRANSPORT_LABEL: Record<Etape["intern"], string> = {
  camper: "Camper",
  tog: "Tog",
  bil: "Bil",
  mix: "Mix",
};

export function CountryCard({ etape, index }: { etape: Etape; index: number }) {
  const periode =
    etape.startMaaned === etape.slutMaaned
      ? etape.startMaaned
      : `${etape.startMaaned} – ${etape.slutMaaned}`;

  const accent = accentVars(etapeAccent(etape.slug)) as CSSProperties;
  const titleId = `etape-${etape.slug}-title`;

  return (
    <Link
      href={`/lande/${etape.slug}`}
      aria-labelledby={titleId}
      style={accent}
      className="group flex flex-col gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-colors hover:border-[var(--accent)] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span aria-hidden className="text-3xl leading-none sm:text-4xl">
            {etape.flag}
          </span>
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]">
              Etape {String(index + 1).padStart(2, "0")}
            </p>
            <h3
              id={titleId}
              className="display text-xl leading-tight text-[var(--color-foreground)] sm:text-2xl"
            >
              {etape.navn}
            </h3>
          </div>
        </div>
        <span
          className="shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold"
          style={{
            backgroundColor: "var(--accent-soft)",
            borderColor: "color-mix(in oklab, var(--accent) 25%, transparent)",
            color: "var(--accent)",
          }}
        >
          {etape.uger} uger
        </span>
      </div>

      <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
        {etape.blurb}
      </p>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <div>
          <dt className="text-[var(--color-muted-foreground)] opacity-70">Periode</dt>
          <dd className="font-mono font-medium text-[var(--color-foreground)]">
            {periode}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--color-muted-foreground)] opacity-70">Internt</dt>
          <dd className="font-medium text-[var(--color-foreground)]">
            {TRANSPORT_LABEL[etape.intern]}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-1.5">
        {etape.vibes.map((v) => (
          <span
            key={v}
            className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
            style={{
              backgroundColor: "var(--accent-soft)",
              borderColor: "color-mix(in oklab, var(--accent) 25%, transparent)",
              color: "var(--accent)",
            }}
          >
            {VIBE_LABEL[v]}
          </span>
        ))}
      </div>
    </Link>
  );
}
