"use client";

import { useQuery } from "@apollo/client/react";
import { Headphones, Calendar, Clock, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/locale";
import { GET_PODCASTS } from "@/graphql/queries/podcasts";
import type { Podcast } from "@/lib/types";
import PodcastPlayer from "@/components/podcast/PodcastPlayer";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PodcastsPage() {
  const { t, locale } = useTranslation();
  const { data, loading } = useQuery<{ podcasts: Podcast[] }>(GET_PODCASTS, {
    variables: { limit: 50 },
  });

  const podcasts = data?.podcasts ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2 flex items-center gap-3">
          <Headphones className="h-8 w-8 text-[var(--color-primary)]" />
          {t("podcasts.title")}
        </h1>
        <p className="text-[var(--color-muted-foreground)]">
          {t("podcasts.description")}
        </p>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
        </div>
      )}

      {!loading && podcasts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Headphones className="mx-auto h-16 w-16 text-[var(--color-muted-foreground)] mb-4" />
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
              {t("podcasts.no_podcasts")}
            </h2>
            <p className="text-[var(--color-muted-foreground)]">
              {t("podcasts.no_podcasts_desc")}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {podcasts.map((podcast) => (
          <Card key={podcast.id} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex flex-col gap-3">
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--color-muted-foreground)]">
                  {podcast.country && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3.5 w-3.5" />
                      {podcast.country.name[locale]}
                    </span>
                  )}
                  {podcast.duration > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {formatDuration(podcast.duration)}
                    </span>
                  )}
                  {podcast.publishedAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(podcast.publishedAt).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
                    </span>
                  )}
                </div>

                {/* Player */}
                <PodcastPlayer
                  audioUrl={podcast.audioUrl}
                  title={podcast.title[locale]}
                  description={podcast.description[locale]}
                  duration={podcast.duration}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
