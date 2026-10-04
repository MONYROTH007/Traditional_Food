"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, MapPin, CheckCircle2, Utensils, Pencil, Trash2, Loader2, AlertCircle } from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/data/recipes";
import { createClient } from "@/utils/supabase/client";
import { mapEntryToRecipe, type EntryRow } from "@/utils/entries";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    async function fetchRecipe() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("entries")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error || !data) {
          console.error("Error fetching recipe detail:", error);
          setNotFound(true);
        } else {
          setRecipe(mapEntryToRecipe(data as EntryRow));
        }
      } catch (err) {
        console.error("Failed to fetch recipe:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [resolvedParams.id]);

  const handleDelete = async () => {
    setErrorMessage(null);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${recipe?.name || recipe?.khmer || "this entry"}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const supabase = createClient();
      const { data: deleteData, error: deleteError } = await supabase
        .from("entries")
        .delete()
        .eq("id", resolvedParams.id)
        .select();

      // Check if a row actually came back
      if (deleteError || !deleteData || deleteData.length === 0) {
        console.error(
          "Delete failed or 0 rows returned from delete select:",
          deleteError || "No row returned"
        );
        setErrorMessage("That change wasn't saved");
        setIsDeleting(false);
        return;
      }

      // Successfully deleted
      router.push("/recipes");
    } catch (err) {
      console.error("Unexpected error during entry deletion:", err);
      setErrorMessage("That change wasn't saved");
      setIsDeleting(false);
    }
  };

  const isOwner = Boolean(user && recipe && recipe.owner && user.id === recipe.owner);

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all recipes
          </Link>

          {/* Edit and Delete buttons - shown ONLY when logged-in user is the owner */}
          {isOwner && (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="uppercase tracking-[0.18em] text-xs"
              >
                <Link href={`/recipes/${resolvedParams.id}/edit`}>
                  <Pencil className="mr-1.5 h-3.5 w-3.5" />
                  Edit
                </Link>
              </Button>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="uppercase tracking-[0.18em] text-xs"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Delete
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-72 w-full rounded-sm bg-muted" />
            <div className="h-8 w-1/2 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-32 w-full rounded bg-muted" />
          </div>
        ) : notFound || !recipe ? (
          <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border py-16 text-center">
            <Utensils className="h-10 w-10 text-muted-foreground" />
            <h2 className="mt-4 font-display text-2xl text-primary">Recipe Not Found</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              The recipe you are looking for does not exist or has been removed.
            </p>
            <Button asChild className="mt-6 uppercase tracking-[0.2em] text-xs">
              <Link href="/recipes">View All Recipes</Link>
            </Button>
          </div>
        ) : (
          <article className="rounded-sm border border-border bg-card shadow-warm overflow-hidden">
            <div className="relative h-72 sm:h-96 w-full overflow-hidden">
              <img
                src={recipe.image}
                alt={recipe.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-xl text-accent">{recipe.khmer}</p>
                <h1 className="mt-1 font-display text-3xl sm:text-5xl text-primary">
                  {recipe.name}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <MapPin className="h-4 w-4 text-accent" />
                  {recipe.place}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-accent" />
                  {recipe.time}
                </span>
                {recipe.servings && (
                  <>
                    <span>•</span>
                    <span>{recipe.servings}</span>
                  </>
                )}
                <Badge variant="secondary" className="ml-auto text-xs uppercase tracking-wider">
                  {recipe.category}
                </Badge>
              </div>

              {/* Note / Intro */}
              <p className="text-base leading-relaxed italic text-muted-foreground border-l-2 border-accent pl-4">
                &ldquo;{recipe.note}&rdquo;
              </p>

              {/* Ingredients */}
              <div className="space-y-4">
                <h2 className="border-b border-border pb-2 font-display text-2xl text-primary">
                  Ingredients (គ្រឿងផ្សំ)
                </h2>
                <ul className="grid gap-3 text-sm leading-relaxed text-foreground sm:grid-cols-2">
                  {recipe.ingredients.map((ing, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2.5 rounded-sm border border-border/60 bg-background/50 p-3"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cooking Steps */}
              <div className="space-y-4">
                <h2 className="border-b border-border pb-2 font-display text-2xl text-primary">
                  Preparation & Cooking (វិធីធ្វើ)
                </h2>
                <ol className="space-y-4 text-sm leading-relaxed text-foreground">
                  {recipe.instructions.map((step, idx) => (
                    <li
                      key={idx}
                      className="flex gap-4 rounded-sm border border-border/60 bg-background/50 p-4"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {idx + 1}
                      </span>
                      <span className="mt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        )}
      </div>
    </SiteChrome>
  );
}
