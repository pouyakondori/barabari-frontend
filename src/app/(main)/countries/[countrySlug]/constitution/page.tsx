"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_COUNTRY } from "@/graphql/queries/countries";
import { GET_CONSTITUTION } from "@/graphql/queries/constitution";
import { Card, CardContent } from "@/components/ui/card";
import { localized, localizeNumber } from "@/lib/utils";
import { useTranslation } from "@/locale";
import Link from "next/link";
import { ArrowRight, BookOpen, ThumbsUp, ThumbsDown } from "lucide-react";
import type { Country, Constitution, Chapter, Article, Clause } from "@/lib/types";

export default function ConstitutionPage() {
  const params = useParams();
  const countrySlug = params.countrySlug as string;
  const { t, locale } = useTranslation();

  const { data: countryData } = useQuery<{ country: Country }>(GET_COUNTRY, { variables: { slug: countrySlug } });
  const { data: constitutionData, loading } = useQuery<{ constitution: Constitution }>(GET_CONSTITUTION, {
    variables: { countrySlug },
  });

  const country = countryData?.country;
  const constitution = constitutionData?.constitution;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href={`/countries/${countrySlug}`}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline mb-6"
      >
        <ArrowRight className="h-4 w-4" />
        {`${t("countries.back_to")} ${country ? localized(country.name, locale) : t("countries.fallback_country")}`}
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="h-8 w-8 text-[var(--color-primary)]" />
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-foreground)]">
            {`${t("constitution.title")} ${country ? localized(country.name, locale) : ""}`}
          </h1>
          <p className="text-[var(--color-muted-foreground)]">{t("countries.full_text_short")}</p>
        </div>
      </div>

      {!constitution ? (
        <p className="text-[var(--color-muted-foreground)]">{t("constitution.not_found")}</p>
      ) : (
        <div className="space-y-8">
          {constitution.chapters
            .slice()
            .sort((a: Chapter, b: Chapter) => a.order - b.order)
            .map((chapter: Chapter) => (
              <Card key={chapter.id}>
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-4 pb-2 border-b border-[var(--color-border)]">
                    {t("countries.chapter")} {chapter.number}: {localized(chapter.title, locale)}
                  </h2>

                  <div className="space-y-6">
                    {chapter.articles
                      .slice()
                      .sort((a: Article, b: Article) => a.order - b.order)
                      .map((article: Article) => (
                        <div key={article.id}>
                          {article.title && (
                            <h3 className="font-semibold text-[var(--color-foreground)] mb-3">
                              {t("countries.article")} {article.number}: {localized(article.title, locale)}
                            </h3>
                          )}

                          <div className="space-y-2 ps-4 border-s-2 border-[var(--color-border)]">
                            {article.clauses
                              .slice()
                              .sort((a: Clause, b: Clause) => a.order - b.order)
                              .map((clause: Clause) => (
                                <Link
                                  key={clause.id}
                                  href={`/countries/${countrySlug}/constitution/clause/${clause.id}`}
                                  className="block p-3 rounded-lg hover:bg-[var(--color-muted)] transition-colors group"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium text-[var(--color-primary)] shrink-0">
                                      {t("countries.clause")} {clause.number}:
                                    </span>
                                    <p className="text-sm text-[var(--color-foreground)] leading-relaxed group-hover:text-[var(--color-primary)]">
                                      {localized(clause.text, locale)}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--color-muted-foreground)]">
                                    <span><ThumbsUp className="inline h-3.5 w-3.5 me-1" />{localizeNumber(clause.agreeCount, locale)}</span>
                                    <span><ThumbsDown className="inline h-3.5 w-3.5 me-1" />{localizeNumber(clause.disagreeCount, locale)}</span>
                                  </div>
                                </Link>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
