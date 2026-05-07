"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/locale";
import { ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement password reset mutation when backend supports it
    setSubmitted(true);
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("auth.forgot_title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4">
              <p className="text-[var(--color-foreground)]">
                {t("auth.reset_link_sent")}
              </p>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline">{t("auth.back_to_login")}</Button>
              </Link>
            </div>
          ) : (
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
              <Button type="submit" className="w-full">
                {t("auth.send_reset_link")}
              </Button>
            </form>
          )}
          <div className="mt-4 text-center">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm text-[var(--color-muted-foreground)] hover:underline"
            >
              {t("auth.back_to_login_short")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
