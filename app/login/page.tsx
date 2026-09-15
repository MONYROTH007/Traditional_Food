"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { SiteChrome } from "@/components/SiteChrome";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("invalid email or password");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("invalid email or password");
      setLoading(false);
    }
  };

  return (
    <SiteChrome>
      <div className="mx-auto flex w-full max-w-md flex-col justify-center px-5 py-14">
        <div className="rounded-md border border-border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Account
          </p>
          <h1 className="mt-1 font-display text-2xl text-primary sm:text-3xl">
            Log In
          </h1>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Sign in to access traditional recipes and saved collections.
          </p>

          {error && (
            <Alert variant="destructive" className="mt-5 text-xs">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-foreground"
              >
                Email Address
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
                Password
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

            <Button type="submit" disabled={loading} className="w-full mt-2">
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
