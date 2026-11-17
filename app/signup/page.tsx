"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SiteChrome } from "@/components/SiteChrome";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!fullName.trim()) {
      setError(t("auth.errFullName"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.errPasswordMatch"));
      return;
    }

    if (password.length < 6) {
      setError(t("auth.errPasswordLength"));
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data: signUpData, error: authError } = await supabase.auth.signUp(
        {
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              username: fullName.trim(),
            },
          },
        },
      );

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // If sign up didn't automatically attach a session, sign in directly with credentials
      if (!signUpData?.session) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) {
          setError(signInError.message);
          setLoading(false);
          return;
        }
      }

      setSuccess(t("auth.signupSuccess"));
      setLoading(false);

      setTimeout(() => {
        router.push("/");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("auth.unexpected"));
      setLoading(false);
    }
  };

  return (
    <SiteChrome>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-5 py-14">
        <div className="rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            {t("auth.kicker")}
          </p>
          <h1 className="mt-1 font-display text-2xl text-primary sm:text-3xl">
            {t("auth.signupTitle")}
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {t("auth.signupIntro")}
          </p>

          {error && (
            <Alert variant="destructive" className="mt-5 text-xs">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-5 border-accent/50 bg-accent/10 text-xs text-accent-foreground">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-xs uppercase tracking-wider text-foreground"
              >
                {t("auth.fullName")}
              </Label>
              <Input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t("auth.fullNamePlaceholder")}
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-foreground"
              >
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-foreground"
              >
                {t("auth.password")}
              </Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs uppercase tracking-wider text-foreground"
              >
                {t("auth.confirmPassword")}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border-border bg-background"
              />
            </div>

            <Button type="submit" disabled={loading} className="mt-2 w-full">
              {loading ? t("auth.creating") : t("auth.signupTitle")}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              {t("auth.loginLink")}
            </Link>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
