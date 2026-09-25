"use client";

import { Search, X, RotateCcw, Lock, LogIn, UserPlus, Utensils } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { RecipeCard } from "@/components/RecipeCard";
import { SiteChrome } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RECIPE_CATEGORIES, type Recipe } from "@/data/recipes";
import { createClient } from "@/utils/supabase/client";
import { mapEntryToRecipe, type EntryRow } from "@/utils/entries";

const PER_PAGE = 6;

export default function RecipesPage() {
  const router = useRouter();
  const [recipesList, setRecipesList] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [page, setPage] = useState(1);

  const [user, setUser] = useState<unknown | null>(null);
  const [pageAuthPromptOpen, setPageAuthPromptOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching entries:", error);
          setRecipesList([]);
        } else if (data) {
          setRecipesList(data.map((row: EntryRow) => mapEntryToRecipe(row)));
        }
      } catch (err) {
        console.error("Failed to fetch entries:", err);
        setRecipesList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEntries();
  }, []);

  const categories = ["All", ...RECIPE_CATEGORIES];

  const filteredRecipes = useMemo(() => {
    return recipesList.filter((r) => {
      const matchesCategory =
        selectedCategory === "All" || r.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.khmer.toLowerCase().includes(q) ||
        r.note.toLowerCase().includes(q) ||
        r.place.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.ingredients.some((ing) => ing.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [recipesList, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredRecipes.length / PER_PAGE);
  const safePage = Math.min(page, Math.max(1, totalPages));
  const shown = filteredRecipes.slice(
    (safePage - 1) * PER_PAGE,
    safePage * PER_PAGE,
  );

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

  const handlePageChange = (newPage: number) => {
    if (newPage > 1 && !user) {
      setPageAuthPromptOpen(true);
      return;
    }
    setPage(newPage);
  };

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Battambang
        </p>
        <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
          The Recipes
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          Dishes cooked in the villages, markets and riverside kitchens of
          Battambang province.
        </p>

        <div className="mt-8 flex flex-col gap-5 border-y border-border py-6">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Clear search query"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
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
                      ? "bg-primary font-medium text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: PER_PAGE }).map((_, i) => (
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
        ) : filteredRecipes.length > 0 ? (
          <>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((r) => (
                <RecipeCard
                  key={r.id}
                  recipe={r}
                  requiresAuth={!user && safePage > 1}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-12 flex items-center justify-center gap-3 border-t border-border pt-8"
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                  disabled={safePage === 1}
                  className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                >
                  Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => handlePageChange(n)}
                      aria-current={safePage === n ? "page" : undefined}
                      className={
                        safePage === n
                          ? "h-10 w-10 rounded-sm border border-primary bg-primary font-display text-primary-foreground"
                          : "h-10 w-10 rounded-sm border border-border font-display text-muted-foreground transition-colors hover:text-primary"
                      }
                    >
                      {n}
                    </button>
                  ),
                )}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, safePage + 1))
                  }
                  disabled={safePage === totalPages}
                  className="rounded-sm border border-border px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}

            <p className="mt-6 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {totalPages > 1 ? `Page ${safePage} of ${totalPages} · ` : ""}
              {shown.length} of {filteredRecipes.length} matching dish
              {filteredRecipes.length === 1 ? "" : "es"}
              {filteredRecipes.length !== recipesList.length &&
                ` (filtered from ${recipesList.length})`}
            </p>
          </>
        ) : recipesList.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-sm border border-dashed border-border px-4 py-16 text-center">
            <div className="rounded-full bg-muted p-4 text-muted-foreground">
              <Utensils className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl text-primary">
              No entries in database
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              There are currently no traditional food entries stored in Supabase.
            </p>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-sm border border-dashed border-border px-4 py-16 text-center">
            <div className="rounded-full bg-muted p-4 text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 font-display text-xl text-primary">
              No recipes found
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              We couldn't find any dishes matching "{searchQuery}"
              {selectedCategory !== "All"
                ? ` in category "${selectedCategory}"`
                : ""}
              .
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

      {/* Pagination Auth Required Dialog */}
      <Dialog open={pageAuthPromptOpen} onOpenChange={setPageAuthPromptOpen}>
        <DialogContent className="max-w-md border-border bg-card p-6 text-center shadow-warm sm:rounded-md">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Lock className="h-6 w-6" />
          </div>

          <DialogHeader>
            <DialogTitle className="text-center font-display text-2xl text-primary">
              Login Required
            </DialogTitle>
            <DialogDescription className="mt-2 text-center text-xs leading-relaxed text-muted-foreground">
              Accessing Page 2 and additional heritage recipes requires a
              registered account. Please log in or sign up to continue.
            </DialogDescription>
          </DialogHeader>

          <div className="my-6 space-y-2 rounded-sm border border-border bg-background p-4 text-left text-xs">
            <p className="font-display text-sm text-accent">
              ម្ហូបខ្មែរបុរាណ · Battambang
            </p>
            <p className="text-muted-foreground">
              Create a free account or sign in to unlock all recipe pages,
              ingredients, and instructions.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                setPageAuthPromptOpen(false);
                router.push("/login");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground"
            >
              <LogIn className="h-4 w-4" />
              <span>Log In</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setPageAuthPromptOpen(false);
                router.push("/signup");
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm border-border text-xs uppercase tracking-[0.2em]"
            >
              <UserPlus className="h-4 w-4 text-muted-foreground" />
              <span>Create Account</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SiteChrome>
  );
}
