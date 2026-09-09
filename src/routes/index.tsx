import { createFileRoute, Link } from "@tanstack/react-router";

import hero from "@/assets/hero-battambang.jpg";
import { RecipeCard } from "@/components/RecipeCard";
import { SiteChrome } from "@/components/SiteChrome";
import { recipes } from "@/data/recipes";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Traditional Khmer Recipes of Battambang" },
      {
        name: "description",
        content:
          "Nine traditional Khmer recipes kept by families of Battambang province, Cambodia — kralan, amok trey, samlor korko and more.",
      },
      { property: "og:title", content: "Traditional Khmer Recipes of Battambang" },
      {
        property: "og:description",
        content: "Nine old Khmer dishes from the villages and markets of Battambang province.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <SiteChrome>
      <section className="relative">
        <img
          src={hero}
          alt="Golden hour over old shophouses and rice fields in Battambang, Cambodia"
          width={1600}
          height={900}
          className="h-[60vh] min-h-72 w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-veil" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-5xl px-5">
            <p className="font-display text-base text-accent">ម្ហូបខ្មែរបុរាណ</p>
            <h1 className="mt-2 max-w-xl font-display text-3xl leading-tight text-primary-foreground sm:text-5xl">
              Traditional Khmer Recipes
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-primary-foreground/85">
              Nine dishes from Battambang province, written the way they were taught at the table.
            </p>
            <Link
              to="/recipes"
              className="mt-7 inline-block rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.25em] text-primary-foreground"
            >
              See the recipes
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-14">
        <div className="flex items-end justify-between border-b border-border pb-4">
          <h2 className="font-display text-2xl text-primary">Begin with three</h2>
          <Link
            to="/recipes"
            className="text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary"
          >
            All nine
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.slice(0, 3).map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
