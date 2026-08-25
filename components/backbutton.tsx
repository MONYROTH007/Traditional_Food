"use client";

import { useRouter } from "next/navigation";

export default function BackButton({
  fallbackHref = "/recipes",
  label = "Back",
  className = ""
}: {
  fallbackHref?: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();

  const handleBack = () => {
    // If there's history to go back to (user navigated within the site),
    // use it. Otherwise fall back to a sensible default page.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackHref);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`group font-mono-tag text-[11px] tracking-widest uppercase text-paper/70 hover:text-turmeric inline-flex items-center gap-2 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-turmeric rounded-sm ${className}`}
    >
      <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">
        ←
      </span>
      {label}
    </button>
  );
}