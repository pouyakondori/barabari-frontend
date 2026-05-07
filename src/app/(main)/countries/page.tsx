"use client";

import { useQuery } from "@apollo/client/react";
import { GET_COUNTRIES } from "@/graphql/queries/countries";
import { CountryCard } from "@/components/country/CountryCard";
import { useTranslation } from "@/locale";
import type { Country } from "@/lib/types";

export default function CountriesPage() {
  const { t } = useTranslation();
  const { data, loading } = useQuery<{ countries: Country[] }>(GET_COUNTRIES);
  const countries = data?.countries || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">{t("countries.title")}</h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        {t("countries.description")}
      </p>

      {loading ? (
        <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country: Country) => (
            <CountryCard key={country.id} country={country} />
          ))}
        </div>
      )}
    </div>
  );
}
