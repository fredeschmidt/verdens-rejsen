export const dynamic = "force-dynamic";

export default function RejseDefault() {
  return (
    <div className="hidden min-h-[60vh] items-center justify-center lg:flex">
      <p className="max-w-xs text-center text-sm text-[var(--color-muted-foreground)]">
        Vælg et land til venstre for at læse rejseguidens noter.
      </p>
    </div>
  );
}
