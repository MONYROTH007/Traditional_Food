"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Utensils, HeartHandshake, Flame } from "lucide-react";

import hero from "@/assets/num-banh-chok.jpg";
import { RecipeCard } from "@/components/RecipeCard";
import { SiteChrome } from "@/components/SiteChrome";
import type { Recipe } from "@/data/recipes";
import { createClient } from "@/utils/supabase/client";
import { mapEntryToRecipe, type EntryRow } from "@/utils/entries";

export default function HomePage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("status", "published")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching entries for home page:", error);
          setRecipes([]);
        } else if (data) {
          setRecipes(data.map((row: EntryRow) => mapEntryToRecipe(row)));
        }
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  return (
    <SiteChrome>
      <section className="relative">
        <img
          src={hero.src}
          alt="Golden hour over old shophouses and rice fields in Battambang, Cambodia"
          width={1600}
          height={900}
          className="h-[60vh] min-h-72 w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-veil" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-5xl px-5">
            <p className="font-display text-base text-accent">
              ម្ហូបខ្មែរបុរាណ
            </p>
            <h1 className="mt-2 max-w-xl font-display text-3xl leading-tight text-primary-foreground sm:text-5xl">
              Traditional Khmer Recipes
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/85">
              Traditional dishes from Battambang province, written the way they
              were taught at the table.
            </p>
            <Link
              href="/recipes"
              className="mt-7 inline-block rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground"
            >
              See the recipes
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-display text-2xl text-primary">Popular Dishes</h2>
          <Link
            href="/recipes"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            All dishes
          </Link>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-sm border border-border bg-card p-5"
              >
                <div className="h-48 w-full rounded-sm bg-muted" />
                <div className="mt-4 h-4 w-1/3 rounded bg-muted" />
                <div className="mt-2 h-6 w-2/3 rounded bg-muted" />
                <div className="mt-3 h-10 w-full rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : recipes.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 3).map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-center rounded-sm border border-dashed border-border p-12 text-center">
            <Utensils className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-4 font-display text-xl text-primary">
              No entries yet
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No traditional food entries found in the database.
            </p>
          </div>
        )}
      </section>

      {/* Redesigned About Section */}
      <section className="border-t border-border bg-card/30 py-16">
        <div className="mx-auto w-full max-w-5xl px-5">
          <div className="flex flex-col justify-between border-b border-border pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Heritage & Craft
              </p>
              <h2 className="mt-1 font-display text-3xl text-primary sm:text-4xl">
                Kept in the Family
              </h2>
            </div>
            <p className="mt-2 font-display text-xl text-accent sm:mt-0">
              ម្ហូបខ្មែរបុរាណ
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <article className="flex flex-col justify-between rounded-sm border border-border bg-card p-6 shadow-warm transition-shadow hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <p className="font-display text-sm text-accent">
                    ខេត្តបាត់ដំបង
                  </p>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-display text-xl text-primary">
                  The Land & River
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Battambang has fed Cambodia for generations. Its rice fields,
                  its river and its old shophouse streets all leave a mark on
                  the cooking: sour soups thickened with toasted rice, coconut
                  steamed in banana leaf, sticky rice roasted inside bamboo.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Rice Bowl of Cambodia
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-sm border border-border bg-card p-6 shadow-warm transition-shadow hover:shadow-lg">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <p className="font-display text-sm text-accent">
                    រូបមន្តគ្រួសារ
                  </p>
                  <HeartHandshake className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-display text-xl text-primary">
                  Written at the Table
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  These pages hold nine of those dishes. Each one was written
                  down the way it was explained to us at the table — by measure
                  of hand, not of cup — then tested until it tasted the way it
                  was remembered.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Family Handed-Down
              </div>
            </article>

            <article className="flex flex-col justify-between rounded-sm border border-border bg-card p-6 shadow-warm transition-shadow hover:shadow-lg sm:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <p className="font-display text-sm text-accent">រសជាតិដើម</p>
                  <Flame className="h-4 w-4 text-muted-foreground" />
                </div>
                <h3 className="mt-3 font-display text-xl text-primary">
                  Uncompromised Taste
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Nothing here is modernised. The lemongrass paste is pounded,
                  the charcoal is real, and the prahok is not left out. Pure,
                  unadulterated flavor kept intact.
                </p>
              </div>
              <div className="mt-6 border-t border-border pt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                Traditional Methods
              </div>
            </article>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
