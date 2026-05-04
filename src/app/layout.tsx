import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Header } from "@/components/Header";
import { TRIP_META, daysUntilDeparture } from "@/lib/trip";
import "./globals.css";

export const dynamic = "force-dynamic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Verdens Rejsen",
    template: "%s · Verdens Rejsen",
  },
  description:
    "En families ét-årige rejse rundt om jorden. Ruter, etaper, pakkeliste, budget og oplevelser i lommen.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#fffeec",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="da" className={`${geistSans.variable} scroll-smooth`}>
      <body className="flex min-h-screen flex-col">
        <Header
          dage={daysUntilDeparture()}
          lande={TRIP_META.antalLande}
          uger={TRIP_META.totalUger}
        />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[var(--color-border)] px-5 py-8 text-center text-xs text-[var(--color-muted-foreground)]">
          Verdens Rejsen · privat planlægning · 2030–2031
        </footer>
      </body>
    </html>
  );
}
