"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";

export default function PodcastsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">پادکست‌ها</h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        پادکست‌های تحلیلی درباره قوانین اساسی کشورهای مختلف
      </p>

      <Card>
        <CardContent className="p-12 text-center">
          <Headphones className="mx-auto h-16 w-16 text-[var(--color-muted-foreground)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">به زودی</h2>
          <p className="text-[var(--color-muted-foreground)]">
            پادکست‌های تحلیلی برابری به زودی منتشر خواهند شد.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
