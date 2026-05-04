import { ETAPER } from "@/lib/trip";
import { getCountryContent } from "@/lib/content";
import { CountrySection } from "./CountrySection";

export default async function Home() {
  const countries = await Promise.all(
    ETAPER.map(async (etape) => ({
      etape,
      content: await getCountryContent(etape.slug),
    })),
  );

  return (
    <div className="space-y-8">
      {countries.map(({ etape, content }) => (
        <CountrySection key={etape.slug} etape={etape} content={content} />
      ))}
    </div>
  );
}
