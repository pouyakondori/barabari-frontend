"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_COUNTRY } from "@/graphql/queries/countries";
import { GET_COUNTRY_TIMELINE } from "@/graphql/queries/timeline";
import { TimelineStepper } from "@/components/timeline/TimelineStepper";
import { localized } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Country, TimelineEvent } from "@/lib/types";

export default function CountryHistoryPage() {
  const params = useParams();
  const countrySlug = params.countrySlug as string;

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
        بازگشت به {country ? localized(country.name) : "کشور"}
      </Link>

      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
        تاریخچه {country ? localized(country.name) : ""}
      </h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        رویدادهای مهم سیاسی و حقوقی
      </p>

      {loading ? (
        <p className="text-[var(--color-muted-foreground)]">در حال بارگذاری...</p>
      ) : timeline.length === 0 ? (
        <p className="text-[var(--color-muted-foreground)]">هنوز رویدادی ثبت نشده است.</p>
      ) : (
        <TimelineStepper events={timeline} />
      )}
    </div>
  );
}
