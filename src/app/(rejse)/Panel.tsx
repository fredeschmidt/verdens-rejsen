"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import {
  ETAPER,
  FASER,
  accentVars,
  type Etape,
  type Fase,
} from "@/lib/trip";

export function Panel() {
  const [active, setActive] = useState<string | null>(
    ETAPER[0]?.slug ?? null,
  );

  useEffect(() => {
    const elements = ETAPER.map((e) =>
      document.getElementById(e.slug),
    ).filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const computeActive = () => {
      const ref = window.innerHeight * 0.4;
      let activeSlug: string | null = null;
      let bestTop = -Infinity;
      for (const el of elements) {
        const top = el.getBoundingClientRect().top;
        if (top <= ref && top > bestTop) {
          bestTop = top;
          activeSlug = el.id;
        }
      }
      if (activeSlug) setActive(activeSlug);
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        computeActive();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    computeActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav
      aria-label="Ruten"
      className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[rgba(253,251,238,0.4)] shadow-[0_28px_56px_-24px_rgba(20,20,20,0.4)] backdrop-blur-2xl"
    >
      <ol className="px-3 py-5 sm:px-4 sm:py-6">
        {FASER.map((fase, i) => {
          const items = fase.etaper
            .map((slug) => ETAPER.find((e) => e.slug === slug))
            .filter((e): e is Etape => Boolean(e));
          return (
            <FaseSection
              key={fase.id}
              fase={fase}
              items={items}
              isFirst={i === 0}
              activeSlug={active}
            />
          );
        })}
      </ol>
    </nav>
  );
}

function FaseSection({
  fase,
  items,
  isFirst,
  activeSlug,
}: {
  fase: Fase;
  items: Etape[];
  isFirst: boolean;
  activeSlug: string | null;
}) {
  const accent = accentVars(fase.accent) as CSSProperties;

  return (
    <li style={accent} className={isFirst ? "" : "mt-6"}>
      <h2
        className="display mb-2 pl-7 text-[11px] uppercase tracking-[0.18em] leading-none"
        style={{ color: "var(--accent)" }}
      >
        {fase.navn}
      </h2>

      <ul className="relative">
        {items.length > 1 && (
          <span
            aria-hidden
            className="absolute left-[18px] top-[1.375rem] bottom-[1.375rem] w-px"
            style={{ background: "var(--accent)" }}
          />
        )}
        {items.map((etape) => (
          <Stop
            key={etape.slug}
            etape={etape}
            isActive={etape.slug === activeSlug}
          />
        ))}
      </ul>
    </li>
  );
}

function Stop({ etape, isActive }: { etape: Etape; isActive: boolean }) {
  return (
    <li>
      <a
        href={`#${etape.slug}`}
        aria-current={isActive ? "true" : undefined}
        className={`group flex min-h-11 items-center gap-3 rounded-xl pl-[14px] pr-3 transition-colors ${
          isActive
            ? "bg-[var(--accent-soft)]"
            : "hover:bg-[var(--accent-soft)]"
        }`}
      >
        <span
          aria-hidden
          className="relative z-10 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        <span
          className={`min-w-0 flex-1 truncate text-[15px] leading-tight text-[var(--color-foreground)] ${
            isActive ? "font-semibold" : "font-medium"
          }`}
        >
          {etape.navn}
        </span>
        <span
          className="shrink-0 font-mono text-[11px] tabular-nums"
          style={{
            color: isActive
              ? "var(--accent)"
              : "var(--color-muted-foreground)",
          }}
        >
          {etape.uger}u
        </span>
      </a>
    </li>
  );
}
