"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { ContactSection } from "@/components/ContactSection";
import { createClient } from "@/utils/supabase/client";

const links = [
  { href: "/", label: "Home", exact: true },
  { href: "/recipes", label: "Recipes", exact: false },
  { href: "/contribute", label: "My Recipes", exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
  };

  const fullName = user?.user_metadata?.["full_name"] || user?.user_metadata?.["username"];

  const displayName = fullName
    ? (fullName as string)
    : user?.email?.split("@")[0] || user?.email;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
          <Link
            href="/"
            className="leading-tight"
            onClick={() => setOpen(false)}
          >
            <span className="block font-display text-xl tracking-wide text-primary sm:text-2xl">
              Traditional Khmer Recipes
            </span>
            <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              Battambang Province
            </span>
          </Link>

          <nav className="hidden items-center gap-7 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm uppercase tracking-[0.18em] transition-colors hover:text-primary ${
                  isActive(pathname, l.href, l.exact)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="h-4 w-px bg-border" />

            {user ? (
              <div className="flex items-center gap-4">
                <span className="max-w-[160px] truncate text-xs font-semibold text-primary">
                  {displayName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer text-sm uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link
                  href="/login"
                  className={`text-sm uppercase tracking-[0.18em] transition-colors hover:text-primary ${
                    isActive(pathname, "/login", false)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={`text-sm uppercase tracking-[0.18em] transition-colors hover:text-primary ${
                    isActive(pathname, "/signup", false)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-sm border border-border px-3 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:hidden"
          >
            Menu
          </button>
        </div>

        {open && (
          <nav className="flex flex-col border-t border-border sm:hidden">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`border-b border-border px-5 py-3 text-sm uppercase tracking-[0.18em] ${
                  isActive(pathname, l.href, l.exact)
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            {user ? (
              <>
                <div className="border-b border-border px-5 py-3 text-xs font-semibold text-primary">
                  {displayName}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="border-b border-border px-5 py-3 text-left text-sm uppercase tracking-[0.18em] text-muted-foreground hover:text-primary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className={`border-b border-border px-5 py-3 text-sm uppercase tracking-[0.18em] ${
                    isActive(pathname, "/login", false)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className={`border-b border-border px-5 py-3 text-sm uppercase tracking-[0.18em] ${
                    isActive(pathname, "/signup", false)
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </header>

      <div className="h-1 w-full bg-khmer-band" />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <ContactSection />
        <div className="border-t border-border mx-auto w-full max-w-5xl px-5 py-8 text-center text-sm text-muted-foreground">
          <p className="font-display text-base text-primary">សូមអញ្ជើញពិសា</p>
          <p className="mt-2">
            Recipes kept by families of Battambang province, Cambodia.
          </p>
        </div>
      </footer>
    </div>
  );
}
