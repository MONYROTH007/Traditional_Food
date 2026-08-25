import type { Metadata } from "next";
import RecipeCard from "@/components/RecipeCard";
import Reveal from "@/components/Reveal";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "All Recipes — Battambang Table",
  description:
    "Every traditional Khmer dish on Battambang Table, in one place: Mee Kola, Num Banh Chok, Larp Khmer, Song Vak, and Prahok Ktis."
};

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];

export default function RecipesIndexPage() {
  return (
    <section className="bg-paper">
      <div className="max-w-content mx-auto px-5 md:px-8 pt-14 pb-20 md:pt-20 md:pb-28">
        <Reveal>
          <p className="font-mono-tag text-[11px] tracking-widest uppercase text-clay mb-4">
            Battambang Province
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-umber mb-4">
            All the dishes
          </h1>
          <p className="text-umber/70 max-w-lg leading-relaxed mb-14">
            Five traditional plates, each with its own ingredients and the
            oral history still told alongside it.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
          {recipes.map((recipe, i) => (
            <Reveal key={recipe.slug} delay={i * 80}>
              <RecipeCard recipe={recipe} rotate={rotations[i % rotations.length]} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}