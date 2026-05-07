"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/locale";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-6">{t("terms.title")}</h1>
      <Card>
        <CardContent className="p-8 prose prose-lg max-w-none">
          <p className="text-[var(--color-foreground)] leading-relaxed">
            {t("terms.intro")}
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mt-6 mb-3">
            {t("terms.responsible_title")}
          </h2>
          <p className="text-[var(--color-foreground)] leading-relaxed">
            {t("terms.responsible_text")}
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mt-6 mb-3">
            {t("terms.content_title")}
          </h2>
          <p className="text-[var(--color-foreground)] leading-relaxed">
            {t("terms.content_text")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
