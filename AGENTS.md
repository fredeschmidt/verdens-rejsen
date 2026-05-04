# Verdens Rejsen — agent context

Privat website der både planlægger og ledsager en families ét-årige jordomrejse omkring **2030–2031**. Bygges i Next.js 16 + Tailwind v4 + TypeScript.

## Familien

- Mor + Casper (far)
- Olli (~9 ved afrejse)
- Luca (~7 ved afrejse)

Erfarne camper-folk, danske statsborgere, bor i Danmark. Budget 600–900k DKK total. Kun Casper kører højre-rat (NZ + AU). Ingen egen camper — alt lejes.

## Sitets dobbeltrolle

1. **Planlægning** i 4 år før afrejse.
2. **Håndholdt rejsekammerat på telefonen** undervejs — pre-arrival brief + on-the-ground reference pr. land.

Antag mobil-læsning på ustabil 4G. Skriv scanbart, korte sektioner, klart hierarki.

## Låst rute (v3 — ændringer kræver eksplicit beslutning)

Ruten er grupperet i 5 faser. **Farver tilhører fasen, ikke det enkelte land** — lilla rammer både Norden (start) og Europa (slut) som bogstøtter.

| Fase | Accent | Lande | Uger | Måneder |
|---|---|---|---|---|
| Norden | lilla | Norge | 3 | aug 2030 |
| Asien | orange | Vietnam, Bali, Japan | 11 | sep 2030 – jan 2031 |
| Sydhalvkuglen | lime | New Zealand, Australien | 14 | jan – apr 2031 |
| Amerika | pink | Hawaii, USA, Canada | 18 | maj – sep 2031 |
| Europa | lilla | Portugal, Spanien, Frankrig | 6 | sep – okt 2031 |

NZ-sommeren er ufravigeligt anker. Detaljerede rapporter i `content/planning/`. Fase-definition lever i `src/lib/trip.ts` (`FASER`); brug `etapeAccent(slug)` til at slå et lands accent op.

## Tekstkonventioner

- **Sprog:** dansk overalt — UI, indhold, kommit-beskeder.
- **Valuta:** DKK med lokal valuta i parentes når relevant.
- **Sæsoner:** specifikke måneder (`aug 2030`), ikke `om sommeren`.
- **Børn først:** alt skal kunne forklares ud fra "hvad gør det her ved en 7- og 9-årig?".
- **Aldrig opfind tal**: visumregler, priser, åbningstider, vejr-statistik. Slå op via WebSearch eller marker `verificer 2029–30`.

## Designsprog

- Cream-baggrund (`#fffeec`), rich black (`#141414`).
- 4 accenter: lilla `#8a7eef`, lime `#7fb81b`, pink `#d66ce8`, orange `#e88535`.
- **Geist Sans + Geist Mono** — ingen serif.
- `.display`-klasse: `letter-spacing: -0.02em; font-weight: 700`.
- `rounded-3xl` på cards. Aurora-orbs i baggrunden.
- **Light-mode only** — ingen dark mode.
- Mobile-first, men skal se godt ud på desktop.

## Projektstruktur

```
src/
├── app/                     # Next.js App Router
│   ├── layout.tsx           # Root + aurora orbs
│   ├── page.tsx             # Forside med hero + tidslinje
│   ├── lande/
│   │   ├── page.tsx         # Grid over alle 10 lande
│   │   └── [slug]/page.tsx  # Land-detalje (læser content/countries/<slug>.md)
│   ├── pakkeliste/page.tsx  # Stub
│   └── budget/page.tsx      # Stub
├── components/
│   ├── Header.tsx
│   ├── CountryCard.tsx
│   └── RouteTimeline.tsx
└── lib/
    ├── trip.ts              # Single source of truth — rute, lande, accents
    └── content.ts           # Markdown-loader (marked + sanitize-html)

content/
├── planning/                # Rejseguidens rapporter (route, japan-eval, hawaii-eval)
└── countries/               # En .md pr. land — skrives af rejseguiden
```

## Indholdskonventioner i `content/countries/<slug>.md`

- Headings starter ved `##` (page-template tager `<h1>`).
- Strukturer typisk i to hovedsektioner: `## Før ankomst` og `## På stedet`.
- Brug tabeller til pris-niveauer i DKK.
- Brug `> blockquote` til advarsler eller "verificer"-noter.

## Subagenter

- `.claude/agents/rejseguide.md` — erfaren jordomrejsende familie-rejseguide. Brug proaktivt til alle indholds- og rute-beslutninger.
- `.claude/agents/ux.md` — senior UX-designer med fokus på simpelt, struktureret overblik. Brug proaktivt før/efter UI-ændringer og når en visning føles tung eller rodet. Strukturerer indhold; skriver det ikke.

## Hvor man IKKE skal kigge efter sandhed

- **Træningsdata om priser, visum, åbningstider** — er sandsynligvis forældet. Slå op live, eller marker som foreløbigt.
- **Rejseguidens output** — markdown-rapporter er drafts; verificer tættere på afrejse.
