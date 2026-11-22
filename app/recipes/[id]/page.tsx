"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  Utensils,
  Pencil,
  Trash2,
  Loader2,
  AlertCircle,
  User as UserIcon,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Recipe } from "@/data/recipes";
import {
  categoryLabel,
  localizedBody,
  localizedTitles,
  recipeMeta,
  useLanguage,
} from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";
import { mapEntryToRecipe, type EntryRow } from "@/utils/entries";

export default function RecipeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { t, lang } = useLanguage();

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
      t("detail.deleteConfirm", {
        name: recipe?.name || recipe?.khmer || "",
      }),
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
          deleteError || "No row returned",
        );
        setErrorMessage(t("detail.saveFailed"));
        setIsDeleting(false);
        return;
      }

      // Successfully deleted
      router.push("/recipes");
    } catch (err) {
      console.error("Unexpected error during entry deletion:", err);
      setErrorMessage(t("detail.saveFailed"));
      setIsDeleting(false);
    }
  };

  const isOwner = Boolean(
    user && recipe && recipe.owner && user.id === recipe.owner,
  );

  const meta = recipeMeta(recipe, t, lang);

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-4xl px-5 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("detail.backToAll")}
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
                  {t("common.edit")}
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
                    {t("detail.deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    {t("common.delete")}
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

        {recipe && recipe.status && recipe.status !== "published" && (
          <div className="mb-6 rounded-sm border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-foreground">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="font-semibold text-foreground">
                  {recipe.status === "returned"
                    ? t("detail.returnedTitle")
                    : t("detail.pendingTitle")}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {recipe.status === "returned"
                    ? t("detail.returnedText")
                    : t("detail.pendingText")}
                </p>
              </div>
            </div>
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
            <h2 className="mt-4 font-display text-2xl text-primary">
              {t("detail.notFoundTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("detail.notFoundText")}
            </p>
            <Button asChild className="mt-6 uppercase tracking-[0.2em] text-xs">
              <Link href="/recipes">{t("detail.viewAll")}</Link>
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
                {localizedTitles(recipe, lang).secondary && (
                  <p className="font-display text-xl text-accent">
                    {localizedTitles(recipe, lang).secondary}
                  </p>
                )}
                <h1 className="mt-1 font-display text-3xl sm:text-5xl text-primary">
                  {localizedTitles(recipe, lang).primary}
                </h1>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 border-b border-border pb-4 text-xs uppercase tracking-wider text-muted-foreground">
                <span className="flex items-center gap-1.5 text-foreground font-medium">
                  <MapPin className="h-4 w-4 text-accent" />
                  {meta.place}
                </span>
                {/* Each separator is grouped with the item it introduces, so a
                    wrap can never strand a "•" at the end of a line. */}
                <span className="flex items-center gap-4">
                  <span aria-hidden="true">•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-accent" />
                    {meta.time}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span aria-hidden="true">•</span>
                  <span>{meta.servings}</span>
                </span>
                <span className="flex items-center gap-4">
                  <span aria-hidden="true">•</span>
                  <span className="flex items-center gap-1.5 text-foreground font-medium">
                    <UserIcon className="h-4 w-4 text-accent" />
                    <span>
                      {t("common.contributedBy")}: {meta.contributor}
                    </span>
                  </span>
                </span>
                <Badge
                  variant="secondary"
                  className="ml-auto text-xs uppercase tracking-wider"
                >
                  {categoryLabel(t, recipe.category)}
                </Badge>
              </div>

              {/* Note / Intro */}
              <p className="text-base leading-relaxed italic text-muted-foreground border-l-2 border-accent pl-4">
                &ldquo;{meta.note}&rdquo;
              </p>

              {/* Ingredients */}
              <div className="space-y-4">
                <h2 className="border-b border-border pb-2 font-display text-2xl text-primary">
                  {t("common.ingredients")}
                </h2>
                <ul className="grid gap-3 text-sm leading-relaxed text-foreground sm:grid-cols-2">
                  {localizedBody(recipe, lang).ingredients.map((ing, idx) => (
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
                  {t("common.cooking")}
                </h2>
                <ol className="space-y-4 text-sm leading-relaxed text-foreground">
                  {localizedBody(recipe, lang).instructions.map((step, idx) => (
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
