"use client";

import { Languages } from "lucide-react";

import { useLanguage, type Lang } from "@/lib/i18n";

const OPTIONS: { value: Lang; label: string; aria: string }[] = [
  { value: "km", label: "ខ្មែរ", aria: "ប្តូរទៅភាសាខ្មែរ (Switch to Khmer)" },
  { value: "en", label: "EN", aria: "Switch to English (ប្តូរទៅភាសាអង់គ្លេស)" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-sm border border-border bg-background p-0.5 ${className}`}
      role="group"
      aria-label="Language / ភាសា"
    >
      <Languages
        className="ml-1.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      {OPTIONS.map((opt) => {
        const active = lang === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setLang(opt.value)}
            aria-label={opt.aria}
            aria-pressed={active}
            className={`flex min-h-8 cursor-pointer items-center rounded-sm px-2.5 text-xs whitespace-nowrap transition-colors ${
              active
                ? "bg-primary font-semibold text-primary-foreground"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
