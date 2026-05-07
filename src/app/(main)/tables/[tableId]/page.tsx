"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_TOPIC } from "@/graphql/queries/topics";
import { GET_COUNTRIES } from "@/graphql/queries/countries";
import { GET_CONSTITUTION } from "@/graphql/queries/constitution";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { localized } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Topic, Country, Clause, Constitution } from "@/lib/types";

export default function ComparisonTablePage() {
  const params = useParams();
  const tableId = params.tableId as string;

  const { data: topicData } = useQuery<{ topic: Topic }>(GET_TOPIC, { variables: { slug: tableId } });
  const { data: countriesData } = useQuery<{ countries: Country[] }>(GET_COUNTRIES);

  const topic = topicData?.topic;
  const countries = countriesData?.countries || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/tables"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-6"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به جداول
      </Link>

      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
        {topic ? localized(topic.name) : "جدول مقایسه‌ای"}
      </h1>
      {topic && (
        <p className="text-[var(--color-muted-foreground)] mb-8">
          {localized(topic.description)}
        </p>
      )}

      {/* Ranked clauses table */}
      <Card>
        <CardHeader>
          <CardTitle>بندهای محبوب</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {countries.map((country: Country) => (
              <CountryClauseList key={country.id} country={country} topicSlug={tableId} />
            ))}
            {countries.length === 0 && (
              <p className="text-sm text-[var(--color-muted-foreground)]">در حال بارگذاری...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function CountryClauseList({ country, topicSlug }: { country: Country; topicSlug: string }) {
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

  // Sort by popularity (agree count descending)
  const sorted = matchingClauses.sort((a, b) => b.agreeCount - a.agreeCount);

  if (sorted.length === 0) return null;

  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold text-[var(--color-foreground)] mb-3">
        <span className="text-xl">{country.flag}</span>
        {localized(country.name)}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)]">
              <th className="pb-2 text-start font-medium text-[var(--color-muted-foreground)]">بند</th>
              <th className="pb-2 text-start font-medium text-[var(--color-muted-foreground)]">متن</th>
              <th className="pb-2 text-center font-medium text-[var(--color-muted-foreground)]">👍</th>
              <th className="pb-2 text-center font-medium text-[var(--color-muted-foreground)]">👎</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((clause: Clause) => (
              <tr key={clause.id} className="border-b border-[var(--color-border)] last:border-0">
                <td className="py-3 pe-3 text-[var(--color-primary)] font-medium whitespace-nowrap">
                  بند {clause.number}
                </td>
                <td className="py-3">
                  <Link
                    href={`/countries/${country.slug}/constitution/clause/${clause.id}`}
                    className="text-[var(--color-foreground)] hover:text-[var(--color-primary)] line-clamp-2"
                  >
                    {localized(clause.text)}
                  </Link>
                </td>
                <td className="py-3 text-center text-green-600 font-medium">{clause.agreeCount}</td>
                <td className="py-3 text-center text-red-600 font-medium">{clause.disagreeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
