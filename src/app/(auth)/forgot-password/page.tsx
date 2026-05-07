"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
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
          <CardTitle className="text-2xl">فراموشی رمز عبور</CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <div className="text-center space-y-4">
              <p className="text-[var(--color-foreground)]">
                اگر حساب کاربری با این ایمیل وجود داشته باشد، لینک بازیابی رمز عبور ارسال خواهد شد.
              </p>
              <Link href={ROUTES.LOGIN}>
                <Button variant="outline">بازگشت به صفحه ورود</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                id="email"
                type="email"
                label="ایمیل"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                dir="ltr"
              />
              <Button type="submit" className="w-full">
                ارسال لینک بازیابی
              </Button>
            </form>
          )}
          <div className="mt-4 text-center">
            <Link
              href={ROUTES.LOGIN}
              className="text-sm text-[var(--color-muted-foreground)] hover:underline"
            >
              بازگشت به ورود
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
