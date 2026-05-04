import type { Metadata } from "next";
import { TRIP_META } from "@/lib/trip";

export const metadata: Metadata = {
  title: "Budget",
};

const fmt = new Intl.NumberFormat("da-DK", { maximumFractionDigits: 0 });

export default function BudgetPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16 lg:px-8 lg:py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-muted-foreground)]">
        Kommer snart
      </p>
      <h1 className="display mt-4 text-balance text-4xl sm:text-5xl">Budget</h1>
      <p className="mt-5 max-w-xl text-[var(--color-muted-foreground)]">
        Total-budget brydes ned pr. land og pr. kategori (transport, overnatning, mad, oplevelser, forsikring) når rejseguiden har lagt ramme-tallene.
      </p>
      <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-3">
        <Cell label="Lav-ramme" value={`${fmt.format(TRIP_META.budgetMinDkk)} DKK`} />
        <Cell label="Komfort-ramme" value={`${fmt.format(TRIP_META.budgetMaksDkk)} DKK`} />
        <Cell label="Varighed" value={TRIP_META.varighed} />
      </dl>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--color-card)] p-5">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {label}
      </dt>
      <dd className="display mt-2 text-2xl">{value}</dd>
    </div>
  );
}
