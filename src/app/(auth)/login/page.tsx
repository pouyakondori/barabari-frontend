"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "@/locale";
import { ROUTES } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err?.message || t("auth.login_error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("auth.login_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label={t("auth.email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              dir="ltr"
            />
            <Input
              id="password"
              type="password"
              label={t("auth.password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              dir="ltr"
            />
            {error && <p className="text-sm text-[var(--color-destructive)]">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("auth.logging_in") : t("auth.login_btn")}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-[var(--color-muted-foreground)]">
            <span>{t("auth.no_account")} </span>
            <Link href={ROUTES.SIGNUP} className="text-[var(--color-primary)] hover:underline">
              {t("nav.signup")}
            </Link>
          </div>
          <div className="mt-2 text-center">
            <Link
              href={ROUTES.FORGOT_PASSWORD}
              className="text-sm text-[var(--color-muted-foreground)] hover:underline"
            >
              {t("auth.forgot_password")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
