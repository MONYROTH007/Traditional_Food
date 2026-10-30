import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { SiteChrome } from "@/components/SiteChrome";
import { ReviewQueue } from "@/components/ReviewQueue";
import { createClient } from "@/utils/supabase/server";
import type { EntryRow } from "@/utils/entries";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const supabase = await createClient();

  // On the server, call supabase.rpc('is_reviewer')
  const { data: isReviewer, error: reviewerError } = await supabase.rpc("is_reviewer");

  // If it doesn't return true, show only this message and no entries: [your answer to question 5]
  if (reviewerError || isReviewer !== true) {
    return (
      <SiteChrome>
        <div className="mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center px-5 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-warm">
            <ShieldAlert className="h-8 w-8 text-primary" />
          </div>

          <span className="mt-4 rounded-full border border-destructive/30 bg-destructive/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-destructive">
            403 Forbidden
          </span>

          <h1 className="mt-4 font-display text-2xl text-primary sm:text-3xl">
            គ្មានសិទ្ធិចូលមើល (Access Denied)
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            ទំព័រនេះត្រូវបានកំណត់សម្រាប់តែអ្នកត្រួតពិនិត្យប៉ុណ្ណោះ។ សូមចូលគណនីដែលមានសិទ្ធិ ឬត្រឡប់ទៅកាន់ទំព័រដើម។
          </p>

          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This review queue is restricted to authorized kitchen reviewers only. If you believe this is an error, please contact the administrator.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-primary/90"
          >
            ត្រឡប់ទៅកាន់ទំព័រដើម (Back to Home)
          </Link>
        </div>
      </SiteChrome>
    );
  }

  // For reviewers, list entries where status is 'pending', ordered by created_at ascending (oldest first).
  const { data: pendingEntries, error: fetchError } = await supabase
    .from("entries")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("Error fetching pending entries on server:", fetchError);
  }

  return (
    <SiteChrome>
      <ReviewQueue initialEntries={(pendingEntries as EntryRow[]) || []} />
    </SiteChrome>
  );
}
