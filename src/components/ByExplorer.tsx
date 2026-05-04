"use client";

import { Fragment, useState } from "react";
import type { InternTransport } from "@/lib/trip";
import {
  CITY_TAB_KEYS,
  type CityTabKey,
  type ChecklistData,
} from "@/lib/text";
import type { ContentCard } from "@/lib/content";
import { ChecklistCard } from "@/components/ChecklistCard";

export type CountryCard = ContentCard & {
  checklist?: ChecklistData;
  checklistKey?: string | null;
};

const TRANSPORT_EMOJI: Record<InternTransport, string> = {
  camper: "🚐",
  tog: "🚆",
  bil: "🚗",
  mix: "✈️",
};

const TAB_LABEL: Record<CityTabKey, string> = {
  overnatning: "Overnatning",
  oplevelser: "Oplevelser",
  spise: "Spise",
  billeder: "Billeder",
  budget: "Budget",
};

const TAB_EMOJI: Record<CityTabKey, string> = {
  overnatning: "🏕️",
  oplevelser: "⭐",
  spise: "🍽️",
  billeder: "📷",
  budget: "💰",
};

export type CityWithContent = {
  slug: string;
  navn: string;
  naetter: string | null;
  budgetDkk: { min: number; maks: number } | null;
  tabs: Partial<Record<CityTabKey, string>>;
  billederChecklist?: ChecklistData;
};

function formatBudgetDkk(min: number, maks: number): string {
  const fmt = (n: number) => n.toLocaleString("da-DK");
  return `${fmt(min)} – ${fmt(maks)} kr`;
}

type Selection = { kind: "country" } | { kind: "city"; slug: string };

export function ByExplorer({
  lead,
  cities,
  transport,
  countrySections,
  fase,
  periode,
  weeks,
  budgetDkk,
}: {
  lead: { name: string; slug: string; flag?: string };
  cities: CityWithContent[];
  transport: InternTransport;
  countrySections: CountryCard[];
  fase: string | null;
  periode: string;
  weeks: number;
  budgetDkk?: { min: number; maks: number };
}) {
  const transportEmoji = TRANSPORT_EMOJI[transport];
  const [selection, setSelection] = useState<Selection>({ kind: "country" });

  const isCountrySelected = selection.kind === "country";
  const selectedCity =
    selection.kind === "city"
      ? cities.find((c) => c.slug === selection.slug)
      : null;
  const budgetLabel = budgetDkk
    ? `${Math.round(budgetDkk.min / 1000)}–${Math.round(budgetDkk.maks / 1000)}k kr`
    : null;

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
            <span className="hidden font-bold sm:inline">{fase}</span>
            <div className="flex flex-1 items-baseline justify-between gap-3 font-semibold sm:flex-initial sm:justify-end">
              <span>{periode}</span>
              <span aria-hidden className="hidden opacity-30 sm:inline">·</span>
              <span>{weeks} uger</span>
              {budgetLabel ? (
                <>
                  <span aria-hidden className="hidden opacity-30 sm:inline">·</span>
                  <span>{budgetLabel}</span>
                </>
              ) : null}
            </div>
          </div>

          <h2 className="sr-only">{lead.name}</h2>

          <ol
            aria-label="Rute"
            className="-mx-6 mt-7 flex flex-nowrap items-start gap-0 overflow-x-auto px-6 pt-2 pb-3 [scrollbar-width:none] sm:-mx-10 sm:px-10 [&::-webkit-scrollbar]:hidden"
          >
            <li className="shrink-0 flex flex-col items-center">
              <button
                type="button"
                onClick={() => setSelection({ kind: "country" })}
                aria-pressed={isCountrySelected}
                className="flex flex-col items-center focus:outline-none"
              >
                <div
                  className="relative h-28 w-28 overflow-hidden rounded-full bg-white transition-all duration-200 sm:h-32 sm:w-32"
                  style={{
                    boxShadow: isCountrySelected
                      ? `0 0 0 3px var(--accent), 0 0 0 6px var(--color-card)`
                      : `0 0 0 2px var(--color-card)`,
                    opacity: isCountrySelected ? 1 : 0.85,
                  }}
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
                <span
                  className="mt-2.5 max-w-[8rem] text-center text-base leading-tight tracking-tight transition-colors sm:text-lg"
                  style={{
                    fontWeight: isCountrySelected ? 700 : 600,
                    color: isCountrySelected
                      ? "var(--color-foreground)"
                      : "var(--color-muted-foreground)",
                  }}
                >
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

            {cities.map((city, i) => {
              const isSelected =
                selection.kind === "city" && selection.slug === city.slug;
              return (
                <Fragment key={city.slug}>
                  {i > 0 ? (
                    <li
                      aria-hidden
                      className="flex h-20 shrink-0 items-center gap-1 pt-8 sm:h-24"
                    >
                      <span
                        className="block h-px w-3 border-t-2 border-dashed"
                        style={{ borderColor: "var(--accent)" }}
                      />
                      <span className="text-sm leading-none">
                        {transportEmoji}
                      </span>
                      <span
                        className="block h-px w-3 border-t-2 border-dashed"
                        style={{ borderColor: "var(--accent)" }}
                      />
                    </li>
                  ) : null}

                  <li className="shrink-0 pt-4 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setSelection({ kind: "city", slug: city.slug })
                      }
                      aria-pressed={isSelected}
                      className="flex flex-col items-center focus:outline-none"
                    >
                      <div className="relative">
                        <div
                          className="h-20 w-20 overflow-hidden rounded-full transition-all duration-200 sm:h-24 sm:w-24"
                          style={{
                            backgroundColor: "var(--accent-soft)",
                            backgroundImage: `url(/img/byer/${city.slug}.jpg), linear-gradient(135deg, var(--accent-soft) 0%, var(--accent) 100%)`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            boxShadow: isSelected
                              ? `0 0 0 3px var(--accent), 0 0 0 6px var(--color-card)`
                              : `0 0 0 2px var(--color-card)`,
                            opacity: isSelected ? 1 : 0.78,
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
                        className="mt-2 max-w-[6.5rem] text-center text-[0.85rem] leading-tight tracking-tight transition-colors"
                        style={{
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected
                            ? "var(--color-foreground)"
                            : "var(--color-muted-foreground)",
                        }}
                      >
                        {city.navn}
                      </span>
                    </button>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </div>
      </header>

      <section className="px-6 pt-2 pb-6 sm:px-10 sm:pt-3 sm:pb-8">
        {isCountrySelected ? (
          <div
            key={`country-${lead.slug}`}
            className="by-tab-panel -mx-6 sm:-mx-10"
          >
            <div className="tab-acc-list">
              {countrySections.map((s, i) => {
                if (s.checklist) {
                  const stable = s.checklistKey ?? `${i}`;
                  return (
                    <ChecklistCard
                      key={`${lead.slug}-${stable}`}
                      index={i}
                      detailsName={`tabs-${lead.slug}`}
                      storageKey={`${lead.slug}-${stable}`}
                      headingHtml={s.headingHtml}
                      data={s.checklist}
                    />
                  );
                }
                return (
                  <details
                    key={`${lead.slug}-${i}`}
                    name={`tabs-${lead.slug}`}
                    className="tab-acc"
                  >
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
                );
              })}
            </div>
          </div>
        ) : selectedCity ? (
          <div
            key={selectedCity.slug}
            className="by-tab-panel -mx-6 sm:-mx-10"
          >
            <div className="tab-acc-list">
              {CITY_TAB_KEYS.map((key, i) => {
                const html = selectedCity.tabs[key];
                if (key === "billeder" && selectedCity.billederChecklist) {
                  const heading = `${TAB_LABEL[key]} <span class="prose-h3-emoji" aria-hidden="true">${TAB_EMOJI[key]}</span>`;
                  return (
                    <ChecklistCard
                      key={key}
                      index={i}
                      detailsName={`bytabs-${selectedCity.slug}`}
                      storageKey={`${lead.slug}-${selectedCity.slug}-billeder`}
                      headingHtml={heading}
                      data={selectedCity.billederChecklist}
                    />
                  );
                }
                return (
                  <details
                    key={key}
                    name={`bytabs-${selectedCity.slug}`}
                    className="tab-acc"
                  >
                    <summary className="tab-acc__summary">
                      <span className="tab-acc__num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="tab-acc__title">
                        {TAB_LABEL[key]}{" "}
                        <span aria-hidden className="prose-h3-emoji">
                          {TAB_EMOJI[key]}
                        </span>
                        {key === "overnatning" && selectedCity.naetter ? (
                          <span className="tab-acc__badge">
                            {selectedCity.naetter} nætter
                          </span>
                        ) : null}
                        {key === "budget" && selectedCity.budgetDkk ? (
                          <span className="tab-acc__badge">
                            {formatBudgetDkk(
                              selectedCity.budgetDkk.min,
                              selectedCity.budgetDkk.maks,
                            )}
                          </span>
                        ) : null}
                      </span>
                      <span aria-hidden className="tab-acc__icon shrink-0" />
                    </summary>
                    <div className="tab-acc__body prose-rejse">
                      {html ? (
                        <div dangerouslySetInnerHTML={{ __html: html }} />
                      ) : (
                        <p className="by-tab-empty">
                          Indhold kommer snart for{" "}
                          <strong>{TAB_LABEL[key].toLowerCase()}</strong> i{" "}
                          {selectedCity.navn}.
                        </p>
                      )}
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    </>
  );
}
