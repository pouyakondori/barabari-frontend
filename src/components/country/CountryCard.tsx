"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatNumber, localized } from "@/lib/utils";
import { useTranslation } from "@/locale";
import type { Country } from "@/lib/types";

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  const { t, locale } = useTranslation();

  return (
    <Link href={`/countries/${country.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <span className="text-4xl">{country.flag}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-[var(--color-foreground)]">
                {localized(country.name, locale)}
              </h3>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
                {t("countries.population")}: {formatNumber(country.population, locale)}
              </p>
              {country.abstract && (
                <p className="text-sm text-[var(--color-muted-foreground)] mt-2 line-clamp-2">
                  {localized(country.abstract, locale)}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
