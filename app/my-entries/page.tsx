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
} from "lucide-react";
import type { User } from "@supabase/supabase-js";

import { SiteChrome } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import {
  mapEntryToRecipe,
  getStatusDetails,
  type EntryRow,
} from "@/utils/entries";
import type { Recipe } from "@/data/recipes";

export default function MyEntriesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [entries, setEntries] = useState<(Recipe & { rawStatus: string })[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(null);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("entries")
          .select("*")
          .eq("owner", user!.id)
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Error fetching entries for /my-entries:", fetchError);
          setError("Unable to load your entries. Please refresh to try again.");
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
        setError("An unexpected error occurred while loading your entries.");
        setEntries([]);
      } finally {
        setLoadingEntries(false);
      }
    }

    fetchMyEntries();
  }, [user]);

  const publishedCount = entries.filter((e) => e.rawStatus === "published").length;
  const pendingCount = entries.filter((e) => e.rawStatus === "pending").length;
  const returnedCount = entries.filter((e) => e.rawStatus === "returned").length;

  return (
    <SiteChrome>
      <div className="mx-auto w-full max-w-5xl px-5 py-12">
        {/* Header Section */}
        <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Contributor Dashboard
            </p>
            <h1 className="mt-2 font-display text-3xl text-primary sm:text-4xl">
              My Entries
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Track the curation and review status of all your traditional recipes submitted to the Battambang archive.
            </p>
          </div>

          {user && (
            <Button asChild className="uppercase tracking-[0.18em] text-xs shrink-0">
              <Link href="/contribute">
                <Plus className="mr-2 h-4 w-4" />
                Submit Recipe
              </Link>
            </Button>
          )}
        </div>

        {/* Auth Loading */}
        {authLoading ? (
          <div className="mt-12 flex flex-col items-center justify-center p-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-xs uppercase tracking-widest">Checking Authentication...</p>
          </div>
        ) : !user ? (
          /* Logged-out visitor gate */
          <div className="mt-10 rounded-sm border border-border bg-card p-8 text-center shadow-warm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary">Login Required</h2>
            <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
              You must be logged in to view your submitted entries and track their review status.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Button asChild className="uppercase tracking-[0.2em] text-xs">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log In
                </Link>
              </Button>
              <Button asChild variant="outline" className="uppercase tracking-[0.2em] text-xs">
                <Link href="/signup">
                  Sign Up
                </Link>
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
                  Total Submissions
                </p>
                <p className="mt-1 font-display text-2xl text-primary">
                  {entries.length}
                </p>
              </div>

              <div className="rounded-sm border border-amber-500/30 bg-amber-500/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Pending Review
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
                    Published
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
                    Returned
                  </p>
                  <RotateCcw className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                </div>
                <p className="mt-1 font-display text-2xl text-rose-600 dark:text-rose-400">
                  {returnedCount}
                </p>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-sm border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* List of Entries */}
            {loadingEntries ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {entries.map((recipe) => {
                  const statusInfo = getStatusDetails(recipe.rawStatus);

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
                              {recipe.category}
                            </Badge>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          {/* Plain Words Status Badge (Khmer and English) */}
                          <div
                            className={`inline-flex items-center rounded-sm border px-2.5 py-1 text-xs font-semibold tracking-wide ${statusInfo.badgeClass}`}
                          >
                            <span>{statusInfo.combined}</span>
                          </div>

                          <p className="mt-3 font-display text-sm text-accent">
                            {recipe.khmer}
                          </p>
                          <h3 className="mt-1 font-display text-xl text-primary">
                            {recipe.name}
                          </h3>

                          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                            {recipe.note}
                          </p>

                          <div className="mt-4 border-t border-border/60 pt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                            <span>From: </span>
                            <span className="text-foreground">{recipe.place}</span>
                          </div>

                          {/* Actionable notice for returned recipes */}
                          {recipe.rawStatus === "returned" && (
                            <div className="mt-3 rounded-sm border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-700 dark:text-rose-300">
                              <p className="font-semibold">Revisions Requested</p>
                              <p className="mt-0.5 text-[11px] text-rose-600/90 dark:text-rose-300/90">
                                Curators requested edits. Click Edit below to update and resubmit.
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
                            View
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
                            Edit
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
                  No Entries Found
                </h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  You haven&apos;t contributed any traditional recipes yet. Share a family recipe from Battambang to get started!
                </p>
                <Button
                  asChild
                  className="mt-6 uppercase tracking-[0.2em] text-xs"
                >
                  <Link href="/contribute">
                    <Plus className="mr-2 h-4 w-4" />
                    Submit Your First Recipe
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
