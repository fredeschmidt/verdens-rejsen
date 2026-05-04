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
        className="pointer-events-none fixed inset-y-0 left-0 -z-10 hidden w-full max-w-xl bg-gradient-to-r from-[rgba(20,20,20,0.7)] via-[rgba(20,20,20,0.35)] to-transparent sm:max-w-2xl lg:block"
      />

      <h1 className="sr-only">Verdens Rejsen — overblik</h1>

      <aside className="hidden lg:fixed lg:left-0 lg:top-1/2 lg:block lg:max-h-[calc(100vh-3rem)] lg:w-72 lg:-translate-y-1/2 lg:overflow-y-auto lg:px-5 xl:w-80 xl:pl-8">
        <Panel />
      </aside>

      <div className="lg:grid lg:grid-cols-[minmax(18rem,1fr)_minmax(0,46rem)_minmax(0,1fr)] xl:grid-cols-[minmax(20rem,1fr)_minmax(0,44rem)_minmax(0,1fr)]">
        <main className="mx-auto w-full min-w-0 max-w-[46rem] px-5 pb-16 pt-6 sm:pt-8 lg:col-start-2 xl:max-w-[44rem]">
          {children}
        </main>
      </div>
    </>
  );
}
