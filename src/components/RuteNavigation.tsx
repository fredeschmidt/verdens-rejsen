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
        <div className="px-6 pt-9 pb-3 sm:px-10 sm:pt-12 sm:pb-4">
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

      <section className="px-6 pt-2 pb-6 sm:px-10 sm:pt-3 sm:pb-8">
        {selection.kind === "lead" ? (
          <div className="tab-acc-list -mx-6 sm:-mx-10">
            {countrySections.map((s, i) => (
              <details key={i} name={`tabs-${lead.slug}`} className="tab-acc">
                <summary className="tab-acc__summary">
                  <span className="tab-acc__num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="tab-acc__title"
                    dangerouslySetInnerHTML={{ __html: s.headingHtml }}
                  />
                  <span aria-hidden className="tab-acc__icon shrink-0" />
                </summary>
                <div
                  className="tab-acc__body prose-rejse"
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
