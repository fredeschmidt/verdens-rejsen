# Claude-memory backup — Verdens Rejsen

Backup af det persistente memory Claude Code har bygget op om dette projekt.
Bruges hvis maskinen skiftes ud, og memory-mappen mistes.

**Original placering på disk:**
`~/.claude/projects/-Users-frsc-Documents-VERDENS-REJSEN/memory/`

**Sådan gendannes på ny maskine:**
1. Klon repo'et.
2. Opret mappen `~/.claude/projects/-Users-frsc-Documents-VERDENS-REJSEN/memory/` (Claude Code laver den selv første gang projektet åbnes).
3. Kopier hver sektion herunder ind i en fil med det navn der står i overskriften.

---

## Fil: `MEMORY.md`

```markdown
- [User family profile](user_family.md) — Familien (mor, far, Olli 5, Luca 3) bag Verdens Rejsen, planlægger jordomrejse ca. 2030
- [Verdens Rejsen project](project_verdens_rejsen.md) — Greenfield Next.js+Tailwind site for ét-årig familierejse: lande, præferencer, langsigtet scope
```

---

## Fil: `user_family.md`

```markdown
---
name: User family profile
description: Family composition and travel context for the "Verdens Rejsen" project
type: user
---
Brugeren er mor i en familie på fire:
- Mor (brugeren)
- **Casper** (far)
- Olli, 5 år (2026) → ca. 9 år ved afrejse
- Luca, 3 år (2026) → ca. 7 år ved afrejse

**Kørsels-begrænsning:** Kun Casper kører højre-rat (relevant i NZ og Australien — Casper kører hele de etaper).

Familien planlægger en ét-årig jordomrejse med afrejse omkring 2030. De har erfaring med camper-rejser og foretrækker at finde overnatningssteder undervejs ("vild" parkering / spontane stop). De elsker natur, skov, strand og by.

Brugeren skriver dansk — svar på dansk medmindre andet aftales.
```

---

## Fil: `project_verdens_rejsen.md`

```markdown
---
name: Verdens Rejsen project
description: Greenfield Next.js + Tailwind site for planning a one-year family world trip starting ~2030
type: project
---
Projektet "Verdens Rejsen" er et greenfield Next.js + Tailwind-website, der skal fungere som planlægnings- og fortælle-hub for en ét-årig familierejse omkring 2030.

**Why:** Familien skal bruge ét sted at samle overblik, ruter, budgetter, pakkeliste, anbefalinger og oplevelser frem mod afrejse — og potentielt under selve turen.

**How to apply:** Behandl det som et langlevende, indholdstungt projekt (4 års planlægningsfase + 1 års rejse) — ikke en throwaway-prototype. Tænk i datamodel der kan udvides (etaper, lande, transport, overnatning, budget, packing, blog/billeder). Foreslå Vercel-deploy via tilkoblet plugin.

**Sitets dobbeltrolle (kritisk for designvalg):**
1. **Planlægningsværktøj** under de fire års forberedelse.
2. **Håndholdt rejsekammerat** på telefonen undervejs — ved/før ankomst til hvert land skal de hurtigt kunne tjekke: hvad skal være pakket, hvad bør vi vide om kulturen/folket, hvad skal vi se, hvor i landet starter vi, typiske priser på mad, oplevelser etc.

**Konsekvens for design:**
- **Mobile-first** UI, men skal også se fedt ud på desktop.
- Hvert land/etape skal have en "pre-arrival brief" og "on-the-ground quick reference" der kan tilgås offline-venligt.
- Indhold skal kunne tilgås hurtigt (typisk på en ustabil 4G-forbindelse i en camper).
- Tænk i info-kort/sektioner med klar visuel hierarki, ikke lange essays.

**Rute v3 (LÅST 2026-04-30, Hawaii tilføjet):** Norge (3u) → Thailand (7u) → Bali (3u) → Japan (4u) → New Zealand (8u) → Australien (6u) → **Hawaii (2u)** → USA (8u) → Canada (7u) → Europa-hjem (3u). 51 uger total + buffer. Afrejse midt-august 2030. Hawaii = Big Island + Oahu, start–medio maj 2031 mellem AU og USA-fastland (naturlig flyrute Sydney → HNL → LAX, ingen ekstra inter-kontinental flyvning). Hawaii bruger SUV + airbnb (familien er camper-mæt efter NZ+AU). Fuld rute-rapport: `content/planning/route-foundation.md`. Evalueringer: `content/planning/japan-evaluation.md`, `content/planning/hawaii-evaluation.md`.

> **Bemærk (2026-05-26):** Ruten er senere ændret. Den aktuelle v3 i `AGENTS.md` er: Norge → Vietnam → Bali → Japan → NZ → AU → Hawaii → USA → Canada → Portugal → Spanien → Frankrig, opdelt i 5 faser (Norden, Asien, Sydhalvkugle, Amerika, Europa). Brug `src/lib/trip.ts` som single source of truth.

**Rute-cuts (kumuleret v1→v3):** Thailand 10→7u, Bali 4→3u, NZ 9→8u, Canada 8→7u (Japan), USA-fastland 10→8u (Hawaii — PNW-segment droppet, kan delvist hentes via Canada-benet Vancouver↔Seattle).

**Visuel identitet (historisk — pr. land):** Tidlig version havde unik accent pr. land. Aktuel version (se `AGENTS.md`) bruger 4 accenter delt pr. fase: lilla (Norden+Europa), orange (Asien), lime (Sydhalvkugle), pink (Amerika).

**Familiens praktiske rammer (bekræftet 2026-04-30):**
- Budget: **600–900k DKK** for hele turen.
- **Ingen egen camper** — alt camper-leje undervejs (booking 6–9 mdr. før i NZ/AU/Canada er accepteret).
- Kun **Casper** kører højre-rat (NZ + AU).
- Værdi-prioritet: **både natur og storby** — ruten skal afspejle begge.
- **Afrika ruled out**. Familien er åben for andre regioner (fx Japan, Sydamerika), men rute-fundamentet er låst som det er — yderligere lande skal eksplicit byttes ind.

**Åben/kritisk:** Skolepligts-fritagelse / fjernundervisning er **ikke afklaret med kommunen endnu** — kritisk path og skal følges op tidligt nok til ikke at presse afrejsen. Lange distancer flyves; lokal transport primært i camper.

**Arbejdsmappe:** /Users/frsc/Documents/VERDENS-REJSEN

**Beslutninger truffet:**
- Sprog på sitet: **dansk**.
- Tilgængelighed: **privat** (kun familien).
- Indholdsstyring: redigeres direkte i koden (Markdown/MDX).
- Første version prioriterer **kort + etape-overblik** ("det smukke") før budget/pakkeliste.

**Subagent:** `.claude/agents/rejseguide.md` — erfaren jordomrejsende familie-rejseguide. Skal bruges proaktivt til alle indholds- og rute-beslutninger på sitet.
```
