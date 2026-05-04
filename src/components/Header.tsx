import Link from "next/link";

const NAV = [
  { href: "/", label: "Rejse" },
  { href: "/pakkeliste", label: "Pakkeliste" },
  { href: "/budget", label: "Budget" },
];

export function Header({
  dage,
  lande,
  uger,
}: {
  dage: number;
  lande: number;
  uger: number;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[color-mix(in_oklab,var(--color-background)_60%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4 lg:px-8">
        <div className="flex items-baseline gap-x-4 gap-y-1">
          <Link
            href="/"
            className="display text-xl tracking-tight text-[var(--color-foreground)]"
          >
            Verdens Rejsen
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted-foreground)]">
            <span className="font-semibold tabular-nums text-[var(--color-foreground)]">
              {dage.toLocaleString("da-DK")}
            </span>{" "}
            dage · {lande} lande · {uger} uger
          </p>
        </div>
        <nav className="-mx-1 flex gap-1 overflow-x-auto text-sm sm:mx-0 sm:gap-2 sm:text-[15px]">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-1.5 font-medium text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
