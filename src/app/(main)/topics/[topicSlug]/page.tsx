"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_TOPIC } from "@/graphql/queries/topics";
import { GET_CONSTITUTION } from "@/graphql/queries/constitution";
import { GET_COUNTRIES } from "@/graphql/queries/countries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { localized, localizeNumber } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Topic, Country, Clause, Constitution } from "@/lib/types";

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

      {/* Country comparison cards - each shows clauses matching this topic */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {countries.map((country: Country) => (
          <CountryTopicCard key={country.id} country={country} topicSlug={topicSlug} />
        ))}
      </div>
    </div>
  );
}

function CountryTopicCard({ country, topicSlug }: { country: Country; topicSlug: string }) {
  const { t, locale } = useTranslation();
  const { data } = useQuery<{ constitution: Constitution }>(GET_CONSTITUTION, {
    variables: { countrySlug: country.slug },
  });

  const constitution = data?.constitution;
  const matchingClauses: Clause[] = [];

  if (constitution) {
    for (const chapter of constitution.chapters) {
      for (const article of chapter.articles) {
        for (const clause of article.clauses) {
          if (clause.topicSlugs.includes(topicSlug)) {
            matchingClauses.push(clause);
          }
        }
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">{country.flag}</span>
          {localized(country.name, locale)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {matchingClauses.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {t("topics.no_clauses")}
          </p>
        ) : (
          <div className="space-y-3">
            {matchingClauses.map((clause: Clause) => (
              <Link
                key={clause.id}
                href={`/countries/${country.slug}/constitution/clause/${clause.id}`}
                className="block p-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-muted)] transition-colors"
              >
                <p className="text-sm text-[var(--color-foreground)] line-clamp-3">
                  {localized(clause.text, locale)}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--color-muted-foreground)]">
                  <span><ThumbsUp className="inline h-3.5 w-3.5 me-1" />{localizeNumber(clause.agreeCount, locale)}</span>
                  <span><ThumbsDown className="inline h-3.5 w-3.5 me-1" />{localizeNumber(clause.disagreeCount, locale)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
