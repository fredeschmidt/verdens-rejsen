import { Fragment } from "react";
import type { InternTransport } from "@/lib/trip";
import { slugify } from "@/lib/text";

const TRANSPORT_EMOJI: Record<InternTransport, string> = {
  camper: "🚐",
  tog: "🚆",
  bil: "🚗",
  mix: "✈️",
};

export function RuteCirkler({
  stops,
  transport,
  lead,
}: {
  stops: string[];
  transport: InternTransport;
  lead?: { name: string; slug: string; flag?: string };
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
          <li className="shrink-0 flex flex-col items-center">
            <div className="relative h-28 w-28 overflow-hidden rounded-full bg-white ring-2 ring-[var(--color-card)] sm:h-32 sm:w-32">
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

            <li className="shrink-0 pt-4 flex flex-col items-center">
              <div className="relative">
                <div
                  className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-[var(--color-card)] sm:h-24 sm:w-24"
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
              <span className="mt-2 max-w-[6.5rem] text-center text-[0.85rem] leading-tight tracking-tight font-medium text-[var(--color-muted-foreground)]">
                {stop}
              </span>
            </li>
          </Fragment>
        );
      })}
    </ol>
  );
}
