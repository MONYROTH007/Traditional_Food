# Traditional Khmer Recipes (Battambang Province)

**Live Application:** https://traditional-khmer-food.lovable.app _(confirm this is still the current deploy before submitting — see the checklist at the bottom)_

---

## 1. What this is

This is a community archive of traditional Khmer dishes from Battambang province. Anyone can browse and search the published collection without an account; registered contributors can submit a family or village recipe with a photo, and a small team of kitchen reviewers checks each submission before it goes public. It started as a static list of nine heritage dishes in Sprint 1 and has grown, sprint by sprint, into a full contribute → review → publish pipeline backed by Supabase.

## 2. Who it's for

The primary audience is Cambodians — in Battambang and beyond — who want to find or pass down a dish the way their family or village actually makes it, plus anyone researching or teaching Khmer food culture. Decisions made with that audience in mind:

- **Khmer first, with a real language switcher.** The whole interface ships in both Khmer and English, and a ខ្មែរ / EN toggle in the header switches between them. Khmer is the default for every first-time visitor; the choice is remembered in `localStorage`. Dish titles are still required in Khmer script (validated against the `ក-៿` Unicode range), and contributors may optionally add English translations of the ingredients and steps — where no translation exists, English readers see the Khmer original rather than a blank. The one deliberate exception is the `/review` 403 screen and the error/404 boundaries, which stay bilingual in a single view because they render outside the language context.
- **Phones first.** The layout is a single-column, card-based grid that reflows at `sm`/`lg` breakpoints rather than a desktop table; images lazy-load; the archive is paginated at 6 recipes per page instead of shipping the whole dataset to a mobile connection at once.
- **Slow connections.** Client-side data fetching is scoped to exactly what the screen needs (`select('*').eq('status', 'published')` for the public list, not the whole table), and uploaded photos are capped at 5 MB.
- **Sources are named, not anonymized by default.** Every entry carries a "Source / Contributor Name" field, shown on the recipe card, the detail page, the review queue, and the contributor's own dashboard — so a dish stays attached to the person or place it came from. If a contributor leaves it blank, it falls back to their account name rather than going uncredited.

## 3. How it works

**Stack:** Next.js (App Router) deployed on Vercel for the site; Supabase for auth, the Postgres database, and photo storage.

**Data model** (the base tables were created in the Supabase dashboard; later schema changes live in [`db/migrations/`](./db/migrations/) and are run by hand in the SQL editor):

- `entries` — one row per recipe: `id`, `title` (Khmer), `title_en`, `ingredients`, `steps`, `ingredients_en`, `steps_en`, `source` (provenance/contributor), `photo_url`, `owner` (→ `auth.users`), `status`, `created_at`.
- `reviewers` — the allowlist of accounts permitted to approve or return submissions.

`ingredients_en` and `steps_en` are nullable English translations added by [`001_bilingual_entries.sql`](./db/migrations/001_bilingual_entries.sql). By design the Khmer text in `ingredients` / `steps` is required and authoritative, and a null translation simply means the English reader sees the Khmer original. The app also tolerates those columns not existing yet, saving without them if `001` has not been run.

> **Known data issue.** An audit of the 10 published entries found the body columns inverted against that intent: `ingredients` and `steps` hold _English_ text and the `_en` columns are empty, so Khmer readers currently see English recipe bodies. Titles are fine — every `title` is Khmer and every `title_en` is English. The cause was the contribute form, which labelled the title "Dish Name in Khmer" but the bodies only "Ingredients" / "Cooking Steps", so contributors filled them in English; those labels now state the language. [`002_move_english_into_en_columns.sql`](./db/migrations/002_move_english_into_en_columns.sql) stages the stored rows by copying the English into the `_en` columns. [`003_khmer_recipe_bodies.sql`](./db/migrations/003_khmer_recipe_bodies.sql) then fills the base columns with Khmer. **Those Khmer texts are AI-written translations of the stored English, not transcriptions of what the credited cooks said** — have a Khmer speaker review them before publishing, since every entry is attributed to a named source.

**Three entry statuses**, surfaced everywhere with bilingual badges:

| Status      | Meaning                                     | Who sees it                                                             |
| ----------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| `pending`   | Just submitted, waiting in the review queue | The owner (`/my-entries`, detail page banner) and reviewers (`/review`) |
| `returned`  | A reviewer sent it back for changes         | The owner only, with an edit-and-resubmit prompt                        |
| `published` | Approved and live                           | Everyone, via the public archive and search                             |

**Who can read/write what** (enforced as Postgres Row-Level Security policies on `entries` and the `photos` storage bucket, plus one RPC — see Section 4):

- Public `SELECT` is limited to `status = 'published'`; a contributor can additionally see their own rows regardless of status.
- `INSERT` requires `auth.uid() = owner`.
- `UPDATE` / `DELETE` are restricted to the owning contributor; status transitions away from `pending`/`returned` are _not_ granted through this path (see Section 4).
- Storage reads are public (so recipe photos render for visitors); storage writes/deletes are restricted to the uploader's own `{user_id}/...` folder path.

## 4. Security decisions

**The gate: `review_entry`.** Publishing is not a client-side status update. The review queue calls a single Postgres RPC, `review_entry(entry_id, decision)`, and only that function is allowed to move an entry out of `pending`. The function itself checks the caller against the `reviewers` table (via `is_reviewer()`) before touching the row, so the decision of _who may publish_ is enforced in the database, not in the browser.

**What the "Publish" button does and doesn't protect.** The Approve/Reject buttons in `ReviewQueue.tsx` are only rendered after the server (`app/review/page.tsx`) has already confirmed `is_reviewer()` is `true` for that session — a non-reviewer is shown a 403 screen before the buttons ever exist. That gate is a UX convenience, not the security boundary: even if someone found the button in dev tools, or called `supabase.rpc('review_entry', …)` directly from the console, the RPC re-checks reviewer status itself and returns `false`/an error instead of publishing. The client additionally requires the RPC to return `data === true` before it treats an entry as published, so a network hiccup can't be misread as a successful review. Hiding the button prevents confusion; the database grant is what prevents abuse.

**Decisions the briefs left to us:**

- **What a returned entry tells its author.** Rather than a generic "not found" or silence, a returned recipe shows a bilingual banner on its own detail page explaining a curator asked for changes, with a direct link to edit and resubmit. We chose transparency over silently hiding it, since a contributor with no feedback has no way to improve a submission.
- **Reviewers cannot take down an already-published entry.** `/review` only ever lists `status = 'pending'` rows, and there is no "unpublish" action anywhere in the UI. This was a deliberate scope limit for this sprint: the RPC and UI were built to gate _new_ submissions, not to moderate content that's already live. A takedown path (a dedicated RPC + confirmation UI, separate from `review_entry`) is the natural next addition if that need comes up.
- **What search shows a contributor about their own pending work.** The public search/browse page (`/recipes`) queries `status = 'published'` only — a contributor's own pending or returned entries never appear there, even to themselves. They see that status exclusively on `/my-entries` and on the entry's own detail page. We kept search strictly "what's public is public" so the archive's search results can't be used to infer what's sitting in the queue.

## 5. AI use

AI assistance (via an in-editor coding assistant) was used throughout all three sprints for scaffolding and iteration, with every change reviewed, run, and tested against a real Supabase project before being accepted. The full chronological record — what was asked, what came back, and what was changed before accepting it — is in [JOURNAL.md](./JOURNAL.md), including a dedicated Sprint 3 Prompt Journal. Summary of where AI output needed correction:

| Task                            | What AI produced first                                                                                    | What we changed, and why                                                                                                                                                                             |
| ------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review queue decision flow      | Direct `supabase.from('entries').update({ status })` from the client                                      | Replaced with the `review_entry` RPC and a strict `data === true` check — a direct client update would have been blocked by RLS for real reviewers and, if misconfigured, exploitable by anyone else |
| Resubmission after "returned"   | Status reset to `pending` only guarded by `if (!isReviewer)`                                              | Set unconditionally on every edit, so any resubmission satisfies the `WITH CHECK (status = 'pending')` policy regardless of who's editing                                                            |
| Contributor attribution rollout | Updated UI components but introduced a duplicate `User` import (lucide-react vs. `@supabase/supabase-js`) | Build failed under `next build`; fixed by aliasing the icon import                                                                                                                                   |
| Error messaging                 | English-only failure text (e.g. "That change wasn't saved")                                               | Rewritten bilingual (Khmer + English) to match the rest of the app                                                                                                                                   |

Every AI-authored change was run locally, exercised against a live Supabase instance with a real (non-admin) account, and — for the security-sensitive paths — re-tested with the five console attack scenarios described in Section 4/JOURNAL.md Entry 7 before being merged.

## 6. Sources and credits

Each entry in the archive carries a "Source / Contributor Name" field, shown on its card, detail page, and in the review queue, so every dish stays attributed to where it came from rather than the app.

> **TODO before submission:** list the actual named sources/credits here (e.g. "Larb Khmer — recipe shared by [Name], Psar Nath market" or "a contributor in Ek Phnom who asked not to be named"), matching the named-with-permission standard from the August capstone brief. The seeded heritage dataset currently credits places (e.g. "Psar Boeung Chhouk noodle stalls," "Sangkae riverside kitchens") rather than named individuals — confirm with the people behind those recipes whether they're comfortable being named, and update `src/data/recipes.ts` / the `source` column accordingly. Also credit any recipe photos that weren't taken by a contributor.

## 7. Running it locally

Prerequisites: Node.js 18+ and npm.

```sh
git clone <repository-url>
cd Traditional_Food
npm install
npm run dev
```

Build for production:

```sh
npm run build
npm run start
```

**Environment variables** (create `.env.local`, never commit it — it's already in `.gitignore`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The anon key is a Supabase _publishable_ client key, not a secret — it's meant to ship to the browser, and it's safe only because every table it can touch is protected by the Row-Level Security policies described in Section 3.

**Database migrations.** Files in [`db/migrations/`](./db/migrations/) are applied by hand: open the Supabase dashboard → SQL Editor, paste the file, and run it. They are idempotent, so re-running one is safe. Apply them in filename order; `001_bilingual_entries.sql` adds the optional English translation columns.

## 8. Submission checklist

- Live URL loads logged out and shows published entries only: ⬜ _(fill in: yes/no, URL)_
- A stranger cannot publish their own entry through the page or the console: ⬜ _(fill in: yes, tested on what date)_
- Logged out, the API returns nothing pending or returned: ⬜ _(fill in: yes, tested on what date)_
- Contributors can edit and delete only their own entries: ⬜ _(fill in)_
- No secrets anywhere in the repo history: ⬜ _(fill in: how you checked — e.g. `git log -p -- .env*`, a secrets scanner)_
- At least eight real entries, each with a credited source: ⬜ _(fill in: count)_
- Khmer renders on every screen a user meets, including the queue: ⬜ _(fill in)_
- Works at phone width: ⬜ _(fill in: device or browser width tested)_
- No test entries, lorem ipsum or TODO comments in shipped pages: ⬜ _(fill in — note: a stray test entry was flagged in JOURNAL.md Entry 7; confirm it's been removed from the live database)_
- No console errors on the main pages: ⬜ _(fill in)_
- `jesseorndorff` is a collaborator on this repo: ⬜ _(fill in)_
- Supabase project restored and awake on: ⬜ _(fill in date)_
- Demo video link opens in a private window: ⬜ _(fill in link)_
- Reflection pasted in the Canvas submission: ⬜ _(fill in)_
- Posted in the Show Your Archive discussion: ⬜ _(fill in)_
- Q&A slot booked for: ⬜ _(fill in date and time)_
