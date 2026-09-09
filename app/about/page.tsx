import type { Metadata } from "next";

import { SiteChrome } from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why we collect the old Khmer recipes of Battambang province and how each dish was recorded.",
  openGraph: {
    title: "About — Traditional Khmer Recipes",
    description: "How the old Khmer recipes of Battambang province were collected.",
  },
};

export default function AboutPage() {
  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-2xl px-5 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">About</p>
        <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">Kept in the family</h1>
        <div className="mt-6 space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            Battambang has fed Cambodia for generations. Its rice fields, its river and its old
            shophouse streets all leave a mark on the cooking: sour soups thickened with toasted
            rice, coconut steamed in banana leaf, sticky rice roasted inside bamboo.
          </p>
          <p>
            These pages hold nine of those dishes. Each one was written down the way it was
            explained to us at the table — by measure of hand, not of cup — then tested until it
            tasted the way it was remembered.
          </p>
          <p>
            Nothing here is modernised. The lemongrass paste is pounded, the charcoal is real, and
            the prahok is not left out.
          </p>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <p className="font-display text-lg text-accent">ម្ហូបខ្មែរបុរាណ</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Old Khmer food
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
