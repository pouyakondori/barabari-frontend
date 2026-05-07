"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wand2 } from "lucide-react";

export default function SandboxPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-2">آزمایشگاه قانون اساسی</h1>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        قانون اساسی ایده‌آل خود را با انتخاب بندهای مختلف از کشورهای مختلف بسازید
      </p>

      <Card>
        <CardContent className="p-12 text-center">
          <Wand2 className="mx-auto h-16 w-16 text-[var(--color-muted-foreground)] mb-4" />
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">به زودی</h2>
          <p className="text-[var(--color-muted-foreground)]">
            ابزار ساخت قانون اساسی به زودی در دسترس خواهد بود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
