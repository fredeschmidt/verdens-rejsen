/**
 * SectionNav — segment-navigation der jumper mellem de to hovedsektioner
 * på en land-side (typisk "Før" og "Under"). Sticky øverst på mobil så
 * man altid kan hoppe mellem dem uden at scrolle tilbage.
 *
 * Det er bevidst ikke en stateful tab-switch der gemmer den anden
 * sektion — på en lang læseside er det vigtigere at man kan scrolle
 * begge igennem og komme hurtigt tilbage end at vi gemmer halvdelen.
 */
export function SectionNav({
  items,
}: {
  items: { id: string; label: string; emoji: string }[];
}) {
  if (items.length === 0) return null;

  return (
    <div className="sticky top-0 z-20 -mb-px border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-background)_88%,transparent)] backdrop-blur">
      <nav
        aria-label="Sektioner"
        className="mx-auto flex max-w-4xl items-center gap-1.5 px-5 py-2.5 lg:px-8"
      >
        <span className="hidden font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-muted-foreground)] sm:inline">
          Spring til
        </span>
        <span aria-hidden className="hidden h-3 w-px bg-[var(--color-border)] sm:inline-block" />
        <div className="flex flex-1 flex-wrap gap-1.5">
          {items.map((it) => (
            <a
              key={it.id}
              href={`#${it.id}`}
              className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-1.5 text-[0.8rem] font-medium text-[var(--color-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span aria-hidden>{it.emoji}</span>
              {it.label}
            </a>
          ))}
        </div>
      </nav>
    </div>
  );
}
