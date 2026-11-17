"use client";

import { useEffect } from "react";

import { reportLovableError } from "@/lib/lovable-error-reporting";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    reportLovableError(error, { boundary: "next_error_boundary" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        {/* Error boundary: this can render when the language context itself
            failed, so it stays bilingual instead of calling useLanguage. */}
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          ទំព័រនេះមិនអាចផ្ទុកបានទេ (This page didn&apos;t load)
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          មានបញ្ហាបច្ចេកទេសកើតឡើង។ សូមព្យាយាមផ្ទុកឡើងវិញ ឬត្រឡប់ទៅទំព័រដើម។
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back
          home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            ព្យាយាមម្តងទៀត (Try again)
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            ត្រឡប់ទៅទំព័រដើម (Go home)
          </a>
        </div>
      </div>
    </div>
  );
}
