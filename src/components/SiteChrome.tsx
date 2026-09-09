"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

const links = [
  { href: "/", label: "Home", exact: true },
  { href: "/recipes", label: "Recipes", exact: false },
  { href: "/about", label: "About", exact: false },
  { href: "/contact", label: "Contact", exact: false },
] as const;

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteChrome({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5">
          <Link href="/" className="leading-tight" onClick={() => setOpen(false)}>
            <span className="block font-display text-xl tracking-wide text-primary sm:text-2xl">
              Traditional Khmer Recipes
            </span>
            <span className="block text-[0.7rem] uppercase tracking-[0.3em] text-muted-foreground">
              Battambang Province
            </span>
          </Link>

          <nav className="hidden gap-7 sm:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm uppercase tracking-[0.18em] transition-colors hover:text-primary ${
                  isActive(pathname, l.href, l.exact) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
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
                  isActive(pathname, l.href, l.exact) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <div className="h-1 w-full bg-khmer-band" />

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto w-full max-w-5xl px-5 py-8 text-center text-sm text-muted-foreground">
          <p className="font-display text-base text-primary">សូមអញ្ជើញពិសា</p>
          <p className="mt-2">Recipes kept by families of Battambang province, Cambodia.</p>
        </div>
      </footer>
    </div>
  );
}
