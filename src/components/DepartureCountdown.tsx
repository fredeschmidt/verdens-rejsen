"use client";

import { useSyncExternalStore } from "react";
import { daysUntilDeparture } from "@/lib/trip";

function subscribe(cb: () => void): () => void {
  const t = setInterval(cb, 60_000);
  return () => clearInterval(t);
}

export function DepartureCountdown() {
  const dage = useSyncExternalStore(
    subscribe,
    () => daysUntilDeparture(),
    () => null,
  );

  return (
    <span className="font-semibold tabular-nums text-[var(--color-foreground)]">
      {dage === null ? "—" : dage.toLocaleString("da-DK")}
    </span>
  );
}
