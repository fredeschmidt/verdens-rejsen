"use client";

import { Fragment } from "react";
import type { InternTransport } from "@/lib/trip";
import { slugify } from "@/lib/text";

export type Selection = { kind: "lead" } | { kind: "stop"; index: number };

const TRANSPORT_EMOJI: Record<InternTransport, string> = {
  camper: "🚐",
  tog: "🚆",
  bil: "🚗",
  mix: "✈️",
};

const SELECTED_OUTLINE =
  "outline outline-2 outline-offset-[3px] outline-[var(--accent)]";

export function RuteCirkler({
  stops,
  transport,
  lead,
  selection,
  onSelect,
}: {
  stops: string[];
  transport: InternTransport;
  lead?: { name: string; slug: string; flag?: string };
  selection: Selection;
  onSelect: (s: Selection) => void;
}) {
  if (stops.length === 0) return null;
  const transportEmoji = TRANSPORT_EMOJI[transport];

  return (
    <ol
      aria-label="Rute"
      className="-mx-6 mt-7 flex flex-nowrap items-start gap-0 overflow-x-auto px-6 pt-2 pb-3 [scrollbar-width:none] sm:-mx-10 sm:px-10 [&::-webkit-scrollbar]:hidden"
    >
      {lead ? (
        <>
          <li className="shrink-0">
            <button
              type="button"
              onClick={() => onSelect({ kind: "lead" })}
              aria-pressed={selection.kind === "lead"}
              className="group flex flex-col items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
            >
              <div
                className={`relative h-28 w-28 overflow-hidden rounded-full bg-white ring-2 ring-[var(--color-card)] transition sm:h-32 sm:w-32 ${
                  selection.kind === "lead" ? SELECTED_OUTLINE : "opacity-90 group-hover:opacity-100"
                }`}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center text-[4.5rem] leading-none sm:text-[5.25rem]"
                >
                  {lead.flag}
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(/img/lande/${lead.slug}.svg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />
              </div>
              <span className="mt-2.5 max-w-[8rem] text-center text-base font-bold leading-tight tracking-tight text-[var(--color-foreground)] sm:text-lg">
                {lead.name}
              </span>
            </button>
          </li>
          <li
            aria-hidden
            className="flex h-28 w-6 shrink-0 items-center justify-center sm:h-32 sm:w-8"
          >
            <span className="block h-12 w-px bg-[var(--color-border)] sm:h-14" />
          </li>
        </>
      ) : null}

      {stops.map((stop, i) => {
        const slug = slugify(stop);
        const isSelected =
          selection.kind === "stop" && selection.index === i;
        return (
          <Fragment key={`${slug}-${i}`}>
            {i > 0 ? (
              // pt-4 = (lead h-28 − stop h-20) / 2; centrerer stops mod lead-cirklen
              <li
                aria-hidden
                className="flex h-20 shrink-0 items-center gap-1 pt-4 sm:h-24"
              >
                <span
                  className="block h-px w-3 border-t-2 border-dashed"
                  style={{ borderColor: "var(--accent)" }}
                />
                <span className="text-sm leading-none">{transportEmoji}</span>
                <span
                  className="block h-px w-3 border-t-2 border-dashed"
                  style={{ borderColor: "var(--accent)" }}
                />
              </li>
            ) : null}

            <li className="shrink-0 pt-4">
              <button
                type="button"
                onClick={() => onSelect({ kind: "stop", index: i })}
                aria-pressed={isSelected}
                className="group flex flex-col items-center rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2"
              >
                <div className="relative">
                  <div
                    className={`h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--color-card)] transition sm:h-24 sm:w-24 ${
                      isSelected
                        ? SELECTED_OUTLINE
                        : "opacity-80 group-hover:opacity-100"
                    }`}
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      backgroundImage: `url(/img/byer/${slug}.jpg), linear-gradient(135deg, var(--accent-soft) 0%, var(--accent) 100%)`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full font-mono text-[0.7rem] font-bold text-white ring-2 ring-[var(--color-card)]"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {i + 1}
                  </span>
                </div>
                <span
                  className={`mt-2 max-w-[6.5rem] text-center text-[0.85rem] leading-tight tracking-tight transition ${
                    isSelected
                      ? "font-semibold text-[var(--color-foreground)]"
                      : "font-normal text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]"
                  }`}
                >
                  {stop}
                </span>
              </button>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
