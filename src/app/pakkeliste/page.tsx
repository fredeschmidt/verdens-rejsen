import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pakkeliste",
};

export default function PakkelistePage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 text-center lg:px-8 lg:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
        Kommer snart
      </p>
      <h1 className="display mt-4 text-balance text-4xl sm:text-5xl">
        Pakkeliste
      </h1>
      <p className="mx-auto mt-5 max-w-md text-[var(--color-muted-foreground)]">
        Pakkeliste pr. klimazone og pr. familiemedlem — bygges når land-skabelonerne er på plads.
      </p>
    </div>
  );
}
