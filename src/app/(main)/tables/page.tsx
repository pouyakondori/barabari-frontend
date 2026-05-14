"use client";

import { useQuery } from "@apollo/client/react";
import { GET_TOPICS } from "@/graphql/queries/topics";
import { Card, CardContent } from "@/components/ui/card";
import { localized } from "@/lib/utils";
import { TOPIC_CATEGORIES } from "@/lib/constants";
import { useTranslation } from "@/locale";
import Link from "next/link";
import type { Topic } from "@/lib/types";

export default function TablesPage() {
  const { t, locale } = useTranslation();
  const { data, loading } = useQuery<{ topics: { items: Topic[] } }>(GET_TOPICS);
  const topics = data?.topics?.items || [];

  // Group by category
  const grouped = TOPIC_CATEGORIES.map((cat) => ({
    ...cat,
    topics: topics.filter((t: Topic) => t.category === cat.slug),
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">
        {t("tables.title")}
      </h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        {t("tables.description")}
      </p>

      {loading ? (
        <p className="text-[var(--color-muted-foreground)]">{t("common.loading")}</p>
      ) : (
        <div className="space-y-8">
          {grouped
            .filter((g) => g.topics.length > 0)
            .map((group) => (
              <div key={group.slug}>
                <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
                  {t(`categories.${group.slug}`)}
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.topics.map((topic: Topic) => (
                    <Link key={topic.id} href={`/tables/${topic.slug}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-[var(--color-foreground)]">
                            {localized(topic.name, locale)}
                          </h3>
                          <p className="mt-1 text-sm text-[var(--color-muted-foreground)] line-clamp-2">
                            {localized(topic.description, locale)}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
