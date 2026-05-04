# Verdens Rejsen

Privat planlægnings- og rejsekammerat-website for en families ét-årige jordomrejse 2030–2031. Bygget i Next.js 16 + Tailwind v4.

## Kør lokalt

```bash
npm install
npm run dev -- -p 3030
```

Åbn [http://localhost:3030](http://localhost:3030). (Port 3000 bruges af et andet projekt; vi kører på 3030.)

## Kommandoer

```bash
npm run dev         # dev-server (brug -p 3030)
npm run build       # produktions-build (statisk + SSG)
npm run start       # serve build
npm run lint        # eslint
```

## Hvor er hvad

- `src/lib/trip.ts` — rute, lande, accent-farver. Single source of truth.
- `src/app/` — Next.js App Router pages.
- `content/countries/<slug>.md` — indhold pr. land. Norge er reference-skabelon.
- `content/planning/` — rejseguidens rapporter (rute-fundament, Japan-eval, Hawaii-eval).
- `.claude/agents/rejseguide.md` — definition af rejseguide-subagenten.
- `AGENTS.md` — projekt-kontekst for AI-agenter (læses automatisk af Claude Code).

## Tilføj indhold for et nyt land

1. Find slug i `src/lib/trip.ts` (fx `thailand`).
2. Opret `content/countries/<slug>.md`.
3. Brug headings fra `##` og opefter (page-template ejer `<h1>`).
4. Følg strukturen i `content/countries/norge.md` — den er reference-skabelonen.

Eller bed Claude Code om at "lade rejseguiden skrive land-siden for Thailand" — så bliver indholdet skrevet i samme tone og struktur.

## Designprincipper

- Mobile-first, ser godt ud på desktop.
- Cream-baggrund + 4 accent-farver (lilla, lime, pink, orange).
- Light-mode only.
- Geist sans, ingen serif.
- Aurora-orbs i baggrunden, respekterer `prefers-reduced-motion`.

## Status

Privat (`robots: noindex, nofollow`). Password-gate kommer før eventuel deploy.

Rute er låst i v3 — ændringer kræver eksplicit beslutning og rejseguidens evaluering.
