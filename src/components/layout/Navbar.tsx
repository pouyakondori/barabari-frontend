"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Globe } from "lucide-react";
import { ROUTES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/locale";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, locale, toggleLocale } = useTranslation();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: ROUTES.HOME, label: t("nav.home") },
    { href: ROUTES.COUNTRIES, label: t("nav.countries") },
    { href: ROUTES.TOPICS, label: t("nav.topics") },
    { href: ROUTES.TABLES, label: t("nav.tables") },
    { href: ROUTES.PODCASTS, label: t("nav.podcasts") },
    { href: ROUTES.SANDBOX, label: t("nav.sandbox") },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--color-background)]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[var(--color-primary)]">
              {t("site.name")}
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex md:items-center md:gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right section */}
          <div className="flex items-center gap-2">
            {/* Locale toggle */}
            <button
              onClick={toggleLocale}
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-colors"
            >
              <Globe className="h-4 w-4" />
              <span>{t("nav.locale_switch")}</span>
            </button>

            {/* Auth buttons */}
            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-[var(--color-muted-foreground)]">
                  {user.displayName}
                </span>
                <Button variant="ghost" size="sm" onClick={logout}>
                  {t("nav.logout")}
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link href={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href={ROUTES.SIGNUP}>
                  <Button variant="primary" size="sm">
                    {t("nav.signup")}
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden rounded-lg p-2 text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[var(--color-border)]">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-[var(--color-border)]">
              {user ? (
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-start rounded-lg px-3 py-2 text-base font-medium text-[var(--color-destructive)]"
                >
                  {t("nav.logout")}
                </button>
              ) : (
                <div className="space-y-1">
                  <Link
                    href={ROUTES.LOGIN}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="block rounded-lg px-3 py-2 text-base font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]">
                      {t("nav.login")}
                    </span>
                  </Link>
                  <Link
                    href={ROUTES.SIGNUP}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="block rounded-lg px-3 py-2 text-base font-medium text-[var(--color-primary)]">
                      {t("nav.signup")}
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
