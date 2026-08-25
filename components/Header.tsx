"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/#about", label: "About" },
  { href: "/contact", label: "Contact" }
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false; // anchor links never "active"
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur text-paper border-b border-turmeric/20">
      <div className="max-w-content mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-display italic text-xl md:text-2xl text-turmeric">
            Battambang
          </span>
          <span className="font-mono-tag text-[11px] tracking-widest uppercase text-paper/70 group-hover:text-turmeric transition-colors">
            Table
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono-tag text-[12px] tracking-widest uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative py-1 transition-colors ${
                isActive(link.href) ? "text-turmeric" : "text-paper/80 hover:text-turmeric"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-turmeric" />
              )}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex flex-col gap-1.5 w-8 h-8 items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-turmeric rounded"
        >
          <span className={`block h-[2px] w-5 bg-paper transition-transform ${open ? "translate-y-[6px] rotate-45" : ""}`} />
          <span className={`block h-[2px] w-5 bg-paper transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
          <span className={`block h-[2px] w-5 bg-paper transition-transform ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <nav className="md:hidden px-5 pb-5 flex flex-col gap-4 font-mono-tag text-sm tracking-widest uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={isActive(link.href) ? "text-turmeric" : "hover:text-turmeric"}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}