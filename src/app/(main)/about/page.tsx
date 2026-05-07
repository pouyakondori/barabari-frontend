"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/locale";

export default function AboutPage() {
  const { t, tArray } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-6">{t("about.title")}</h1>

      <Card>
        <CardContent className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
              {t("about.mission_title")}
            </h2>
            <p className="text-[var(--color-foreground)] leading-relaxed">
              {t("about.mission_text")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
              {t("about.goal_title")}
            </h2>
            <p className="text-[var(--color-foreground)] leading-relaxed">
              {t("about.goal_text")}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
              {t("about.architecture_title")}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-foreground)]">
              {tArray("about.architecture_items").map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
