"use client";

import { useState } from "react";

export type BriefTab = {
  id: string;
  label: string;
  html: string;
  variant: "before" | "onsite";
};

export function CountryBriefTabs({ tabs }: { tabs: BriefTab[] }) {
  const [activeId, setActiveId] = useState<string>(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  if (!active) return null;

  return (
    <section
      className={`px-6 pt-5 pb-6 sm:px-10 sm:pt-6 sm:pb-8 prose-section prose-section--${active.variant}`}
    >
      <div
        className={`overflow-hidden rounded-3xl border prose-section__panel--${active.variant}`}
      >
        <div
          role="tablist"
          aria-label="Pre-arrival brief"
          className="flex flex-wrap gap-1.5 border-b border-[var(--color-border)] px-3 py-2 sm:px-4"
        >
          {tabs.map((t) => {
            const isActive = t.id === active.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => setActiveId(t.id)}
                className={
                  isActive
                    ? "inline-flex min-h-[36px] items-center rounded-full border px-4 py-1.5 text-[0.85rem] font-medium transition-colors"
                    : "inline-flex min-h-[36px] items-center rounded-full border border-transparent px-4 py-1.5 text-[0.85rem] font-medium text-[var(--color-muted-foreground)] transition-colors hover:text-[var(--accent)]"
                }
                style={
                  isActive
                    ? {
                        backgroundColor: "var(--color-card)",
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                      }
                    : undefined
                }
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div
          id={`panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="px-5 py-6 sm:px-7 sm:py-7"
        >
          <div
            className="prose-rejse"
            dangerouslySetInnerHTML={{ __html: active.html }}
          />
        </div>
      </div>
    </section>
  );
}
