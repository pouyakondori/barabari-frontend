"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_COUNTRY } from "@/graphql/queries/countries";
import { GET_CONSTITUTION } from "@/graphql/queries/constitution";
import { GET_COUNTRY_TIMELINE } from "@/graphql/queries/timeline";
import { GET_PODCASTS_BY_COUNTRY } from "@/graphql/queries/podcasts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimelineStepper } from "@/components/timeline/TimelineStepper";
import { localized, formatNumber, formatDate } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { BookOpen, Clock, Users, Info } from "lucide-react";
import { GeographicCard } from "@/components/country/GeographicCard";
import PodcastPlayer from "@/components/podcast/PodcastPlayer";
import type { Country, Constitution, TimelineEvent, Amendment, ReligiousComposition, Podcast } from "@/lib/types";

function HdiLabel({ value, t }: { value: number; t: (key: string) => string }) {
  if (value >= 0.8) return <span className="text-emerald-600 font-medium">{t("countries.very_high")}</span>;
  if (value >= 0.7) return <span className="text-blue-600 font-medium">{t("countries.high")}</span>;
  if (value >= 0.55) return <span className="text-amber-600 font-medium">{t("countries.medium")}</span>;
  return <span className="text-red-600 font-medium">{t("countries.low")}</span>;
}

function CorruptionLabel({ value, t }: { value: number; t: (key: string) => string }) {
  if (value >= 70) return <span className="text-emerald-600 font-medium">{t("countries.very_high")}</span>;
  if (value >= 50) return <span className="text-blue-600 font-medium">{t("countries.high")}</span>;
  if (value >= 30) return <span className="text-amber-600 font-medium">{t("countries.medium")}</span>;
  return <span className="text-red-600 font-medium">{t("countries.low")}</span>;
}

function ProgressBar({ value, max, colorClass }: { value: number; max: number; colorClass: string }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="w-full h-2 rounded-full bg-[var(--color-muted)] overflow-hidden">
      <div className={`h-full rounded-full transition-all ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function hdiColor(v: number) {
  if (v >= 0.8) return "bg-emerald-500";
  if (v >= 0.7) return "bg-blue-500";
  if (v >= 0.55) return "bg-amber-500";
  return "bg-red-500";
}

function cpiColor(v: number) {
  if (v >= 70) return "bg-emerald-500";
  if (v >= 50) return "bg-blue-500";
  if (v >= 30) return "bg-amber-500";
  return "bg-red-500";
}

function Tooltip({ text }: { text: string }) {
  return (
    <span className="group relative inline-flex items-center ms-1 cursor-help">
      <Info className="h-3.5 w-3.5 text-[var(--color-muted-foreground)]" />
      <span className="invisible group-hover:visible absolute z-10 bottom-full mb-2 start-1/2 -translate-x-1/2 w-64 rounded-lg bg-[var(--color-foreground)] text-[var(--color-background)] text-xs p-3 leading-relaxed shadow-lg">
        {text}
      </span>
    </span>
  );
}

export default function CountryProfilePage() {
  const params = useParams();
  const countrySlug = params.countrySlug as string;
  const { t, locale } = useTranslation();

  const { data: countryData, loading: countryLoading } = useQuery<{ country: Country }>(GET_COUNTRY, {
    variables: { slug: countrySlug },
  });
  const { data: constitutionData } = useQuery<{ constitution: Constitution }>(GET_CONSTITUTION, {
    variables: { countrySlug },
  });
  const { data: timelineData } = useQuery<{ countryTimeline: TimelineEvent[] }>(GET_COUNTRY_TIMELINE, {
    variables: { countrySlug },
  });
  const { data: podcastData } = useQuery<{ podcastsByCountry: Podcast[] }>(GET_PODCASTS_BY_COUNTRY, {
    variables: { countrySlug },
  });

  const country = countryData?.country;
  const constitution = constitutionData?.constitution;
  const timeline = timelineData?.countryTimeline || [];
  const podcasts = podcastData?.podcastsByCountry || [];

  if (countryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">{t("countries.not_found")}</p>
      </div>
    );
  }

  const totalClauses = constitution?.chapters.reduce(
    (sum, ch) => sum + ch.articles.reduce((aSum, a) => aSum + a.clauses.length, 0),
    0
  ) || 0;

  const hasQuickFacts = country.systemOfGovernment || country.hdi != null || country.gdp ||
    country.independenceDate || (country.officialLanguages && country.officialLanguages.length > 0) ||
    country.urbanizationRate != null || country.corruptionIndex != null ||
    (country.religiousComposition && country.religiousComposition.length > 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{country.flag}</span>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
              {localized(country.name, locale)}
            </h1>
            <p className="text-[var(--color-muted-foreground)] flex items-center gap-2 mt-1">
              <Users className="h-4 w-4" />
              {t("countries.population")}: {formatNumber(country.population, locale)}
            </p>
          </div>
        </div>

        {/* Abstract */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-[var(--color-foreground)] leading-relaxed">
              {localized(country.abstract, locale)}
            </p>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/countries/${countrySlug}/constitution`}>
            <Button variant="primary">
              <BookOpen className="me-2 h-4 w-4" />
              {t("countries.full_text")}
            </Button>
          </Link>
          <Link href={`/countries/${countrySlug}/history`}>
            <Button variant="outline">
              <Clock className="me-2 h-4 w-4" />
              {t("history.title")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Facts Section */}
      {hasQuickFacts && (
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t("countries.quick_facts")}</CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-5">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[var(--color-border)]">
              {/* Left column — key-value rows */}
              <div className="divide-y divide-[var(--color-border)] md:pe-6">
                {country.systemOfGovernment && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-[var(--color-muted-foreground)]">{t("countries.system_of_government")}</span>
                    <span className="text-sm font-medium text-[var(--color-foreground)]">
                      {t(`countries.government_types.${country.systemOfGovernment}`) !== `countries.government_types.${country.systemOfGovernment}`
                        ? t(`countries.government_types.${country.systemOfGovernment}`)
                        : country.systemOfGovernment}
                    </span>
                  </div>
                )}

                {country.independenceDate && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-[var(--color-muted-foreground)]">{t("countries.independence_date")}</span>
                    <span className="text-sm font-medium text-[var(--color-foreground)]">{formatDate(country.independenceDate, locale)}</span>
                  </div>
                )}

                {country.gdp && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-[var(--color-muted-foreground)]">{t("countries.gdp")}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[var(--color-foreground)]">{country.gdp}</span>
                      {country.economicType && (
                        <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[11px] font-medium text-blue-700 leading-none">
                          {country.economicType}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {country.officialLanguages && country.officialLanguages.length > 0 && (
                  <div className="flex items-center justify-between py-2.5">
                    <span className="text-sm text-[var(--color-muted-foreground)]">{t("countries.official_languages")}</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {country.officialLanguages.map((lang) => (
                        <span key={lang} className="rounded-full bg-[var(--color-muted)] px-2 py-0.5 text-xs font-medium text-[var(--color-foreground)]">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Religious Composition — inline beneath key-value rows */}
                {country.religiousComposition && country.religiousComposition.length > 0 && (
                  <div className="py-2.5">
                    <span className="text-sm text-[var(--color-muted-foreground)]">{t("countries.religious_composition")}</span>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1.5">
                      {country.religiousComposition.map((item: ReligiousComposition) => (
                        <span key={item.religion} className="text-xs text-[var(--color-foreground)]">
                          {item.religion} <span className="text-[var(--color-muted-foreground)] font-medium">{item.percentage}%</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column — metrics with progress bars */}
              <div className="space-y-4 pt-4 md:pt-0 md:ps-6">
                {country.hdi != null && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--color-muted-foreground)] flex items-center">
                        {t("countries.hdi")}
                        <Tooltip text={t("countries.hdi_tooltip")} />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-foreground)]">{country.hdi.toFixed(3)}</span>
                        <HdiLabel value={country.hdi} t={t} />
                      </div>
                    </div>
                    <ProgressBar value={country.hdi} max={1} colorClass={hdiColor(country.hdi)} />
                  </div>
                )}

                {country.corruptionIndex != null && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--color-muted-foreground)] flex items-center">
                        {t("countries.corruption_index")}
                        <Tooltip text={t("countries.corruption_index_tooltip")} />
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--color-foreground)]">{country.corruptionIndex}/100</span>
                        <CorruptionLabel value={country.corruptionIndex} t={t} />
                      </div>
                    </div>
                    <ProgressBar value={country.corruptionIndex} max={100} colorClass={cpiColor(country.corruptionIndex)} />
                  </div>
                )}

                {country.urbanizationRate != null && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[var(--color-muted-foreground)]">{t("countries.urbanization_rate")}</span>
                      <span className="text-sm font-semibold text-[var(--color-foreground)]">{country.urbanizationRate}%</span>
                    </div>
                    <ProgressBar value={country.urbanizationRate} max={100} colorClass="bg-violet-500" />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Geographic Data Section */}
      <GeographicCard country={country} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Constitution overview */}
          {constitution && (
            <Card>
              <CardHeader>
                <CardTitle>{t("countries.constitution")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-[var(--color-muted)]">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {constitution.chapters.length}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{t("countries.chapter")}</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[var(--color-muted)]">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {totalClauses}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{t("countries.clause")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Authors */}
          {country.authors && country.authors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("countries.authors")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {country.authors.map((author, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold">
                        {author.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--color-foreground)]">{author.name}</p>
                        <p className="text-sm text-[var(--color-muted-foreground)]">{author.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amendments */}
          {country.amendments && country.amendments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("countries.amendments")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {country.amendments.map((amendment: Amendment, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="inline-flex h-6 min-w-[3rem] items-center justify-center rounded bg-[var(--color-primary)] text-xs text-white font-medium">
                        {amendment.year}
                      </span>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {localized(amendment.description, locale)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Podcasts */}
          {podcasts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("podcasts.country_podcasts")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {podcasts.map((podcast) => (
                  <PodcastPlayer
                    key={podcast.id}
                    audioUrl={podcast.audioUrl}
                    title={localized(podcast.title, locale)}
                    description={localized(podcast.description, locale)}
                    duration={podcast.duration}
                  />
                ))}
              </CardContent>
            </Card>
          )}

          {/* Timeline preview */}
          {timeline.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t("countries.timeline_events")}</CardTitle>
                  <Link
                    href={`/countries/${countrySlug}/history`}
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    {t("countries.view_all")}
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <TimelineStepper events={timeline.slice(0, 3)} />
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
