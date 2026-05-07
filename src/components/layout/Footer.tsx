import Link from "next/link";
import { ROUTES } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-[var(--color-primary)]">
              برابری
            </h3>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              پلتفرم تحلیل و مقایسه قوانین اساسی جهان
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-[var(--color-foreground)]">
              لینک‌ها
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={ROUTES.COUNTRIES}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  کشورها
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.TOPICS}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  موضوعات
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.TABLES}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  جداول مقایسه‌ای
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.ABOUT}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  درباره ما
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-[var(--color-foreground)]">
              حقوقی
            </h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href={ROUTES.PRIVACY}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  حریم خصوصی
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.TERMS}
                  className="text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                >
                  شرایط استفاده
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-[var(--color-border)] pt-8 text-center">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            © ۲۰۲۶ برابری. تمامی حقوق محفوظ است.
          </p>
        </div>
      </div>
    </footer>
  );
}
