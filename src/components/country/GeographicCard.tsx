"use client";

import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GET_COUNTRIES } from "@/graphql/queries/countries";
import { localized, formatNumber } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import {
  Globe,
  Droplets,
  Trees,
  Fish,
  Flame,
  Gem,
  Mountain,
  Zap,
  Pickaxe,
  Leaf,
  Info,
  Anchor,
} from "lucide-react";
import type { Country } from "@/lib/types";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const RESOURCE_ICONS: Record<string, React.ReactNode> = {
  Oil: <Droplets className="h-3.5 w-3.5" />,
  "Natural Gas": <Flame className="h-3.5 w-3.5" />,
  Coal: <Mountain className="h-3.5 w-3.5" />,
  Timber: <Trees className="h-3.5 w-3.5" />,
  Fish: <Fish className="h-3.5 w-3.5" />,
  "Iron Ore": <Pickaxe className="h-3.5 w-3.5" />,
  Gold: <Gem className="h-3.5 w-3.5" />,
  Copper: <Zap className="h-3.5 w-3.5" />,
  Lithium: <Zap className="h-3.5 w-3.5" />,
  Cork: <Leaf className="h-3.5 w-3.5" />,
  Tungsten: <Pickaxe className="h-3.5 w-3.5" />,
  Tin: <Pickaxe className="h-3.5 w-3.5" />,
  Potash: <Mountain className="h-3.5 w-3.5" />,
  Lignite: <Mountain className="h-3.5 w-3.5" />,
};

const RESOURCE_I18N_KEY: Record<string, string> = {
  Oil: "countries.resource_oil",
  "Natural Gas": "countries.resource_gas",
  Coal: "countries.resource_coal",
  Timber: "countries.resource_timber",
  Fish: "countries.resource_fish",
  "Iron Ore": "countries.resource_iron",
  Gold: "countries.resource_gold",
  Copper: "countries.resource_copper",
  Lithium: "countries.resource_lithium",
  Cork: "countries.resource_cork",
  Tungsten: "countries.resource_tungsten",
  Tin: "countries.resource_tin",
  Potash: "countries.resource_potash",
  Lignite: "countries.resource_lignite",
};

interface GeographicCardProps {
  country: Country;
}

export function GeographicCard({ country }: GeographicCardProps) {
  const { t, locale } = useTranslation();

  const { data: countriesData } = useQuery<{ countries: Country[] }>(
    GET_COUNTRIES,
    { variables: { limit: 100, offset: 0 } }
  );

  const borderCountries = useMemo(() => {
    if (!country.borders?.length || !countriesData?.countries) return [];
    return country.borders
      .map((slug) => countriesData.countries.find((c) => c.slug === slug))
      .filter(Boolean) as Country[];
  }, [country.borders, countriesData]);

  const hasGeoData =
    country.totalArea ||
    country.landlocked ||
    (country.borders && country.borders.length > 0) ||
    (country.naturalResources && country.naturalResources.length > 0);

  if (!hasGeoData) return null;

  return (
    <Card className="mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Globe className="h-5 w-5 text-[var(--color-primary)]" />
          {t("countries.geographic_data")}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          {/* Map */}
          <div className="rounded-xl overflow-hidden bg-[var(--color-muted)] flex items-center justify-center">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                center: [country.coordinates.lng, country.coordinates.lat],
                scale: (country.coordinates.zoom || 5) * 120,
              }}
              width={280}
              height={220}
              style={{ width: "100%", height: "auto" }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const isHighlighted =
                      geo.properties.name?.toLowerCase() ===
                      localized(country.name, "en").toLowerCase();
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isHighlighted ? "var(--color-primary)" : "#e2e8f0"}
                        stroke="#cbd5e1"
                        strokeWidth={0.5}
                        style={{
                          default: { outline: "none" },
                          hover: { outline: "none", fill: isHighlighted ? "var(--color-primary)" : "#cbd5e1" },
                          pressed: { outline: "none" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
              <Marker coordinates={[country.coordinates.lng, country.coordinates.lat]}>
                <circle r={3} fill="var(--color-primary)" stroke="#fff" strokeWidth={1} />
              </Marker>
            </ComposableMap>
          </div>

          {/* Info columns */}
          <div className="space-y-4">
            {/* Key stats row */}
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {country.totalArea != null && (
                <div>
                  <span className="text-xs text-[var(--color-muted-foreground)]">{t("countries.total_area")}</span>
                  <p className="text-sm font-semibold text-[var(--color-foreground)]">
                    {formatNumber(country.totalArea, locale)} {t("countries.total_area_unit")}
                  </p>
                </div>
              )}

              {country.landlocked != null && (
                <div>
                  <span className="text-xs text-[var(--color-muted-foreground)]">{t("countries.landlocked")}</span>
                  <p className="text-sm font-semibold text-[var(--color-foreground)] flex items-center gap-1.5">
                    {country.landlocked ? (
                      <>
                        <Mountain className="h-3.5 w-3.5 text-amber-600" />
                        {t("countries.landlocked_badge")}
                      </>
                    ) : (
                      <>
                        <Anchor className="h-3.5 w-3.5 text-blue-600" />
                        {t("countries.coastal")}
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* Landlocked info banner */}
            {country.landlocked && (
              <div className="flex gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800 leading-relaxed">
                <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                {t("countries.landlocked_info")}
              </div>
            )}

            {/* Regional Context — neighboring countries */}
            {borderCountries.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-muted-foreground)] mb-2">{t("countries.regional_context")}</p>
                <div className="flex flex-wrap gap-2">
                  {borderCountries.map((bc) => (
                    <Link
                      key={bc.slug}
                      href={`/countries/${bc.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-foreground)] hover:bg-[var(--color-primary)]/10 transition-colors"
                    >
                      <span className="text-base leading-none">{bc.flag}</span>
                      {localized(bc.name, locale)}
                    </Link>
                  ))}
                  {/* Show unresolved border slugs */}
                  {country.borders
                    ?.filter((slug) => !borderCountries.find((bc) => bc.slug === slug))
                    .map((slug) => (
                      <span
                        key={slug}
                        className="inline-flex items-center gap-1 rounded-full bg-[var(--color-muted)] px-3 py-1 text-xs text-[var(--color-muted-foreground)]"
                      >
                        {slug}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Natural Resources */}
            {country.naturalResources && country.naturalResources.length > 0 && (
              <div>
                <p className="text-xs text-[var(--color-muted-foreground)] mb-2">{t("countries.natural_resources")}</p>
                <div className="flex flex-wrap gap-2">
                  {country.naturalResources.map((resource) => (
                    <span
                      key={resource}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-muted)] px-2.5 py-1 text-xs font-medium text-[var(--color-foreground)]"
                    >
                      {RESOURCE_ICONS[resource] || <Gem className="h-3.5 w-3.5" />}
                      {RESOURCE_I18N_KEY[resource] ? t(RESOURCE_I18N_KEY[resource]) : resource}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
