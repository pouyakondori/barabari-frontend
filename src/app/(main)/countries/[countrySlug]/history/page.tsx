"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_COUNTRY } from "@/graphql/queries/countries";
import { GET_COUNTRY_TIMELINE } from "@/graphql/queries/timeline";
import { TimelineStepper } from "@/components/timeline/TimelineStepper";
import { localized } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Country, TimelineEvent } from "@/lib/types";

export default function CountryHistoryPage() {
  const params = useParams();
  const countrySlug = params.countrySlug as string;
  const { t, locale } = useTranslation();

  const { data: countryData } = useQuery<{ country: Country }>(GET_COUNTRY, { variables: { slug: countrySlug } });
  const { data: timelineData, loading } = useQuery<{ countryTimeline: TimelineEvent[] }>(GET_COUNTRY_TIMELINE, {
    variables: { countrySlug },
  });

  const country = countryData?.country;
  const timeline = timelineData?.countryTimeline || [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/countries/${countrySlug}`}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-6"
      >
        <ArrowRight className="h-4 w-4" />
        {`${t("countries.back_to")} ${country ? localized(country.name, locale) : t("countries.fallback_country")}`}
      </Link>

      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
        {`${t("history.title")} ${country ? localized(country.name, locale) : ""}`}
      </h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        {t("history.subtitle")}
      </p>

      {loading ? (
        <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
      ) : timeline.length === 0 ? (
        <p className="text-[var(--color-muted-foreground)]">{t("history.no_events")}</p>
      ) : (
        <TimelineStepper events={timeline} />
      )}
    </div>
  );
}
