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

- `entries` — one row per recipe: `id`, `title` (Khmer), `title_en`, `ingredients`, `steps`, `ingredients_en`, `steps_en`, `source` (provenance/contributor, Khmer), `source_en`, `photo_url`, `owner` (→ `auth.users`), `status`, `created_at`.
- `reviewers` — the allowlist of accounts permitted to approve or return submissions.

`ingredients_en` and `steps_en` are nullable English translations added by [`001_bilingual_entries.sql`](./db/migrations/001_bilingual_entries.sql). By design the Khmer text in `ingredients` / `steps` is required and authoritative, and a null translation simply means the English reader sees the Khmer original. The app also tolerates those columns not existing yet, saving without them if `001` has not been run.

> **How the bilingual columns came to be.** The body and credit columns were
> originally filled in English — `ingredients`, `steps` and `source` held
> English text while the `_en` columns did not exist. The cause was the
> contribute form: it labelled the title "Dish Name in Khmer" (so every title
> is correctly Khmer) but labelled the bodies only "Ingredients" / "Cooking
> Steps", so contributors filled them in English. Those labels now state the
> language, and migrations `002`–`005` moved the English into the `_en`
> columns and wrote Khmer into the base columns. All 10 published entries are
> now bilingual in both body and credit.
>
> **The Khmer in `003` and `005` is AI-written translation, not a
> transcription of what the credited cooks and markets said.** Since every
> entry is attributed to a named source, it is worth having a Khmer speaker
> read those two files — particularly the village and market names in `005`.
> The English is preserved in the `_en` columns either way.

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

### Which models, and through what

All AI work went through **Claude Code** in the terminal and the VS Code extension — no Cline. Three models were used, and each commit records which one in a `Co-Authored-By` trailer, so the split is auditable with:

```sh
git log --format='%b' | grep 'Co-Authored-By' | sed 's/.*: //;s/ <.*//' | sort | uniq -c
```

| Model                          | Commits | What it was used for                                                                                                                                                                                                | Keep using it?                                                                                    |
| ------------------------------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Claude Opus 5 (1M context)** | 9       | Multi-step work where the cause could be in the code, the database or the font metrics: the bilingual architecture, the headless-browser audit, the database forensics, the five migrations, the Khmer translations | **Yes.** Held the whole codebase plus live DB state across long chases that crossed several files |
| **Claude Fable 5**             | 3       | Small scoped edits and quick factual answers — font swaps, "which font is this", one-line diagnoses                                                                                                                 | **Yes, for that only.** Fast and cheap when the change is one or two lines                        |
| **Claude Sonnet 5**            | 2       | Mechanical, well-specified work: the README rewrite, deleting dead files and dependencies                                                                                                                           | **Yes.** Fine when the task is clear and the risk is low                                          |

16 commits are additionally marked `AI-assisted` in the subject line, carried over from the Sprint 1–3 convention.

### What was kept as written

Most scaffolding survived unedited: the shadcn/ui component wiring, form state and validation plumbing, the Supabase client setup in `src/utils/supabase/`, the `LanguageProvider` and dictionary structure in `src/lib/i18n.tsx`, and the Tailwind layout for the cards and forms. These were read before accepting, but needed no correction — they are conventional patterns with an obvious right answer.

### What was rewritten, and why

| Model    | What it produced                                                                   | What I changed, and why                                                                                                                                                                                                                                                   |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sonnet 5 | Review queue calling `supabase.from('entries').update({ status })` from the client | Replaced with the `review_entry` RPC plus a strict `data === true` check. A client-side status update bypasses the gate entirely — this was the single most serious thing AI got wrong all semester                                                                       |
| Sonnet 5 | Treated "no network error" as a successful review                                  | Made success require `data === true`, so a dropped connection can't be misread as a publish                                                                                                                                                                               |
| Sonnet 5 | Edit page wrapped the status reset in `if (!isReviewer)`                           | Set `status: 'pending'` unconditionally, so a returned entry can always satisfy the RLS `WITH CHECK (status = 'pending')` policy on resubmit                                                                                                                              |
| Sonnet 5 | Duplicate `User` import (lucide-react vs `@supabase/supabase-js`)                  | Broke `next build`; aliased to `UserIcon`                                                                                                                                                                                                                                 |
| Opus 5   | Dates via `toLocaleDateString('km-KH', …)`                                         | Caused React hydration error #418 on every page: Node has no Khmer locale data, so the server emitted `Oct 8, 2026` and the browser `8 តុលា 2026`, and React discarded the tree. Replaced with explicit month tables and UTC getters so both halves agree by construction |
| Opus 5   | Generated a per-recipe description and `time: "30 min"` / `servings: "4 servings"` | Those were constants shown on all 10 dishes, and Kralan's card claimed 30 minutes while its own steps say 1–1.5 hours. Removed rather than guessed — an archive crediting named sources should not assert figures it was never told                                       |
| Fable 5  | Applied Moul to the entire site when asked to                                      | Did as asked, but it is a single-weight display face with no Latin glyphs, so bold was synthesised and English fell back mid-sentence. Walked back to Moul for display + Khmer OS Siemreap for body                                                                       |
| All      | English-only error strings, and English baked into `mapEntryToRecipe`              | Rewritten bilingual, and the derived display strings moved out of the data layer so they render in the reader's language                                                                                                                                                  |

### How the work was checked

Not by reading diffs alone — the two worst defects of the semester were invisible in review and only appeared when the app was actually run:

- **Headless Chrome audit** (Playwright driving system Chrome) over all 7 routes × 3 viewports (375 / 768 / 1440 px), measuring real geometry rather than eyeballing screenshots. It found horizontal overflow, a 404 favicon, sub-32px tap targets, clipped Khmer descenders and the hydration error in one pass.
- **Database forensics.** Querying the live project and classifying each column by script exposed that all 10 entries had English sitting in the Khmer columns — something no amount of code review would have shown.
- **Migrations tested before being applied**, by intercepting the Supabase response in the browser and rendering the post-migration rows. This caught a stranded `•` separator before it reached production.
- **Five console attack scenarios** against the live instance (stranger inserting `status='published'`, updating someone else's row, calling `review_entry`, inserting into `reviewers`, selecting pending rows) — all blocked by RLS. Recorded in [JOURNAL.md](./JOURNAL.md) Entry 7.
- **`npx tsc --noEmit`, `npm run lint`, `npm run build`** before every commit, plus a production `next start` smoke test of all 7 routes.
- **Dictionary parity enforced by the compiler** — `src/lib/i18n.tsx` uses `satisfies`, so a key missing from either language fails the build (currently 240/240).

The full chronological record of prompts, what came back and what changed before accepting is in [JOURNAL.md](./JOURNAL.md), including the Sprint 3 Prompt Journal.

## 6. Sources and credits

Each entry in the archive carries a "Source / Contributor Name" field, shown on its card, detail page, and in the review queue, so every dish stays attributed to where it came from rather than the app.

> **TODO before submission:** list the actual named sources/credits here (e.g. "Larb Khmer — recipe shared by [Name], Psar Nath market" or "a contributor in Ek Phnom who asked not to be named"), matching the named-with-permission standard from the August capstone brief. The seeded heritage dataset currently credits places (e.g. "Psar Boeung Chhouk noodle stalls," "Sangkae riverside kitchens") rather than named individuals — confirm with the people behind those recipes whether they're comfortable being named, and update `src/data/recipes.ts` / the `source` column accordingly. Also credit any recipe photos that weren't taken by a contributor.

## 7. Running it locally

### Prerequisites

- **Node.js 20 or newer** (developed on v24.15.0). Next.js 16 will not run on Node 18.
- **npm** (developed on 11.12.1). The repo has a `package-lock.json`; there is no bun or pnpm lockfile.
- A **Supabase project** — either your own, or access to the existing one.

### Clone, install, run

```sh
git clone https://github.com/MONYROTH007/Traditional_Food.git
cd Traditional_Food
npm install

# create .env.local first (see below), then:
npm run dev           # http://localhost:3000
```

Other scripts:

```sh
npm run build         # production build
npm run start         # serve the production build
npm run lint          # eslint
npm run format        # prettier --write .
npx tsc --noEmit      # type-check without emitting
```

### Environment variables

Create `.env.local` in the repo root. It is already covered by `.gitignore` (`.env*`) and has never been committed — verify with `git log --all --diff-filter=A --name-only | grep '^\.env'`, which returns nothing.

| Variable                        | Where to find it                                            |
| ------------------------------- | ----------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase dashboard → Project Settings → API → _Project URL_ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Same screen → Project API keys → **`anon` / publishable**   |

No value is printed anywhere in this repo.

**The anon key is public by design.** It is Supabase's _publishable_ client key, meant to ship to the browser — every page here is a client component that talks to Supabase directly, so it is in the served JavaScript by necessity. It is safe only because every table it can reach is behind the Row-Level Security policies in Section 3 and the `review_entry` gate in Section 4. Do **not** add the `service_role` key to this project: it bypasses RLS entirely, and prefixing anything with `NEXT_PUBLIC_` would publish it to every visitor.

### Database setup

The base tables (`entries`, `reviewers`) and the `review_entry` / `is_reviewer` functions were created in the Supabase dashboard. Later schema changes live in [`db/migrations/`](./db/migrations/) and are applied by hand — there is no migration runner.

To apply them: Supabase dashboard → **SQL Editor** → paste the file → **Run**. Use the SQL Editor rather than a contributor login: it runs as `postgres` and bypasses RLS, so published entries keep their status instead of being knocked back to `pending`.

Run them in order — each is idempotent and self-guarding, so re-running one is a no-op:

| File                                   | What it does                                          |
| -------------------------------------- | ----------------------------------------------------- |
| `001_bilingual_entries.sql`            | Adds `ingredients_en`, `steps_en` + length checks     |
| `002_move_english_into_en_columns.sql` | Moves the English bodies into those columns           |
| `003_khmer_recipe_bodies.sql`          | Writes the Khmer ingredients and steps                |
| `004_bilingual_source.sql`             | Adds `source_en` and moves the English credit into it |
| `005_khmer_source_text.sql`            | Writes the Khmer source credits                       |

> The Khmer in `003` and `005` is AI-written translation, not a transcription of what the credited cooks said — see Section 6.

Verify afterwards:

```sql
select left(title, 24) as dish,
       ingredients ~ '[ក-៿]' as body_is_khmer,
       coalesce(btrim(ingredients_en), '') <> '' as has_english,
       source ~ '[ក-៿]' as credit_is_khmer
from public.entries order by created_at;
```

### Becoming a reviewer (to see `/review`)

`/review` returns a 403 unless `is_reviewer()` is true for your session. Sign up through the app, then add your user id to the allowlist from the SQL Editor. The column is `user_id` (confirmed against the live schema):

```sql
insert into public.reviewers (user_id)
select id from auth.users where email = 'you@example.com';
```

Without this, `/review` correctly shows "គ្មានសិទ្ធិចូលមើល (Access Denied)" — that is the gate working, not a bug.

### Deploying

This is a stock Next.js App Router project, so any Next-capable host works. On Vercel: import the repo and set the same two `NEXT_PUBLIC_SUPABASE_*` variables. Note that the project was migrated from a Vite/TanStack Start setup earlier in the semester, so a host still serving that older build will need a fresh deploy from `main`.

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
