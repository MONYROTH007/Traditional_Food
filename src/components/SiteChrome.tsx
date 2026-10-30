"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { ContactSection } from "@/components/ContactSection";
import { createClient } from "@/utils/supabase/client";

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isReviewer, setIsReviewer] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const links = [
    { href: "/", label: "Home", exact: true },
    { href: "/recipes", label: "Recipes", exact: false },
    ...(user
      ? [{ href: "/my-entries", label: "My Entries", exact: false }]
      : []),
    ...(isReviewer
      ? [{ href: "/review", label: "Review", exact: false }]
      : []),
    { href: "/contribute", label: "Contribute", exact: false },
  ];

  useEffect(() => {
    const supabase = createClient();

    const checkReviewer = async () => {
      try {
        const { data, error } = await supabase.rpc("is_reviewer");
        setIsReviewer(data === true && !error);
      } catch {
        setIsReviewer(false);
      }
    };

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) {
        checkReviewer();
      } else {
        setIsReviewer(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkReviewer();
      } else {
        setIsReviewer(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setIsReviewer(false);
    router.refresh();
  };

  const fullName = user?.user_metadata?.["full_name"] || user?.user_metadata?.["username"];

  const displayName = fullName
    ? (fullName as string)
    : user?.email?.split("@")[0] || user?.email;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <Link
            href="/"
            className="leading-tight shrink-0"
            onClick={() => setOpen(false)}
          >
            <span className="block font-display text-xl tracking-wide text-primary sm:text-2xl">
              Traditional Khmer Recipes
            </span>
            <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              Battambang Province
            </span>
          </Link>

          <nav className="hidden items-center gap-4 md:gap-5 lg:gap-7 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-xs md:text-sm uppercase tracking-[0.14em] lg:tracking-[0.18em] whitespace-nowrap transition-colors hover:text-primary ${
                  isActive(pathname, l.href, l.exact)
                    ? "text-primary font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}

            <div className="h-4 w-px bg-border shrink-0" />

            {user ? (
              <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                <span className="max-w-[130px] lg:max-w-[170px] truncate text-xs font-semibold text-primary">
                  {displayName}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="cursor-pointer text-xs md:text-sm uppercase tracking-[0.14em] lg:tracking-[0.18em] whitespace-nowrap text-muted-foreground transition-colors hover:text-primary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 lg:gap-6 shrink-0">
                <Link
                  href="/login"
                  className={`text-xs md:text-sm uppercase tracking-[0.14em] lg:tracking-[0.18em] whitespace-nowrap transition-colors hover:text-primary ${
                    isActive(pathname, "/login", false)
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className={`text-xs md:text-sm uppercase tracking-[0.14em] lg:tracking-[0.18em] whitespace-nowrap transition-colors hover:text-primary ${
                    isActive(pathname, "/signup", false)
                      ? "text-primary font-medium"
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
        {pathname === "/" && <ContactSection />}
        <div
          className={`${
            pathname === "/" ? "border-t border-border" : ""
          } mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground`}
        >
          <p className="font-display text-base text-primary">សូមអញ្ជើញពិសា</p>
          <p className="mt-2">
            Recipes kept by families of Battambang province, Cambodia.
          </p>
        </div>
      </footer>
    </div>
  );
}
