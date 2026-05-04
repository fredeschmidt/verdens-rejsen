"use client";

import { useState } from "react";
import { RuteCirkler, type Selection } from "./RuteCirkler";
import type { InternTransport } from "@/lib/trip";
import type { ContentCard } from "@/lib/content";

export function RuteNavigation({
  lead,
  stops,
  transport,
  countrySections,
  fase,
  periode,
  weeks,
}: {
  lead: { name: string; slug: string; flag?: string };
  stops: string[];
  transport: InternTransport;
  countrySections: ContentCard[];
  fase: string | null;
  periode: string;
  weeks: number;
}) {
  const [selection, setSelection] = useState<Selection>({ kind: "lead" });
  const selectedStop =
    selection.kind === "stop" ? stops[selection.index] : null;

  return (
    <>
      <header
        className="relative"
        style={{
          background:
            "linear-gradient(180deg, var(--accent-soft) 0%, transparent 100%)",
        }}
      >
        <div className="px-6 pt-9 pb-7 sm:px-10 sm:pt-12 sm:pb-9">
          <div
            className="flex items-baseline justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.22em]"
            style={{ color: "var(--accent)" }}
          >
            <span>
              {fase ? <span className="font-bold">{fase}</span> : null}
              {fase ? <span className="font-semibold"> · </span> : null}
              <span className="font-semibold">{periode}</span>
            </span>
            <span className="font-semibold">{weeks} uger</span>
          </div>

          <h2 className="sr-only">{lead.name}</h2>

          <RuteCirkler
            stops={stops}
            transport={transport}
            lead={lead}
            selection={selection}
            onSelect={setSelection}
          />
        </div>
      </header>

      <section className="px-6 pt-5 pb-6 sm:px-10 sm:pt-6 sm:pb-8">
        {selection.kind === "lead" ? (
          <div className="space-y-3">
            {countrySections.map((s, i) => (
              <details
                key={i}
                className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] open:bg-[var(--color-card)]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[1.05rem] font-bold leading-snug text-[var(--color-foreground)] [&::-webkit-details-marker]:hidden">
                  <span
                    className="flex-1"
                    dangerouslySetInnerHTML={{ __html: s.headingHtml }}
                  />
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180"
                    style={{ color: "var(--accent)" }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div
                  className="prose-rejse px-5 pb-5"
                  dangerouslySetInnerHTML={{ __html: s.bodyHtml }}
                />
              </details>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-card)]">
            <div className="py-10 text-center">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--accent)]">
                Stop {selection.index + 1}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-[var(--color-foreground)] sm:text-3xl">
                {selectedStop}
              </h3>
              <p className="mt-3 text-[0.95rem] text-[var(--color-muted-foreground)]">
                Indhold om {selectedStop} kommer senere.
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
