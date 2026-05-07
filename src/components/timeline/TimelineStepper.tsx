import { localized, formatDate } from "@/lib/utils";
import type { TimelineEvent } from "@/lib/types";

interface TimelineStepperProps {
  events: TimelineEvent[];
  locale?: string;
}

export function TimelineStepper({
  events,
  locale = "fa",
}: TimelineStepperProps) {
  const sorted = [...events].sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      {/* Vertical line */}
      <div className="absolute start-4 top-0 bottom-0 w-0.5 bg-[var(--color-border)]" />

      <div className="space-y-8">
        {sorted.map((event) => (
          <div key={event.id} className="relative ps-12">
            {/* Dot */}
            <div className="absolute start-2.5 top-1.5 h-3 w-3 rounded-full border-2 border-[var(--color-primary)] bg-[var(--color-background)]" />

            <div>
              <time className="text-sm font-medium text-[var(--color-primary)]">
                {formatDate(event.date, locale)}
              </time>
              <h4 className="mt-1 font-semibold text-[var(--color-foreground)]">
                {localized(event.title, locale)}
              </h4>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                {localized(event.description, locale)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
