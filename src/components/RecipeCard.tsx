import type { Recipe } from "@/data/recipes";
import { Badge } from "@/components/ui/badge";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <article className="group overflow-hidden rounded-sm border border-border bg-card shadow-warm transition-shadow hover:shadow-lg">
      <div className="relative">
        <img
          src={recipe.image}
          alt={`${recipe.name}, a traditional Khmer dish from Battambang`}
          width={768}
          height={576}
          loading="lazy"
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {recipe.category && (
          <Badge
            variant="secondary"
            className="absolute top-3 right-3 bg-background/90 font-sans text-[10px] tracking-wider uppercase backdrop-blur-sm"
          >
            {recipe.category}
          </Badge>
        )}
      </div>
      <div className="border-t border-border p-5">
        <p className="font-display text-sm text-accent">{recipe.khmer}</p>
        <h3 className="mt-1 font-display text-xl text-primary">{recipe.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{recipe.note}</p>
        <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs uppercase tracking-[0.14em] text-muted-foreground">
          <div>
            <dt className="inline">From </dt>
            <dd className="inline text-foreground">{recipe.place}</dd>
          </div>
          <div>
            <dt className="inline">Time </dt>
            <dd className="inline text-foreground">{recipe.time}</dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
