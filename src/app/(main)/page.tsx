"use client";

import { useQuery } from "@apollo/client/react";
import { GET_FEATURED_COUNTRIES } from "@/graphql/queries/countries";
import { GET_PLATFORM_STATS } from "@/graphql/queries/stats";
import { GET_TOPICS } from "@/graphql/queries/topics";
import { CountryCard } from "@/components/country/CountryCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatNumber, localized } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { Globe, BookOpen, ThumbsUp, MessageCircle, ArrowLeft } from "lucide-react";
import type { Country, PlatformStats, Topic } from "@/lib/types";

export default function HomePage() {
  const { t, locale } = useTranslation();
  const { data: countriesData, loading: countriesLoading } = useQuery<{ featuredCountries: Country[] }>(GET_FEATURED_COUNTRIES);
  const { data: statsData } = useQuery<{ platformStats: PlatformStats }>(GET_PLATFORM_STATS);
  const { data: topicsData } = useQuery<{ topics: { items: Topic[] } }>(GET_TOPICS);

  const countries = countriesData?.featuredCountries || [];
  const stats = statsData?.platformStats;
  const topics = topicsData?.topics?.items || [];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t("home.hero_title")}
          </h1>
          <p className="mt-6 text-lg text-blue-100 max-w-2xl mx-auto">
            {t("home.hero_subtitle")}
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href={ROUTES.COUNTRIES}>
              <Button size="lg" className="bg-white text-[var(--color-primary)] hover:bg-blue-50">
                {t("home.explore_countries")}
                <ArrowLeft className="ms-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href={ROUTES.TOPICS}>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                {t("home.topics_btn")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {stats && (
        <section className="py-12 bg-[var(--color-muted)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { icon: Globe, value: stats.totalCountries, label: t("home.stats_countries") },
                { icon: BookOpen, value: stats.totalClauses, label: t("home.stats_clauses") },
                { icon: ThumbsUp, value: stats.totalVotes, label: t("home.stats_votes") },
                { icon: MessageCircle, value: stats.totalComments, label: t("home.stats_comments") },
              ].map(({ icon: Icon, value, label }) => (
                <Card key={label} className="text-center">
                  <CardContent className="p-6">
                    <Icon className="mx-auto h-8 w-8 text-[var(--color-primary)] mb-2" />
                    <p className="text-3xl font-bold text-[var(--color-foreground)]">
                      {formatNumber(value, locale)}
                    </p>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Countries */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[var(--color-foreground)]">{t("home.featured_countries")}</h2>
            <p className="mt-2 text-[var(--color-muted-foreground)]">
              {t("home.featured_countries_desc")}
            </p>
          </div>
          {countriesLoading ? (
            <div className="text-center text-[var(--color-muted-foreground)]">{t("common.loading")}</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {countries.map((country: Country) => (
                <CountryCard key={country.id} country={country} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Topics Preview */}
      {topics.length > 0 && (
        <section className="py-16 bg-[var(--color-muted)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-[var(--color-foreground)]">{t("home.featured_topics")}</h2>
              <p className="mt-2 text-[var(--color-muted-foreground)]">
                {t("home.featured_topics_desc")}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((topic: Topic) => (
                <Link key={topic.id} href={`/topics/${topic.slug}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-[var(--color-foreground)]">
                        {localized(topic.name, locale)}
                      </h3>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                        {localized(topic.description, locale)}
                      </p>
                      <span className="mt-2 inline-block text-xs text-[var(--color-primary)]">
                        {topic.category}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
