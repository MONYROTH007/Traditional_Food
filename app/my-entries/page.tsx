"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Lock,
  LogIn,
  Loader2,
  Plus,
  Utensils,
  Pencil,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  User as UserIcon,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  categoryLabel,
  localizedTitles,
  recipeMeta,
  useLanguage,
  type MsgKey,
} from "@/lib/i18n";
import { createClient } from "@/utils/supabase/client";
import {
  getStatusBadgeClass,
  mapEntryToRecipe,
  normalizeStatus,
  type EntryRow,
} from "@/utils/entries";
import type { Recipe } from "@/data/recipes";

export default function MyEntriesPage() {
  const { t, lang } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [entries, setEntries] = useState<(Recipe & { rawStatus: string })[]>(
    [],
  );
  const [loadingEntries, setLoadingEntries] = useState(true);
  // Store the message key, not the translated text, so an error already on
  // screen re-translates when the reader switches language.
  const [errorKey, setErrorKey] = useState<MsgKey | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setEntries([]);
      setLoadingEntries(false);
      return;
    }

    async function fetchMyEntries() {
      try {
        setLoadingEntries(true);
        setErrorKey(null);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("entries")
          .select("*")
          .eq("owner", user!.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching entries for /my-entries:", fetchError);
          setErrorKey("myEntries.loadError");
          setEntries([]);
        } else if (data) {
          const mapped = data.map((row: EntryRow) => {
            const recipe = mapEntryToRecipe(row);
            return {
              ...recipe,
              rawStatus: (row.status || "pending").toLowerCase(),
            };
          });
          setEntries(mapped);
        }
      } catch (err) {
        console.error("Failed to load user entries:", err);
        setErrorKey("myEntries.unexpectedLoadError");
        setEntries([]);
      } finally {
        setLoadingEntries(false);
      }
    }

    fetchMyEntries();
  }, [user]);

  const publishedCount = entries.filter(
    (e) => e.rawStatus === "published",
  ).length;
  const pendingCount = entries.filter((e) => e.rawStatus === "pending").length;
  const returnedCount = entries.filter(
    (e) => e.rawStatus === "returned",
  ).length;

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {t("myEntries.kicker")}
            </p>
            <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
              {t("myEntries.title")}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {t("myEntries.intro")}
            </p>
          </div>

          {user && (
            <Button
              asChild
              className="uppercase tracking-[0.18em] text-xs shrink-0"
            >
              <Link href="/contribute">
                <Plus className="mr-2 h-4 w-4" />
                {t("myEntries.submit")}
              </Link>
            </Button>
          )}
        </div>

        {/* Auth Loading */}
        {authLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-xs uppercase tracking-widest">
              {t("common.checkingAuth")}
            </p>
          </div>
        ) : !user ? (
          /* Logged-out visitor gate */
          <div className="mt-10 rounded-sm border border-border bg-card p-8 text-center shadow-warm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary">
              {t("common.loginRequired")}
            </h2>
            <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
              {t("myEntries.gateText")}
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild className="uppercase tracking-[0.2em] text-xs">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  {t("common.login")}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="uppercase tracking-[0.2em] text-xs"
              >
                <Link href="/signup">{t("common.signup")}</Link>
              </Button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="mt-8 space-y-8">
            {/* Status Metric Pills */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-sm border border-border bg-card p-4">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {t("myEntries.total")}
                </p>
                <p className="mt-1 font-display text-2xl text-primary">
                  {entries.length}
                </p>
              </div>

              <div className="rounded-sm border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {t("status.pending")}
                  </p>
                  <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <p className="mt-1 font-display text-2xl text-amber-600 dark:text-amber-400">
                  {pendingCount}
                </p>
              </div>

              <div className="rounded-sm border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    {t("status.published")}
                  </p>
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="mt-1 font-display text-2xl text-emerald-600 dark:text-emerald-400">
                  {publishedCount}
                </p>
              </div>

              <div className="rounded-sm border border-rose-500/30 bg-rose-500/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider text-rose-700 dark:text-rose-400">
                    {t("status.returned")}
                  </p>
                  <RotateCcw className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <p className="mt-1 font-display text-2xl text-rose-600 dark:text-rose-400">
                  {returnedCount}
                </p>
              </div>
            </div>

            {errorKey && (
              <div className="flex items-start gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{t(errorKey)}</p>
              </div>
            )}

            {/* List of Entries */}
            {loadingEntries ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
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
            ) : entries.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                {entries.map((recipe) => {
                  const badgeClass = getStatusBadgeClass(recipe.rawStatus);
                  const statusLabel = t(
                    `status.${normalizeStatus(recipe.rawStatus)}`,
                  );
                  const titles = localizedTitles(recipe, lang);
                  const meta = recipeMeta(recipe, t, lang);

                  return (
                    <article
                      key={recipe.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-sm border border-border bg-card transition-shadow hover:shadow-warm"
                    >
                      <div>
                        {/* Image + Category */}
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                          <img
                            src={recipe.image}
                            alt={recipe.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute left-3 top-3">
                            <Badge variant="secondary" className="shadow-sm">
                              {categoryLabel(t, recipe.category)}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Plain Words Status Badge (Khmer and English) */}
                          <div
                            className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-semibold tracking-wide ${badgeClass}`}
                          >
                            <span>{statusLabel}</span>
                          </div>

                          {titles.secondary && (
                            <p className="mt-3 font-display text-sm text-accent">
                              {titles.secondary}
                            </p>
                          )}
                          <h3 className="mt-1 font-display text-xl text-primary">
                            {titles.primary}
                          </h3>

                          {recipe.ingredients.length > 0 && (
                            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {recipe.ingredients.slice(0, 3).join(" · ")}
                              {recipe.ingredients.length > 3 ? " …" : ""}
                            </p>
                          )}

                          <div className="mt-4 flex items-center gap-1.5 border-t border-border/60 pt-3 text-[11px] text-muted-foreground">
                            <UserIcon className="h-3 w-3 shrink-0 text-accent" />
                            <span className="shrink-0">{t("common.from")}</span>
                            <span className="truncate text-foreground">
                              {meta.source}
                            </span>
                          </div>

                          {/* Actionable notice for returned recipes */}
                          {recipe.rawStatus === "returned" && (
                            <div className="mt-3 rounded-sm border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-700 dark:text-rose-300">
                              <p className="font-semibold">
                                {t("myEntries.revisionsRequested")}
                              </p>
                              <p className="mt-0.5 text-[11px] text-rose-600/90 dark:text-rose-300/90">
                                {t("myEntries.revisionsText")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between border-t border-border bg-muted/20 p-3">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs uppercase tracking-wider"
                        >
                          <Link href={`/recipes/${recipe.id}`}>
                            <Eye className="mr-1.5 h-3.5 w-3.5" />
                            {t("common.view")}
                          </Link>
                        </Button>

                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs uppercase tracking-wider"
                        >
                          <Link href={`/recipes/${recipe.id}/edit`}>
                            <Pencil className="mr-1.5 h-3.5 w-3.5" />
                            {t("common.edit")}
                          </Link>
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border px-4 py-16 text-center">
                <div className="rounded-full bg-muted p-4 text-muted-foreground">
                  <Utensils className="h-8 w-8" />
                </div>
                <h3 className="mt-4 font-display text-xl text-primary">
                  {t("myEntries.emptyTitle")}
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  You haven&apos;t contributed any traditional recipes yet.
                  Share a family recipe from Battambang to get started!
                </p>
                <Button
                  asChild
                  className="mt-6 uppercase tracking-[0.2em] text-xs"
                >
                  <Link href="/contribute">
                    <Plus className="mr-2 h-4 w-4" />
                    {t("myEntries.submitFirst")}
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </SiteChrome>
  );
}
