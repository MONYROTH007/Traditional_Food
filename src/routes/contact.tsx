import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { SiteChrome } from "@/components/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Traditional Khmer Recipes" },
      {
        name: "description",
        content:
          "Share a family Khmer recipe from Battambang province or ask a question about the dishes on this site.",
      },
      { property: "og:title", content: "Contact — Traditional Khmer Recipes" },
      {
        property: "og:description",
        content: "Share a family recipe from Battambang or ask about a dish.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-xl px-5 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Contact</p>
        <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">Write to us</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          If your family cooks one of these dishes another way, we would like to hear it.
        </p>

        {sent ? (
          <p className="mt-8 rounded-sm border border-border bg-card p-6 text-sm text-foreground">
            Thank you — your note has been noted. This form is not connected to email yet, so
            nothing was sent anywhere.
          </p>
        ) : (
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Name
              </span>
              <input
                required
                className="mt-2 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </span>
              <input
                type="email"
                required
                className="mt-2 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Your message
              </span>
              <textarea
                rows={5}
                required
                className="mt-2 w-full rounded-sm border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </label>
            <button
              type="submit"
              className="rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground transition-opacity hover:opacity-90"
            >
              Send
            </button>
          </form>
        )}
      </div>
    </SiteChrome>
  );
}
