"use client";

import { useParams } from "next/navigation";
import { useQuery, useApolloClient } from "@apollo/client/react";
import { useState, useEffect } from "react";
import { GET_TOPIC } from "@/graphql/queries/topics";
import { GET_CONSTITUTION } from "@/graphql/queries/constitution";
import { GET_COUNTRIES } from "@/graphql/queries/countries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localized, localizeNumber } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { GET_TOPICS } from "@/graphql/queries/topics";
import type { Topic, Country, Clause, Constitution } from "@/lib/types";

interface ClauseWithCountry extends Clause {
  country: Country;
}

export default function TopicPage() {
  const params = useParams();
  const topicSlug = params.topicSlug as string;
  const { t, locale } = useTranslation();

  const { data: topicData, loading: topicLoading } = useQuery<{ topic: Topic }>(GET_TOPIC, {
    variables: { slug: topicSlug },
  });
  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES);

  const topic = topicData?.topic;
  const countries = countriesData?.countries || [];

  if (topicLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">{t("topics.not_found")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/topics"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-6"
      >
        <ArrowRight className="h-4 w-4" />
        {t("topics.back_to_topics")}
      </Link>

      <div className="mb-8">
        <Badge variant="outline" className="mb-2">{t(`categories.${topic.category}`)}</Badge>
        <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
          {localized(topic.name, locale)}
        </h1>
        <p className="mt-2 text-[var(--color-muted-foreground)]">
          {localized(topic.description, locale)}
        </p>
      </div>

      <ClauseLists countries={countries} topicSlug={topicSlug} currentTopic={topic} />
    </div>
  );
}

function ClauseLists({ countries, topicSlug, currentTopic }: { countries: Country[]; topicSlug: string; currentTopic: Topic }) {
  const { t, locale } = useTranslation();
  const client = useApolloClient();

  const { data: topicsData } = useQuery<{ topics: { items: Topic[] } }>(GET_TOPICS);
  const topicMap = new Map<string, Topic>();
  (topicsData?.topics?.items || []).forEach((tp) => topicMap.set(tp.slug, tp));

  const [allClauses, setAllClauses] = useState<ClauseWithCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (countries.length === 0) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAll() {
      const results = await Promise.all(
        countries.map((country) =>
          client.query<{ constitution: Constitution }>({
            query: GET_CONSTITUTION,
            variables: { countrySlug: country.slug },
          })
        )
      );

      if (cancelled) return;

      const clauses: ClauseWithCountry[] = [];
      countries.forEach((country, idx) => {
        const constitution = results[idx]?.data?.constitution;
        if (!constitution) return;
        for (const chapter of constitution.chapters) {
          for (const article of chapter.articles) {
            for (const clause of article.clauses) {
              if (clause.topicSlugs.includes(topicSlug)) {
                clauses.push({ ...clause, country });
              }
            }
          }
        }
      });

      setAllClauses(clauses);
      setLoading(false);
    }

    fetchAll();
    return () => { cancelled = true; };
  }, [countries, topicSlug, client]);

  const mostPopular = [...allClauses].sort((a, b) => b.agreeCount - a.agreeCount).slice(0, 10);
  const mostUnpopular = [...allClauses].sort((a, b) => b.disagreeCount - a.disagreeCount).slice(0, 10);

  if (loading) {
    return (
      <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
    );
  }

  if (allClauses.length === 0) {
    return (
      <p className="text-[var(--color-muted-foreground)]">{t("topics.no_clauses")}</p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Most Popular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <ThumbsUp className="h-5 w-5" />
            {t("topics.most_popular")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostPopular.map((clause, idx) => (
              <ClauseRow key={clause.id} clause={clause} rank={idx + 1} locale={locale} variant="popular" topicMap={topicMap} t={t} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Most Unpopular */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-500">
            <ThumbsDown className="h-5 w-5" />
            {t("topics.most_unpopular")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mostUnpopular.map((clause, idx) => (
              <ClauseRow key={clause.id} clause={clause} rank={idx + 1} locale={locale} variant="unpopular" topicMap={topicMap} t={t} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ClauseRow({
  clause,
  rank,
  locale,
  variant,
  topicMap,
  t,
}: {
  clause: ClauseWithCountry;
  rank: number;
  locale: string;
  variant: "popular" | "unpopular";
  topicMap: Map<string, Topic>;
  t: (key: string) => string;
}) {
  // Collect unique categories for this clause
  const categories = new Set<string>();
  for (const slug of clause.topicSlugs) {
    const tp = topicMap.get(slug);
    if (tp) categories.add(tp.category);
  }

  return (
    <Link
      href={`/countries/${clause.country.slug}/constitution/clause/${clause.id}`}
      className="flex items-start gap-3 p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors"
    >
      <span className="text-sm font-bold text-[var(--color-muted-foreground)] mt-0.5 min-w-[1.5rem]">
        {localizeNumber(rank, locale)}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--color-foreground)] line-clamp-2">
          {localized(clause.text, locale)}
        </p>
        {categories.size > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[...categories].map((cat) => (
              <Badge key={cat} variant="default" className="text-[10px] px-1.5 py-0">
                {t(`categories.${cat}`)}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-muted-foreground)]">
          <span className="flex items-center gap-1">
            <span>{clause.country.flag}</span>
            {localized(clause.country.name, locale)}
          </span>
          <span className={`flex items-center gap-1 ${variant === "popular" ? "text-green-600" : "text-red-500"}`}>
            {variant === "popular" ? (
              <><ThumbsUp className="h-3.5 w-3.5" />{localizeNumber(clause.agreeCount, locale)}</>
            ) : (
              <><ThumbsDown className="h-3.5 w-3.5" />{localizeNumber(clause.disagreeCount, locale)}</>
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}
