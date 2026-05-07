import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-6">شرایط استفاده</h1>
      <Card>
        <CardContent className="p-8 prose prose-lg max-w-none">
          <p className="text-[var(--color-foreground)] leading-relaxed">
            با استفاده از پلتفرم برابری، شما شرایط زیر را می‌پذیرید.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mt-6 mb-3">
            استفاده مسئولانه
          </h2>
          <p className="text-[var(--color-foreground)] leading-relaxed">
            کاربران موظف هستند از پلتفرم به صورت مسئولانه استفاده کنند. نظرات باید محترمانه
            و سازنده باشند. تمام نظرات قبل از انتشار توسط مدیر بررسی و تأیید می‌شوند.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mt-6 mb-3">
            محتوای کاربران
          </h2>
          <p className="text-[var(--color-foreground)] leading-relaxed">
            با ارسال نظر یا رأی، شما مسئولیت محتوای ارسالی خود را بر عهده می‌گیرید.
            برابری حق حذف محتوای نامناسب را برای خود محفوظ می‌دارد.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
