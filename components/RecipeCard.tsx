import Link from "next/link";
import type { Recipe } from "@/lib/recipes";

export default function RecipeCard({
  recipe,
  rotate = "-rotate-2"
}: {
  recipe: Recipe;
  rotate?: string;
}) {
  return (
    <Link
      href={`/recipes/${recipe.slug}`}
      className="group relative block rounded-sm overflow-hidden aspect-[4/5] bg-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-turmeric"
    >
      {recipe.image ? (
        <img
          src={recipe.image}
          alt={`${recipe.name}, a traditional dish from Battambang province`}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ink via-ink-soft to-leaf/40 texture-grain">
          <span className="font-mono-tag text-paper/40 text-xs tracking-widest uppercase">
            Photo coming soon
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />

      <span className="absolute top-4 left-4 font-mono-tag text-[10px] tracking-widest uppercase text-paper/80 bg-ink/50 px-2 py-1 rounded-sm">
        {recipe.category}
      </span>

      <div
        className={`absolute -bottom-2 left-4 right-4 md:left-5 md:right-auto md:w-[78%] market-tag ${rotate} group-hover:rotate-0 transition-transform duration-500 ease-out px-4 pt-4 pb-3`}
      >
        <p className="font-display text-lg md:text-xl leading-tight text-umber">
          {recipe.name}
        </p>
        <p className="font-display text-sm text-clay/90 mb-1">{recipe.khmer}</p>
        <div className="stitch-line my-1.5" />
        <p className="font-mono-tag text-[10px] tracking-wide uppercase text-umber/60">
          {recipe.pronunciation}
        </p>
      </div>
    </Link>
  );
}
