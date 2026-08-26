import RecipeCard from "@/components/RecipeCard";
import Reveal from "@/components/Reveal";
import RiverDivider from "@/components/RiverDivider";
import { recipes } from "@/lib/recipes";

const rotations = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "-rotate-2"];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-16 pb-20 md:pt-24 md:pb-28">
          <p className="font-mono-tag text-[11px] md:text-xs tracking-[0.25em] uppercase text-turmeric mb-6">
            Battambang Province · Cambodia
          </p>
          <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl md:text-[4.2rem] md:leading-[1.03] max-w-3xl">
            Traditional Khmer Recipes{" "}
            <span className="italic text-turmeric">based in Battambang province</span>
          </h1>
          <p className="mt-7 max-w-xl text-paper/70 text-base md:text-lg leading-relaxed">
            Along the Sangker River, in the markets and home kitchens of Battambang,
            recipes travel by memory more than by measurement. This is a small,
            plain record of five of them — their ingredients, and the stories
            still told over the pot while they cook.
          </p>
          <a
            href="#dishes"
            className="inline-flex items-center gap-3 mt-10 font-mono-tag text-xs tracking-widest uppercase text-ink bg-turmeric hover:bg-turmeric-deep transition-colors px-6 py-3.5 rounded-sm"
          >
            See the five dishes
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      <RiverDivider />

      {/* Grid */}
      <section id="dishes" className="bg-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 pt-6 pb-20 md:pb-28">
          <Reveal>
            <div className="flex items-end justify-between flex-wrap gap-4 mb-10 md:mb-14">
              <h2 className="font-display text-3xl md:text-4xl text-umber">
                Today's Menu
              </h2>
              <p className="font-mono-tag text-[11px] tracking-widest uppercase text-umber/50">
                 dishes · Battambang
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16 md:gap-y-20">
            {recipes.map((recipe, i) => (
              <Reveal key={recipe.slug} delay={i * 80}>
                <RecipeCard recipe={recipe} rotate={rotations[i % rotations.length]} />
              </Reveal>
            ))}

            {/* 6th cell: intro / context tile, completing the 2x3 grid */}
            <Reveal delay={recipes.length * 80}>
              <div className="h-full min-h-[280px] rounded-sm bg-ink text-paper p-7 md:p-8 flex flex-col justify-between">
                <div>
                  <p className="font-mono-tag text-[10px] tracking-widest uppercase text-turmeric mb-4">
                    About this table
                  </p>
                  <p className="font-display text-xl md:text-2xl leading-snug">
                    Battambang is Cambodia&apos;s rice basket — flat, fertile land
                    between the Sangker River and the Cardamom foothills.
                  </p>
                </div>
                <p className="text-sm text-paper/60 leading-relaxed mt-6">
                  What grows in its fields and swims in its river shows up on
                  every plate here: rice noodles, freshwater fish, and the
                  herb gardens kept behind almost every home.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <RiverDivider flip />

      {/* About */}
      <section id="about" className="bg-ink text-paper">
        <div className="max-w-content mx-auto px-5 md:px-8 py-20 md:py-28 grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              Why these five
            </h2>
            <div className="space-y-5 text-paper/75 leading-relaxed max-w-lg">
              <p>
                Mee Kola and Song Vak rarely leave Battambang without someone
                carrying them out by hand — they are the province&apos;s own,
                more than they belong to Cambodia at large. Num Banh Chok,
                Larp Khmer, and Prahok Ktis are eaten everywhere in the
                country, but the way Battambang makes them still carries the
                province&apos;s particular hand: its rice, its river fish, its
                garden herbs.
              </p>
              <p>
                None of this is written down the way a cookbook would write
                it. It is passed at the stove, at the market stall, over the
                banana leaf being folded for the next batch. This page is an
                attempt to hold onto a little of that — plainly, and without
                dressing it up more than the dishes themselves are dressed.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="market-tag rotate-1 p-6 md:p-8 max-w-sm md:ml-auto">
              <p className="font-mono-tag text-[10px] tracking-widest uppercase text-umber/50 mb-3">
                A note on quantities
              </p>
              <p className="font-display text-lg leading-snug text-umber">
                &ldquo;Season to taste&rdquo; is not a shortcut here — it is
                how the dish has always been cooked.
              </p>
              <div className="stitch-line my-4" />
              <p className="text-sm text-umber/70 leading-relaxed">
                Every ingredient list on this table is a starting point.
                Adjust the lime, the chili, the fish sauce, until it tastes
                like your own kitchen.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
