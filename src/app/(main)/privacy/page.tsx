import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-[var(--color-foreground)] mb-6">حریم خصوصی</h1>
      <Card>
        <CardContent className="p-8 prose prose-lg max-w-none">
          <p className="text-[var(--color-foreground)] leading-relaxed">
            حریم خصوصی کاربران برای ما اهمیت بسیاری دارد. این صفحه توضیح می‌دهد که چه اطلاعاتی
            جمع‌آوری می‌کنیم و چگونه از آن‌ها استفاده می‌کنیم.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mt-6 mb-3">
            اطلاعات جمع‌آوری شده
          </h2>
          <p className="text-[var(--color-foreground)] leading-relaxed">
            ما تنها اطلاعاتی را جمع‌آوری می‌کنیم که برای ارائه خدمات بهتر ضروری است، شامل
            آدرس ایمیل و نام نمایشی در هنگام ثبت‌نام.
          </p>
          <h2 className="text-xl font-semibold text-[var(--color-foreground)] mt-6 mb-3">
            استفاده از اطلاعات
          </h2>
          <p className="text-[var(--color-foreground)] leading-relaxed">
            اطلاعات شما تنها برای ارائه خدمات پلتفرم استفاده می‌شود و با هیچ شخص ثالثی
            به اشتراک گذاشته نمی‌شود.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
