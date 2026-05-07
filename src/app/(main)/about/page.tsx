import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-6">درباره برابری</h1>

      <Card>
        <CardContent className="p-8 space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
              مأموریت ما
            </h2>
            <p className="text-[var(--color-foreground)] leading-relaxed">
              در دوران تحول، درک ستون فقرات یک ملت — قانون اساسی آن — دیگر یک کار علمی نیست،
              بلکه یک ضرورت مدنی است. ما با راه‌اندازی یک پلتفرم تحلیلی جامع که به مردم ایران
              اختصاص دارد، شکاف بین پیچیدگی حقوقی و آگاهی عمومی را پر می‌کنیم.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
              هدف ما
            </h2>
            <p className="text-[var(--color-foreground)] leading-relaxed">
              روشن ساختن تأثیر عمیق قانون اساسی بر زندگی روزمره شهروندان. با موشکافی ساختار
              حقوقی فعلی ایران و قرار دادن آن در کنار چارچوب‌های حکومتی متنوع جامعه بین‌المللی،
              آینه‌ای برای تأمل و پنجره‌ای برای الهام فراهم می‌کنیم.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-3">
              معماری آگاهی
            </h2>
            <ul className="list-disc list-inside space-y-2 text-[var(--color-foreground)]">
              <li>تحلیل عمیق: حذف زبان حقوقی پیچیده و آشکار ساختن مکانیسم‌های اصلی</li>
              <li>دیدگاه جهانی: بررسی نحوه برخورد کشورها با آزادی‌های بنیادین</li>
              <li>مقایسه داده‌محور: نقشه‌های حرارتی و رتبه‌بندی محبوبیت</li>
              <li>چشم‌انداز مشارکتی: آزمایشگاه فکری برای مشارکت شهروندان</li>
            </ul>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
