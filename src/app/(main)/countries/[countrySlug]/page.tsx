"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_COUNTRY } from "@/graphql/queries/countries";
import { GET_CONSTITUTION } from "@/graphql/queries/constitution";
import { GET_COUNTRY_TIMELINE } from "@/graphql/queries/timeline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TimelineStepper } from "@/components/timeline/TimelineStepper";
import { localized, formatNumber, formatDate } from "@/lib/utils";
import Link from "next/link";
import { BookOpen, Clock, Users, MapPin } from "lucide-react";
import type { Country, Constitution, TimelineEvent, Amendment } from "@/lib/types";

export default function CountryProfilePage() {
  const params = useParams();
  const countrySlug = params.countrySlug as string;

  const { data: countryData, loading: countryLoading } = useQuery<{ country: Country }>(GET_COUNTRY, {
    variables: { slug: countrySlug },
  });
  const { data: constitutionData } = useQuery<{ constitution: Constitution }>(GET_CONSTITUTION, {
    variables: { countrySlug },
  });
  const { data: timelineData } = useQuery<{ countryTimeline: TimelineEvent[] }>(GET_COUNTRY_TIMELINE, {
    variables: { countrySlug },
  });

  const country = countryData?.country;
  const constitution = constitutionData?.constitution;
  const timeline = timelineData?.countryTimeline || [];

  if (countryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!country) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">کشور یافت نشد</p>
      </div>
    );
  }

  const totalClauses = constitution?.chapters.reduce(
    (sum, ch) => sum + ch.articles.reduce((aSum, a) => aSum + a.clauses.length, 0),
    0
  ) || 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <span className="text-6xl">{country.flag}</span>
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
              {localized(country.name)}
            </h1>
            <p className="text-[var(--color-muted-foreground)] flex items-center gap-2 mt-1">
              <Users className="h-4 w-4" />
              جمعیت: {formatNumber(country.population)}
            </p>
          </div>
        </div>

        {/* Abstract */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-[var(--color-foreground)] leading-relaxed">
              {localized(country.abstract)}
            </p>
          </CardContent>
        </Card>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link href={`/countries/${countrySlug}/constitution`}>
            <Button variant="primary">
              <BookOpen className="me-2 h-4 w-4" />
              متن کامل قانون اساسی
            </Button>
          </Link>
          <Link href={`/countries/${countrySlug}/history`}>
            <Button variant="outline">
              <Clock className="me-2 h-4 w-4" />
              تاریخچه
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Constitution overview */}
          {constitution && (
            <Card>
              <CardHeader>
                <CardTitle>قانون اساسی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-[var(--color-muted)]">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {constitution.chapters.length}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">فصل</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-[var(--color-muted)]">
                    <p className="text-2xl font-bold text-[var(--color-primary)]">
                      {totalClauses}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">بند</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Authors */}
          {country.authors && country.authors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>نویسندگان قانون اساسی</CardTitle>
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
                <CardTitle>اصلاحیه‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {country.amendments.map((amendment: Amendment, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="inline-flex h-6 min-w-[3rem] items-center justify-center rounded bg-[var(--color-primary)] text-xs text-white font-medium">
                        {amendment.year}
                      </span>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {localized(amendment.description)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline preview */}
          {timeline.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>رویدادهای تاریخی</CardTitle>
                  <Link
                    href={`/countries/${countrySlug}/history`}
                    className="text-sm text-[var(--color-primary)] hover:underline"
                  >
                    مشاهده همه
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
