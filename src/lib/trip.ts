export type Vibe = "natur" | "skov" | "strand" | "by" | "kultur" | "eventyr";

export type InternTransport = "camper" | "tog" | "bil" | "mix";

export type AccentName = "lilla" | "lime" | "pink" | "orange";

export type Etape = {
  slug: string;
  navn: string;
  flag: string;
  uger: number;
  startMaaned: string;
  slutMaaned: string;
  intern: InternTransport;
  vibes: Vibe[];
  blurb: string;
  hovedfokus: string;
  rute: string[];
  visumDanske: string;
  klimaNote: string;
  budgetDkk?: { min: number; maks: number };
};

export const ACCENT_HEX: Record<AccentName, string> = {
  lilla: "#8a7eef",
  lime: "#7fb81b",
  pink: "#d66ce8",
  orange: "#e88535",
};

export const ACCENT_SOFT: Record<AccentName, string> = {
  lilla: "rgba(187, 180, 254, 0.32)",
  lime: "rgba(232, 252, 135, 0.55)",
  pink: "rgba(237, 180, 248, 0.5)",
  orange: "rgba(254, 185, 133, 0.55)",
};

export const ETAPER: Etape[] = [
  {
    slug: "norge",
    navn: "Norge",
    flag: "🇳🇴",
    uger: 3,
    startMaaned: "aug 2030",
    slutMaaned: "aug 2030",
    intern: "camper",
    vibes: ["natur", "skov", "eventyr"],
    blurb: "Vores første etape — kort, nær og kendt. Sidste sommer-uger, fjorde, fjeld, vandfald.",
    hovedfokus: "Vestlandet og Lofoten — eller en koncentreret tur i fjordene mellem Bergen og Trondheim.",
    rute: ["Bergen", "Hardanger", "Sognefjord", "Trollstigen", "Trondheim"],
    visumDanske: "Fri rejse for danskere (Schengen, EØS).",
    klimaNote: "Sensommer, 12–20°C, lange dage i nord, vejr-skift på timen.",
    budgetDkk: { min: 42_000, maks: 68_000 },
  },
  {
    slug: "vietnam",
    navn: "Vietnam",
    flag: "🇻🇳",
    uger: 4,
    startMaaned: "sep 2030",
    slutMaaned: "sep 2030",
    intern: "mix",
    vibes: ["kultur", "by", "natur"],
    blurb: "Slut-monsun nord, tørtid begynder syd. Familievenligt, bredt — by, bjerge og bugt.",
    hovedfokus: "Hanoi → Halong → Hoi An. Fly mellem regioner for at skåne tid; spring eventuelt syd over.",
    rute: ["Hanoi", "Halong", "Hoi An"],
    visumDanske: "45 dage uden visum (verificer 2029–30).",
    klimaNote: "Slut-monsun nord, typhon-risiko central, tørtid begynder syd. 22–32°C.",
  },
  {
    slug: "bali",
    navn: "Bali",
    flag: "🇮🇩",
    uger: 3,
    startMaaned: "nov 2030",
    slutMaaned: "nov 2030",
    intern: "bil",
    vibes: ["natur", "strand", "kultur"],
    blurb: "Roligere tempo, rismarker, surf-strande og en pause før Japan.",
    hovedfokus: "Ubud (kultur, ris) → øst-kysten → eventuelt Lombok hvis tiden tillader.",
    rute: ["Ubud", "Østkysten", "Lombok"],
    visumDanske: "Visa on arrival 30 dage, kan forlænges (verificer 2029–30).",
    klimaNote: "Start-regntid, varmt og fugtigt, eftermiddagsbyger.",
  },
  {
    slug: "japan",
    navn: "Japan",
    flag: "🇯🇵",
    uger: 4,
    startMaaned: "dec 2030",
    slutMaaned: "jan 2031",
    intern: "tog",
    vibes: ["kultur", "by", "natur"],
    blurb: "Tog i stedet for camper. Mild vinter sydpå, nytår (oshōgatsu) som bonus.",
    hovedfokus: "Tokyo → Hakone → Kyoto → Hiroshima/Naoshima → eventuelt Kyushu eller Hokkaido for sne.",
    rute: ["Tokyo", "Hakone", "Kyoto", "Hiroshima", "Hokkaido"],
    visumDanske: "90 dage uden visum (verificer 2029–30).",
    klimaNote: "Vinter: tør og solrig syd, sne nord. 0–12°C alt efter region.",
  },
  {
    slug: "new-zealand",
    navn: "New Zealand",
    flag: "🇳🇿",
    uger: 6,
    startMaaned: "jan 2031",
    slutMaaned: "feb 2031",
    intern: "camper",
    vibes: ["natur", "eventyr", "strand"],
    blurb: "Ufravigeligt anker. Kerne-sommer på sydhalvkuglen. Camper og freedom camping.",
    hovedfokus: "Sydøen først (Queenstown, fjordene, Aoraki) → Nordøen senere (Coromandel, Rotorua).",
    rute: ["Queenstown", "Fjordene", "Aoraki", "Coromandel", "Rotorua"],
    visumDanske: "NZeTA + IVL, op til 90 dage (verificer 2029–30).",
    klimaNote: "Højsommer, 18–25°C, blæsende, varieret pr. region.",
  },
  {
    slug: "australien",
    navn: "Australien",
    flag: "🇦🇺",
    uger: 8,
    startMaaned: "mar 2031",
    slutMaaned: "apr 2031",
    intern: "camper",
    vibes: ["natur", "strand", "by"],
    blurb: "Efter NZ — slut-sommer, mildere midt-syd, korallerne aktive nord.",
    hovedfokus: "Østkysten Sydney → Brisbane → Cairns. Eventuelt Tasmanien hvis tid og lyst.",
    rute: ["Sydney", "Brisbane", "Cairns"],
    visumDanske: "eVisitor (subclass 651) op til 90 dage (verificer 2029–30).",
    klimaNote: "Slut-sommer/efterår, 18–28°C i syd, varmere mod nord.",
  },
  {
    slug: "hawaii",
    navn: "Hawaii",
    flag: "🌺",
    uger: 3,
    startMaaned: "maj 2031",
    slutMaaned: "maj 2031",
    intern: "bil",
    vibes: ["natur", "strand", "eventyr"],
    blurb: "Big Island og Oahu — vulkaner og bølger som bro mellem Australien og USA-fastlandet.",
    hovedfokus: "Big Island (vulkanen, sort sand, manta-natdyk) → Oahu (Waikiki, North Shore, Pearl Harbor).",
    rute: ["Big Island", "Oahu"],
    visumDanske: "ESTA dækker også Hawaii (verificer 2029–30).",
    klimaNote: "Slut-forår, 24–28°C, lav regn-risiko, hval-sæsonen lige slut.",
  },
  {
    slug: "usa",
    navn: "USA",
    flag: "🇺🇸",
    uger: 8,
    startMaaned: "maj 2031",
    slutMaaned: "jul 2031",
    intern: "camper",
    vibes: ["natur", "eventyr", "by"],
    blurb: "Stor camper-etape. Forår/sommer i nationalparkerne, før hede-toppen i juli.",
    hovedfokus: "Cali → Yosemite → Sierra → Utah Big Five → Grand Canyon → Yellowstone.",
    rute: ["California", "Yosemite", "Sierra", "Utah Big Five", "Grand Canyon", "Yellowstone"],
    visumDanske: "ESTA, op til 90 dage (verificer 2029–30).",
    klimaNote: "Forår → sommer, 15–35°C, store højde-forskelle.",
  },
  {
    slug: "canada",
    navn: "Canada",
    flag: "🇨🇦",
    uger: 7,
    startMaaned: "jul 2031",
    slutMaaned: "sep 2031",
    intern: "camper",
    vibes: ["natur", "skov", "eventyr"],
    blurb: "Højsommer i Rockies. Bjørne, søer, gletsjere, gigantisk skov.",
    hovedfokus: "Vancouver → Banff/Jasper → Yoho → eventuelt Vancouver Island.",
    rute: ["Vancouver", "Banff", "Jasper", "Yoho"],
    visumDanske: "eTA, op til 6 måneder (verificer 2029–30).",
    klimaNote: "Sommer, 15–28°C, kølige nætter i højderne.",
  },
  {
    slug: "portugal",
    navn: "Portugal",
    flag: "🇵🇹",
    uger: 2,
    startMaaned: "sep 2031",
    slutMaaned: "sep 2031",
    intern: "bil",
    vibes: ["kultur", "by", "strand"],
    blurb: "Indflyvning til Europa. Lissabon, Porto, evt. Algarve — derfra opad mod Spanien.",
    hovedfokus: "Lissabon (kultur, mad) → Porto eller Algarve → kør mod Spanien.",
    rute: ["Lissabon", "Porto", "Algarve"],
    visumDanske: "Schengen — fri rejse for danskere.",
    klimaNote: "Tidlig efterår, mildt 20–26°C, tørt.",
  },
  {
    slug: "spanien",
    navn: "Spanien",
    flag: "🇪🇸",
    uger: 2,
    startMaaned: "sep 2031",
    slutMaaned: "sep 2031",
    intern: "bil",
    vibes: ["kultur", "by", "natur"],
    blurb: "Tværs over halvøen — Madrid eller Baskerlandet, op mod Pyrenæerne.",
    hovedfokus: "Madrid eller Andalusien → San Sebastián/Bilbao → over grænsen til Frankrig.",
    rute: ["Madrid", "San Sebastián", "Bilbao"],
    visumDanske: "Schengen — fri rejse for danskere.",
    klimaNote: "Tidlig efterår, varmt syd, mildt nord, 18–26°C.",
  },
  {
    slug: "frankrig",
    navn: "Frankrig",
    flag: "🇫🇷",
    uger: 2,
    startMaaned: "sep 2031",
    slutMaaned: "okt 2031",
    intern: "bil",
    vibes: ["kultur", "by", "natur"],
    blurb: "Sidste roadtrip-strækning. Provence eller Bourgogne, nordpå mod Tyskland og hjem.",
    hovedfokus: "Provence eller Bourgogne efter smag → Tyskland-passage hjem til DK.",
    rute: ["Provence", "Bourgogne", "Tyskland", "Danmark"],
    visumDanske: "Schengen — fri rejse for danskere.",
    klimaNote: "Tidlig efterår, mildt 15–22°C.",
  },
];

export type Fase = {
  id: string;
  navn: string;
  periode: string;
  accent: AccentName;
  etaper: string[];
};

export const FASER: Fase[] = [
  {
    id: "norden",
    navn: "Norden",
    periode: "aug 2030",
    accent: "lilla",
    etaper: ["norge"],
  },
  {
    id: "asien",
    navn: "Asien",
    periode: "sep 2030 – jan 2031",
    accent: "orange",
    etaper: ["vietnam", "bali", "japan"],
  },
  {
    id: "sydhalvkuglen",
    navn: "Sydhalvkuglen",
    periode: "jan – apr 2031",
    accent: "lime",
    etaper: ["new-zealand", "australien"],
  },
  {
    id: "amerika",
    navn: "Amerika",
    periode: "maj – sep 2031",
    accent: "pink",
    etaper: ["hawaii", "usa", "canada"],
  },
  {
    id: "europa",
    navn: "Europa",
    periode: "sep – okt 2031",
    accent: "lilla",
    etaper: ["portugal", "spanien", "frankrig"],
  },
];

const ETAPE_TO_ACCENT: Record<string, AccentName> = Object.fromEntries(
  FASER.flatMap((f) => f.etaper.map((slug) => [slug, f.accent] as const)),
);

export function etapeAccent(slug: string): AccentName {
  return ETAPE_TO_ACCENT[slug] ?? "lilla";
}

export const DEPARTURE_DATE = new Date("2030-08-15T00:00:00Z");

export function daysUntilDeparture(): number {
  const ms = DEPARTURE_DATE.getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / 86_400_000));
}

export const TRIP_META = {
  afrejse: "midt-august 2030",
  hjemkomst: "medio oktober 2031",
  varighed: "14 måneder",
  totalUger: ETAPER.reduce((sum, e) => sum + e.uger, 0),
  antalLande: ETAPER.length,
  budgetMinDkk: 600_000,
  budgetMaksDkk: 900_000,
  ankerEtape: "new-zealand",
};

export function findEtape(slug: string): Etape | undefined {
  return ETAPER.find((e) => e.slug === slug);
}

export function accentVars(name: AccentName): { "--accent": string; "--accent-soft": string } {
  return {
    "--accent": ACCENT_HEX[name],
    "--accent-soft": ACCENT_SOFT[name],
  };
}
