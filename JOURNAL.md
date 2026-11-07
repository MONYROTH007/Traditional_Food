# Engineering Development Journal: Traditional Khmer Recipes

**Project:** Traditional Khmer Recipes (Battambang Province Archive)  
**Live Application:** https://traditional-khmer-food.lovable.app  
**Stack:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Supabase (Auth, Postgres DB, Storage, RLS, RPC)

---

## Overview & Process Standards

This journal documents the design, architecture, security, and implementation decisions made across **Sprint 1**, **Sprint 2**, and **Sprint 3** of the Traditional Khmer Food archive. In accordance with project standards:
- **Small, atomic commits** with clear separation of concerns.
- **AI-assisted contributions** are explicitly recorded and marked.
- **Zero secrets in Git**: Environment variables (`.env*`) remain strictly local and untracked; only public client identifiers are used in build targets.
- **First-class Khmer script**: Every user interaction, data model, typography definition, and search filter treats Khmer text as a first-class citizen.
- **Strict Row-Level Security (RLS) & RPC Gates**: Security is enforced at the database layer. Strangers cannot publish their own entries, bypass the review queue, mutate other contributors' entries, or access reviewer-only operations.

---

## Chronological Work Journal

### Entry 1: Sprint 1 Foundation — Design System & Heritage Dishes
* **Date:** September 4–11, 2026  
* **Focus:** Visual identity, typography, Battambang recipe dataset, and responsive layout.  
* **AI Assistance:** AI-assisted CSS design tokens, layout scaffolding, and recipe dataset compilation.  
* **Decisions & Implementation:**
  1. *Aesthetics & Typography:* Avoided generic modern corporate styling in favor of warm earth tones, parchment textures, and traditional Cambodian accents. Integrated Google Fonts `Battambang` for clean body typography and `Moul` for authentic Khmer display titles, paired with `Cormorant Garamond` for classical elegance.
  2. *Initial Heritage Dataset:* Compiled 9 traditional recipes native to Battambang province (*Larb Khmer, Mee Kola, Teuk Kreung, Num Banh Chok, Prahok Ktis, Lort Jrouk, Kralan, Song Vak, Amok Trey*). Preserved traditional cooking notes, ingredient lists, and local origins (e.g., Psar Boeung Chhouk, Ek Phnom, Sangker).
  3. *Client-side Browsing & Search:* Implemented category filtering (*"Soups & Stews", "Main Dishes", "Noodles & Rice", "Snacks & Desserts"*) and real-time search across Khmer titles, English titles, notes, and ingredients.
  4. *Pagination:* Enforced 6 items per page with clear controls to allow browsing the full archive without overwhelming the viewport.

---

### Entry 2: Supabase Architecture & Database Migration
* **Date:** September 15–25, 2026  
* **Focus:** Data persistence, moving static recipes into Supabase Postgres, and client setup.  
* **AI Assistance:** AI-assisted SQL schema modeling, `@supabase/ssr` client integration, and mapping utilities.  
* **Decisions & Implementation:**
  1. *Database Schema (`entries` table):*
     * `id`: `uuid` primary key with `gen_random_uuid()` default.
     * `title`: `text` (Khmer dish name, required, validated for Khmer Unicode characters).
     * `title_en`: `text` (optional English name).
     * `ingredients`: `text` (required, line-separated).
     * `steps`: `text` (required, step-by-step instructions).
     * `source`: `text` (provenance / village notes).
     * `photo_url`: `text` (URL pointing to Supabase Storage or asset resolution map).
     * `owner`: `uuid` references `auth.users(id)`.
     * `status`: `text` default `'pending'`.
     * `created_at`: `timestamptz` default `now()`.
  2. *Check Constraints:* Implemented database-level check constraints (`check_entries_steps`, character length limits) to maintain high data quality for both English and Khmer text.
  3. *Mapping Layer (`src/utils/entries.ts`):* Created `mapEntryToRecipe` and `resolvePhotoUrl` so database entries seamlessly map to the frontend presentation model while preserving fallback image mapping for seeded recipes.

---

### Entry 3: Sprint 2 Core — Authentication & Recipe Contribution with Storage
* **Date:** October 4, 2026  
* **Focus:** Stranger registration, login, multi-part form submission with photo uploads, and user dashboard.  
* **AI Assistance:** AI-assisted authentication flow wiring, Supabase Storage integration, and client-side validation logic.  
* **Decisions & Implementation:**
  1. *Authentication Flow (`/signup` & `/login`):*
     * Clean signup form capturing Full Name, Email, and Password with confirm verification.
     * Instant session creation upon signup to ensure strangers are authenticated without manual confirmation friction.
     * Accessible login page with clear error handling for invalid credentials.
  2. *Recipe Contribution (`/contribute`):*
     * Enforced Khmer title requirement via regex `[\u1780-\u17FF]`, mandatory ingredient list (10–2000 chars), step descriptions (20–3000 chars), and required dish photo.
     * Integrated Supabase Storage `photos` bucket. Images validated for MIME type (`image/jpeg`, `image/png`, `image/webp`) and capped at 5 MB. Files are stored at `{user_id}/{uuid}.{ext}` to guarantee folder isolation by user.

---

### Entry 4: Sprint 2 Security — Strict Row Level Security (RLS) & Authorization
* **Date:** October 9, 2026  
* **Focus:** Preventing Contributor A from modifying Contributor B's recipes; community notes; pagination accessibility.  
* **AI Assistance:** AI-assisted RLS policy authoring, UI authorization gating, and edge-case testing.  
* **Decisions & Implementation:**
  1. *Database Row-Level Security (`entries` table):*
     * `SELECT`: Enabled for `public` with `status = 'published'` or `owner = auth.uid()`.
     * `INSERT`: Enabled for `authenticated` users, checking that `auth.uid() = owner`.
     * `UPDATE`: Restricted strictly to `auth.uid() = owner`.
     * `DELETE`: Restricted strictly to `auth.uid() = owner`.
  2. *Storage Security (`photos` bucket):*
     * `SELECT`: Public access enabled so visitors can view uploaded dish pictures.
     * `INSERT`: Allowed only when the upload path starts with the authenticated user's ID (`(storage.foldername(name))[1] = auth.uid()::text`).
     * `UPDATE` / `DELETE`: Restricted to files where the top-level folder matches `auth.uid()::text`.
  3. *UI Authorization Enforcement:*
     * On `RecipeCard.tsx`, "Edit" and "Delete" buttons are only rendered when `user?.id === recipe.owner`.
     * Direct navigation to `/recipes/[id]/edit` checks ownership against Supabase. Non-owners are presented with an "Access Denied" shield and cannot access or submit the edit form.

---

### Entry 5: Sprint 2 Verification, Live Testing & Navigation Polish
* **Date:** October 16, 2026  
* **Focus:** Automated multi-account RLS validation, guest navigation affordance, and comprehensive documentation.  
* **AI Assistance:** AI-assisted automated API testing script, navigation refinement, and documentation generation.  
* **Decisions & Implementation:**
  1. *Automated Multi-Account Verification:* Tested Contributor A and Contributor B. Confirmed Contributor B cannot PATCH or DELETE Contributor A's entries via UI or REST API.
  2. *Navigation Enhancements:* Added responsive navbar links and direct CTAs for guest discovery.

---

### Entry 6: Sprint 3 Core — Review Queue, Curation & Contributor Dashboard
* **Date:** October 23–30, 2026  
* **Focus:** Gatekeeping recipes through a review queue, role-based moderator access, and contributor entry tracking.  
* **AI Assistance:** AI-assisted ReviewQueue component, status mapping, and reviewer RPC integration.  
* **Decisions & Implementation:**
  1. *Reviewer Role & Access Control:*
     * Authorized kitchen reviewers are registered in the `reviewers` database table.
     * Dedicated Postgres function `is_reviewer()` checks whether the calling user is in the reviewers table.
     * `/review` route verifies reviewer privileges on both the server and client. Unauthorized users receive a clean `403 Forbidden` screen ("គ្មានសិទ្ធិចូលមើល / Access Denied").
  2. *Review Queue Flow (`/review`):*
     * Pending recipes are displayed chronologically (oldest first) with photo preview, Khmer/English dish names, ingredient lists, and cooking methods.
     * Actions: "អនុម័ត និងផ្សាយ (Approve & Publish)" or "បដិសេធ (Reject / Return)".
     * Decisions are processed via `supabase.rpc('review_entry', { entry_id, decision })`, strictly requiring `data === true` to treat the review action as successful.
  3. *Contributor Status Dashboard (`/my-entries`):*
     * Contributors can view all their submitted dishes with bilingual badges:
       - **Published / បានផ្សព្វផ្សាយ** (green)
       - **Pending Review / កំពុងរង់ចាំការពិនិត្យ** (amber)
       - **Returned for Revisions / បានប្រគល់ត្រឡប់មកវិញ** (rose)
     * For returned entries, clear actionable banners instruct authors to edit and resubmit their dishes for another round of review.

---

### Entry 7: Sprint 3 Review, Triage & Post-Review Hardening
* **Date:** November 7, 2026  
* **Focus:** Sprint 3 Review Checklist execution, 5-attack security verification, triage, and bug fixes.  
* **AI Assistance:** Automated live test scripts, diff review, and error flow hardening.  
* **Decisions & Implementation:**
  1. *Security Audit (Lab 10 Part 4 Attacks Re-run):*
     * Executed all five console attacks against the live Supabase instance:
       - **Attack 1 (Stranger insert status='published'):** Blocked by RLS (`new row violates row-level security policy`).
       - **Attack 2 (Stranger update status='published'):** Blocked by RLS (`new row violates row-level security policy`).
       - **Attack 3 (Stranger call `review_entry` RPC):** Blocked safely (returned `false`).
       - **Attack 4 (Stranger insert into `reviewers`):** Blocked by RLS (`new row violates row-level security policy`).
       - **Attack 5 (Stranger select pending entries):** Blocked by RLS (returns 0 rows).
     * Confirmed: Zero attacks returned rows or `true`.
  2. *Triage & Code Hardening:*
     * **Resubmission Gate Fix (`app/recipes/[id]/edit/page.tsx`):** Ensured that updating an entry unconditionally sets `status: 'pending'`, so that returned dishes can be revised and resubmitted without violating RLS `WITH CHECK (status = 'pending')`.
     * **Bilingual Status Banner (`app/recipes/[id]/page.tsx`):** Added clear curation status notices on recipe detail pages for entry owners so they know why their pending recipe is waiting for review before appearing on the public shelf.
     * **Public Queries Audit:** Verified `.eq('status', 'published')` on `app/page.tsx` and `app/recipes/page.tsx` so only approved recipes appear in public browse and search.
     * **Test Entry Cleanliness:** Identified test entry `"waiting politely ឡាប"` on the shelf for table cleanup.

---

## Sprint 3 Reflection

### 1. What you built or improved since Sprint 2 and which workflow decision was yours
Since Sprint 2, we transitioned the archive from immediate self-publishing to a curated heritage collection. We built:
- The **Kitchen Review Queue (`/review`)** where authorized reviewers evaluate submissions from Battambang province.
- The **Contributor Dashboard (`/my-entries`)** showing clear, real-time status badges (*Published*, *Pending Review*, *Returned for Revisions*).
- Server-authoritative **`review_entry` RPC** and **`is_reviewer` RPC** integration.
- **Workflow Decision:** The decision to make curation status completely transparent to contributors via a dedicated `/my-entries` screen was mine. Instead of letting pending recipes silently wait or showing generic "Recipe Not Found" errors, contributors are guided with clear bilingual explanations and an explicit edit-and-resubmit pathway for returned entries.

### 2. Which security risk you closed and where the AI got it wrong
- **Security Risk Closed:** Prevented unauthorized publication ("skipping the review queue") and escalation of privilege. Strangers and normal contributors cannot set their own or others' entries to `published`, cannot access pending submissions, and cannot call review functions.
- **Where the AI Got It Wrong:** The AI initially assumed that the review UI could perform direct updates on the `entries` table (`supabase.from('entries').update({ status: decision })`) and didn't strictly check `data === true` on RPC responses, erroneously assuming that a lack of network error implied the entry was approved. Furthermore, when generating the edit page, the AI omitted `status: 'pending'` on updates, which broke resubmissions for returned recipes under Postgres RLS `WITH CHECK` policies. We corrected these by enforcing `review_entry` RPC with strict `data === true` validation and setting `status: 'pending'` on all recipe updates.

### 3. What's still unresolved and what fixing it would take
- **Still Unresolved:** Reviewer revision feedback text. Currently, when a reviewer marks an entry as `returned`, the status updates to `returned`, but there is no specific field to store the curator's feedback explaining *why* the dish was returned (e.g. missing measurements for kroeung paste, inaccurate photo, or unclear instructions).
- **What Fixing It Would Take:**
  1. Add a `feedback` / `reviewer_notes` column (`text`) to the `entries` table.
  2. Update the `review_entry(entry_id uuid, decision text, feedback text default null)` RPC function to store the feedback note upon returning an entry.
  3. Add a feedback modal or note input inside `ReviewQueue.tsx` when the reviewer clicks "បដិសេធ (Reject / Return)".
  4. Render the curator's feedback note inside the "Revisions Requested" alert banner on `/my-entries` and `/recipes/[id]`.

---

### Entry 8: Client Feedback & Contributor Attribution
* **Date:** November 7, 2026  
* **Focus:** Addressing review feedback: displaying recipe contributors throughout the app and maintaining strict atomic commit standards.  
* **AI Assistance:** AI-assisted model extension, UI component attribution badges, and form defaults.  
* **Decisions & Implementation:**
  1. *Contributor Attribution System:*
     - Added `contributor` attribute to the `Recipe` TypeScript model and updated `mapEntryToRecipe` to map `entry.source` to the contributor name with fallback to `"Battambang Heritage Kitchen"`.
     - Surfaced contributor credit on `RecipeCard.tsx` (both card preview and modal), recipe detail page (`/recipes/[id]`), `ReviewQueue.tsx`, and `/my-entries`.
     - In `/contribute` and `/recipes/[id]/edit`, labeled the provenance input as `"Source / Contributor Name (ប្រភព ឬ ឈ្មោះអ្នករួមចំណែក)"` and auto-populated the submitter's full name if left blank so future submissions are automatically credited to the author.
  2. *Atomic Commit Discipline:*
     - Split work into focused, granular commits (`feat: ... (AI-assisted)`) rather than large monolithic bundles, addressing client feedback regarding commit sizing.

---

## Sprint 3 Prompt Journal

### Prompt Entry 1: Review Queue Server Gating & Decision RPC
* **The prompt as you sent it:**  
  `"Build the review queue page for authorized curators at /review. On the server, verify the user with supabase.rpc('is_reviewer'). If not authorized, return a 403 Access Denied screen with no entries. For reviewers, fetch pending entries ordered oldest first, render a card with dish photo, Khmer title, English title, ingredients, steps, and source. Add two action buttons: 'Approve & Publish' and 'Reject / Return'. When clicked, update the entries table status column directly to 'published' or 'returned'."`
* **The technique by name:**  
  *Constraint Specification with Role Gating* (Explicitly defining server-side RPC authentication, route gating, chronological sorting constraints, and UI presentation layout).
* **What came back:**  
  The AI produced the page layout and `ReviewQueue` component, but directly called `supabase.from('entries').update({ status: decision })` from the client.
* **What you changed before accepting:**  
  Rejected the direct `entries.update()` because client-side status updates violate RLS policies and allow attackers to bypass review. Replaced it with `supabase.rpc('review_entry', { entry_id, decision })` and added a strict check verifying `data === true` before updating local state.

---

### Prompt Entry 2: Contributor Resubmission & Edit Form
* **The prompt as you sent it:**  
  `"In app/recipes/[id]/edit/page.tsx, contributors whose recipes were returned need to edit and resubmit their entries. When saving edits, update the recipe title, English title, ingredients, steps, source, and dish photo. If the user is not a reviewer, make sure the status is reset to 'pending' so it goes back into the curation queue. Check that a row is returned from update and handle error states gracefully in Khmer and English."`
* **The technique by name:**  
  *Critique & Self-Correction (Bug Reproduction & Constraint Enforcement)* (Targeting the specific failure mode where returned recipes failed to save under Postgres RLS `WITH CHECK` policies).
* **What came back:**  
  The AI implemented the form update, but wrapped the status assignment in `if (!isReviewer) { updatePayload.status = "pending"; }` and returned a bare English message `"That change wasn't saved"` on failure without explaining what happened.
* **What you changed before accepting:**  
  Unconditionally set `updatePayload.status = "pending"` for all edits so any resubmission cleanly resets to pending review and satisfies RLS `WITH CHECK (status = 'pending')`. Replaced the English error message with a bilingual alert: `"មិនអាចរក្សាទុកការកែប្រែបានទេ (That change wasn't saved. Please check your inputs and try again.)"` and redirected the author to `/my-entries` to view the updated status badge.

---

### Prompt Entry 3: Contributor Attribution & Metadata Display
* **The prompt as you sent it:**  
  `"We need to display who contributed each recipe across the entire archive. Update RecipeCard, the recipe detail page, the review queue, and My Entries to show 'Contributed by: [Name/Provenance]'. In app/contribute/page.tsx, if the contributor doesn't fill in the source/provenance field, automatically fallback to their account full name from auth metadata so credit is preserved."`
* **The technique by name:**  
  *Decomposed Multi-File Implementation (Step-by-Step Context Augmentation)* (Guiding changes through data models, UI presentation components, and form handlers simultaneously).
* **What came back:**  
  The AI updated the components, but introduced duplicate imports in `app/my-entries/page.tsx` (`User` from `lucide-react` conflicted with `type { User } from '@supabase/supabase-js'`), causing TypeScript compilation to fail during `next build`.
* **What you changed before accepting:**  
  Aliased the icon import as `User as UserIcon` in `app/my-entries/page.tsx` to fix TypeScript compilation. Added fallback logic `entry.source || "Battambang Heritage Kitchen"` in `src/utils/entries.ts` so seeded heritage dishes display authentic provenance rather than blank space.


