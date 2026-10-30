"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
  MapPin,
  Utensils,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { createClient } from "@/utils/supabase/client";
import { resolvePhotoUrl, type EntryRow } from "@/utils/entries";

interface ReviewQueueProps {
  initialEntries: EntryRow[];
}

export function ReviewQueue({ initialEntries }: ReviewQueueProps) {
  const [entries, setEntries] = useState<EntryRow[]>(initialEntries);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [loadingDecision, setLoadingDecision] = useState<"published" | "returned" | null>(null);

  const handleReview = async (entryId: string, decision: "published" | "returned") => {
    setErrorMsg(null);
    setLoadingId(entryId);
    setLoadingDecision(decision);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.rpc("review_entry", {
        entry_id: entryId,
        decision,
      });

      if (error || data !== true) {
        console.error("review_entry RPC error:", error || "returned false");
        // [Answer to Question 3]
        setErrorMsg(
          "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ។ សូមពិនិត្យមើលការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។ (Unable to update entry status. Please check your connection and try again.)"
        );
      } else {
        // If the call returns true, remove that entry from the list
        setEntries((prev) => prev.filter((item) => item.id !== entryId));
      }
    } catch (err) {
      console.error("Unexpected error calling review_entry:", err);
      // [Answer to Question 3]
      setErrorMsg(
        "មិនអាចរក្សាទុកការផ្លាស់ប្តូរបានទេ។ សូមពិនិត្យមើលការតភ្ជាប់របស់អ្នក ហើយព្យាយាមម្តងទៀត។ (Unable to update entry status. Please check your connection and try again.)"
      );
    } finally {
      setLoadingId(null);
      setLoadingDecision(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header section */}
      <div className="border-b border-border pb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
          Kitchen Review Queue
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-3xl text-primary sm:text-4xl">
            ផ្ទៀងផ្ទាត់រូបមន្ត (Recipe Review Queue)
          </h1>
          <span className="inline-flex items-center rounded-sm border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground w-fit">
            {entries.length} {entries.length === 1 ? "entry" : "entries"} pending
          </span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Review community submissions from Battambang province. Approve traditional dishes for the public archive or return them for revision.
        </p>
      </div>

      {/* Error alert [Answer to Question 3] */}
      {errorMsg && (
        <Alert
          variant="destructive"
          className="mt-6 border-destructive/50 bg-destructive/10 text-destructive text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="leading-relaxed">
            {errorMsg}
          </AlertDescription>
        </Alert>
      )}

      {/* Empty state [Answer to Question 4] */}
      {entries.length === 0 ? (
        <div className="my-16 flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-card/50 px-6 py-16 text-center shadow-warm">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-primary shadow-warm">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="mt-5 font-display text-2xl text-primary sm:text-3xl">
            គ្មានរូបមន្តរង់ចាំការពិនិត្យទេ (Queue is Empty)
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            រាល់រូបមន្តដែលបានដាក់ស្នើត្រូវបានពិនិត្យរួចរាល់អស់ហើយ។ សូមត្រឡប់មកពិនិត្យម្តងទៀតនៅពេលក្រោយ។
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            All submitted recipes have been reviewed. The kitchen is all caught up!
          </p>
          <Link
            href="/recipes"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse Public Archive</span>
          </Link>
        </div>
      ) : (
        /* Pending entries list [Answer to Question 1] */
        <div className="mt-8 space-y-8">
          {entries.map((entry) => {
            const isProcessing = loadingId === entry.id;
            const photoSrc = resolvePhotoUrl(entry.photo_url);
            const formattedDate = entry.created_at
              ? new Date(entry.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Recently submitted";

            const ingredientsList = entry.ingredients
              ? entry.ingredients
                  .split("\n")
                  .map((i) => i.trim())
                  .filter(Boolean)
              : [];

            const stepsList = entry.steps
              ? entry.steps
                  .split("\n")
                  .map((s) => s.trim())
                  .filter(Boolean)
              : [];

            return (
              <article
                key={entry.id}
                className="overflow-hidden rounded-sm border border-border bg-card shadow-warm transition-shadow hover:shadow-md"
              >
                <div className="grid gap-6 p-6 md:grid-cols-12">
                  {/* Photo [Question 1] */}
                  <div className="md:col-span-4 lg:col-span-3">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-border bg-muted/20">
                      <img
                        src={photoSrc}
                        alt={entry.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span>{formattedDate}</span>
                    </div>
                    {entry.source && (
                      <div className="mt-1.5 flex items-start gap-1.5 text-[11px] text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                        <span className="italic">{entry.source}</span>
                      </div>
                    )}
                  </div>

                  {/* Recipe Details [Question 1] */}
                  <div className="flex flex-col justify-between md:col-span-8 lg:col-span-9">
                    <div>
                      {/* Titles */}
                      <div className="border-b border-border pb-3">
                        <h2 className="font-display text-2xl font-bold text-primary sm:text-3xl">
                          {entry.title}
                        </h2>
                        {entry.title_en && (
                          <p className="mt-1 text-sm font-medium uppercase tracking-wider text-accent">
                            {entry.title_en}
                          </p>
                        )}
                      </div>

                      {/* Ingredients & Steps preview */}
                      <div className="mt-4 grid gap-5 sm:grid-cols-2">
                        {/* Ingredients */}
                        <div className="rounded-sm border border-border/70 bg-background/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <Utensils className="h-3.5 w-3.5 text-accent" />
                            <span>គ្រឿងផ្សំ (Ingredients)</span>
                          </p>
                          <ul className="mt-2.5 space-y-1 text-xs text-foreground/90">
                            {ingredientsList.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-accent">•</span>
                                <span className="leading-relaxed">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Steps */}
                        <div className="rounded-sm border border-border/70 bg-background/50 p-4">
                          <p className="text-xs font-semibold uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-accent" />
                            <span>វិធីធ្វើ (Cooking Method)</span>
                          </p>
                          <ol className="mt-2.5 space-y-1.5 text-xs text-foreground/90">
                            {stepsList.map((step, idx) => (
                              <li key={idx} className="leading-relaxed">
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons [Question 2] */}
                    <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4">
                      {/* Return button [Question 2: Return label] */}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isProcessing}
                        onClick={() => handleReview(entry.id, "returned")}
                        className="border-destructive/40 text-destructive hover:bg-destructive/10 text-xs uppercase tracking-wider font-semibold px-4 py-2"
                      >
                        {isProcessing && loadingDecision === "returned" ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            <span>កំពុងប្រគល់ត្រឡប់...</span>
                          </>
                        ) : (
                          <span>បដិសេធ (Reject / Return)</span>
                        )}
                      </Button>

                      {/* Publish button [Question 2: Publish label] */}
                      <Button
                        type="button"
                        disabled={isProcessing}
                        onClick={() => handleReview(entry.id, "published")}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs uppercase tracking-wider font-semibold px-5 py-2 shadow-sm"
                      >
                        {isProcessing && loadingDecision === "published" ? (
                          <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            <span>កំពុងផ្សាយ...</span>
                          </>
                        ) : (
                          <span>អនុម័ត និងផ្សាយ (Approve & Publish)</span>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
