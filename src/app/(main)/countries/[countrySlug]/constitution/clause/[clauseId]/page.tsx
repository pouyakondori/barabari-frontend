"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_CLAUSE } from "@/graphql/queries/constitution";
import { GET_COUNTRY } from "@/graphql/queries/countries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VoteButtons } from "@/components/votes/VoteButtons";
import { CommentThread } from "@/components/comments/CommentThread";
import { localized } from "@/lib/utils";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Clause, Country } from "@/lib/types";

export default function ClauseDetailPage() {
  const params = useParams();
  const clauseId = params.clauseId as string;
  const countrySlug = params.countrySlug as string;

  const { data: clauseData, loading: clauseLoading } = useQuery<{ clause: Clause }>(GET_CLAUSE, {
    variables: { id: clauseId },
  });
  const { data: countryData } = useQuery<{ country: Country }>(GET_COUNTRY, {
    variables: { slug: countrySlug },
  });

  const clause = clauseData?.clause;
  const country = countryData?.country;

  if (clauseLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">در حال بارگذاری...</p>
      </div>
    );
  }

  if (!clause) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">بند مورد نظر یافت نشد</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/countries/${countrySlug}/constitution`}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-6"
      >
        <ArrowRight className="h-4 w-4" />
        بازگشت به قانون اساسی {country ? localized(country.name) : ""}
      </Link>

      {/* Clause content */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>بند {clause.number}</CardTitle>
            <div className="flex gap-1">
              {clause.topicSlugs.map((slug: string) => (
                <Link key={slug} href={`/topics/${slug}`}>
                  <Badge variant="outline" className="cursor-pointer hover:bg-[var(--color-muted)]">
                    {slug}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Persian text */}
          <div className="p-4 rounded-lg bg-[var(--color-muted)] mb-4">
            <p className="text-lg leading-loose text-[var(--color-foreground)]">
              {clause.text.fa}
            </p>
          </div>

          {/* English text */}
          <div className="p-4 rounded-lg border border-[var(--color-border)]" dir="ltr">
            <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)] font-sans">
              {clause.text.en}
            </p>
          </div>

          {/* Voting */}
          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <VoteButtons
              clauseId={clause.id}
              agreeCount={clause.agreeCount}
              disagreeCount={clause.disagreeCount}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <Card>
        <CardContent className="p-6">
          <CommentThread clauseId={clause.id} />
        </CardContent>
      </Card>
    </div>
  );
}
