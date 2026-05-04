import { Panel } from "./Panel";

export default function RejseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url(/img/familie-rejse.png)",
          filter: "saturate(1.08) contrast(1.05)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-y-0 left-0 -z-10 w-full max-w-xl bg-gradient-to-r from-[rgba(255,254,236,0.55)] via-[rgba(255,254,236,0.15)] to-transparent sm:max-w-2xl"
      />

      <h1 className="sr-only">Verdens Rejsen — overblik</h1>

      <div className="mx-auto w-full max-w-7xl px-5 pt-6 pb-16 sm:pt-8 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] lg:gap-8">
          <aside className="lg:sticky lg:top-20 lg:self-start lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1">
            <Panel />
          </aside>
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </>
  );
}
