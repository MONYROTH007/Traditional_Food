import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { recipes, getRecipeBySlug } from "@/lib/recipes";
import IngredientChecklist from "@/components/IngredientChecklist";
import Reveal from "@/components/Reveal";
import RecipeCard from "@/components/RecipeCard";
import BackButton from "@/components/backbutton";

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({
  params
}: {
  params: { slug: string };
}): Metadata {
  const recipe = getRecipeBySlug(params.slug);
  if (!recipe) return {};
  return {
    title: `${recipe.name} (${recipe.khmer}) — Battambang Table`,
    description: recipe.tagline
  };
}

export default function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = getRecipeBySlug(params.slug);
  if (!recipe) notFound();

  const others = recipes.filter((r) => r.slug !== recipe.slug).slice(0, 2);

  return (
    <>
      {/* Hero image */}
      <section className="relative bg-ink text-paper">
        <div className="relative h-[52vh] md:h-[64vh] min-h-[360px] overflow-hidden">
          {recipe.image ? (
            <img
              src={recipe.image}
              alt={`${recipe.name}, a traditional dish from Battambang province`}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-ink via-ink-soft to-leaf/40 texture-grain flex items-center justify-center">
              <span className="font-mono-tag text-paper/40 text-xs tracking-widest uppercase">
                Photo coming soon
              </span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/10" />

          <div className="absolute inset-x-0 bottom-0">
            <div className="max-w-content mx-auto px-5 md:px-8 pb-10 md:pb-14">
              <BackButton
                fallbackHref="/recipes"
                label="All dishes"
                className="mb-6"
              />
              <p className="font-mono-tag text-[11px] tracking-widest uppercase text-turmeric mb-3">
                {recipe.category} · {recipe.pronunciation}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.02]">
                {recipe.name}
              </h1>
              <p className="font-display italic text-2xl md:text-3xl text-paper/70 mt-1">
                {recipe.khmer}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story + ingredients */}
      <section className="bg-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 py-14 md:py-20 grid gap-14 md:grid-cols-[1.15fr_0.85fr]">
          <div>
            <Reveal>
              <p className="font-display italic text-xl md:text-2xl text-clay mb-8 max-w-lg leading-snug">
                {recipe.tagline}
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="font-mono-tag text-[11px] tracking-widest uppercase text-umber/50 mb-4">
                As it&apos;s told
              </p>
            </Reveal>

            <div className="space-y-5 max-w-xl">
              {recipe.story.map((paragraph, i) => (
                <Reveal key={i} delay={100 + i * 90}>
                  <p className="text-umber/85 leading-relaxed text-[15px] md:text-base">
                    {paragraph}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal delay={100 + recipe.story.length * 90}>
              <div className="mt-10 border-t border-umber/15 pt-8">
                <p className="font-mono-tag text-[11px] tracking-widest uppercase text-umber/50 mb-4">
                  Served as
                </p>
                <p className="text-umber/85 text-[15px]">{recipe.servedAs}</p>
              </div>
            </Reveal>

            <Reveal delay={140 + recipe.story.length * 90}>
              <div className="mt-8">
                <p className="font-mono-tag text-[11px] tracking-widest uppercase text-umber/50 mb-4">
                  To serve
                </p>
                <ul className="space-y-2.5 max-w-xl">
                  {recipe.toServe.map((step, i) => (
                    <li key={i} className="flex gap-3 text-umber/85 text-[15px] leading-relaxed">
                      <span className="font-mono-tag text-clay flex-shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Ingredients card */}
          <Reveal delay={60}>
            <div className="bg-paper-deep/60 border border-umber/10 rounded-sm p-6 md:p-8 md:sticky md:top-24">
              <IngredientChecklist groups={recipe.ingredients} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* More dishes */}
      <section className="bg-ink">
        <div className="max-w-content mx-auto px-5 md:px-8 py-16 md:py-20">
          <p className="font-mono-tag text-[11px] tracking-widest uppercase text-turmeric mb-8">
            More from the table
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {others.map((r, i) => (
              <RecipeCard key={r.slug} recipe={r} rotate={i % 2 === 0 ? "-rotate-2" : "rotate-2"} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
