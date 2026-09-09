import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Search, X, RotateCcw } from "lucide-react";

import { RecipeCard } from "@/components/RecipeCard";
import { SiteChrome } from "@/components/SiteChrome";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { recipes, RECIPE_CATEGORIES, type RecipeCategory } from "@/data/recipes";

export const Route = createFileRoute("/recipes")({
  head: () => ({
    meta: [
      { title: "Nine Khmer Recipes from Battambang" },
      {
        name: "description",
        content:
          "Nine traditional Khmer recipes from Battambang province: kralan, amok trey, samlor korko, num banh chok and more.",
      },
      { property: "og:title", content: "Nine Khmer Recipes from Battambang" },
      {
        property: "og:description",
        content: "Kralan, amok trey, samlor korko and other dishes of Battambang province.",
      },
    ],
  }),
  component: RecipesPage,
});

const PER_PAGE = 6;

function RecipesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState(1);

  const categories = ["All", ...RECIPE_CATEGORIES];

  const filteredRecipes = useMemo(() => {
    return recipes.filter((r) => {
      const matchesCategory =
        selectedCategory === "All" || r.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.khmer.toLowerCase().includes(q) ||
        r.note.toLowerCase().includes(q) ||
        r.place.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q);

      return matchesCategory && matchesQuery;
    });
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / PER_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const shown = filteredRecipes.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setPage(1);
  };

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setPage(1);
  };

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Battambang</p>
        <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">The Recipes</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Nine dishes cooked in the villages, markets and riverside kitchens of Battambang
          province.
        </p>

        {/* Search & Category Filter Section */}
        <div className="mt-8 flex flex-col gap-5 border-y border-border py-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder="Search recipes, ingredients, locations..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-9 pr-9 text-sm"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-wider text-muted-foreground font-medium">
              Category:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={`rounded-full px-3 py-1 text-xs transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results grid or empty state */}
        {filteredRecipes.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-12 flex items-center justify-center gap-3 border-t border-border pt-8"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setPage(n)}
                    aria-current={safePage === n ? "page" : undefined}
                    className={
                      safePage === n
                        ? "h-10 w-10 rounded-sm border border-primary bg-primary font-display text-primary-foreground"
                        : "h-10 w-10 rounded-sm border border-border font-display text-muted-foreground transition-colors hover:text-primary"
                    }
                  >
                    {n}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}

            <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {totalPages > 1 ? `Page ${safePage} of ${totalPages} · ` : ""}
              {shown.length} of {filteredRecipes.length} matching dish{filteredRecipes.length === 1 ? "" : "es"}
              {filteredRecipes.length !== recipes.length && ` (filtered from ${recipes.length})`}
            </p>
          </>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-16 px-4 text-center">
            <div className="rounded-full bg-muted p-4 text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl text-primary">No recipes found</h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn't find any dishes matching "{searchQuery}"
              {selectedCategory !== "All" ? ` in category "${selectedCategory}"` : ""}.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="mt-6 inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
