"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";
import { useTranslation } from "@/locale";

export default function PodcastsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">{t("podcasts.title")}</h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        {t("podcasts.description")}
      </p>

      <Card>
        <CardContent className="p-12 text-center">
          <Headphones className="mx-auto h-16 w-16 text-[var(--color-muted-foreground)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">{t("podcasts.coming_soon")}</h2>
          <p className="text-[var(--color-muted-foreground)]">
            {t("podcasts.coming_soon_desc")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
