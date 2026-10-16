# Engineering Development Journal: Traditional Khmer Recipes

**Project:** Traditional Khmer Recipes (Battambang Province Archive)  
**Live URL:** https://traditional-khmer-food.lovable.app  
**Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Supabase (Auth, Postgres DB, Storage, RLS)

---

## Overview & Process Standards

This journal documents the design, architecture, and implementation decisions made across **Sprint 1** and **Sprint 2** of the Traditional Khmer Food archive. In accordance with project standards:
- **Small, atomic commits** with clear separation of concerns.
- **AI-assisted contributions** are explicitly recorded and marked.
- **Zero secrets in Git**: Environment variables (`.env*`) remain strictly local and untracked; only public client-side keys (`NEXT_PUBLIC_`) are used in build targets.
- **First-class Khmer script**: Every user interaction, data model, typography definition, and search filter treats Khmer text as a first-class citizen.
- **Strict Row-Level Security (RLS)**: Data isolation is enforced at the database and storage level, ensuring Contributor A cannot edit or delete Contributor B's entries through the UI or the REST API.

---

## Chronological Work Journal

### Entry 1: Sprint 1 Foundation — Design System & Heritage Dishes
* **Date:** September 4–11, 2026  
* **Focus:** Visual identity, typography, Battambang recipe data, and responsive layout.  
* **AI Assistance:** AI-assisted CSS design tokens, layout scaffolding, and recipe dataset compilation.  
* **Decisions & Implementation:**
  1. *Aesthetics & Typography:* Avoided generic modern corporate styling in favor of warm earth tones, parchment textures, and traditional Cambodian accents. Integrated Google Fonts `Battambang` for clean body typography and `Moul` for authentic Khmer display titles, paired with `Cormorant Garamond` for classical elegance.
  2. *Initial Heritage Dataset:* Compiled 9 traditional recipes native to Battambang province (*Larb Khmer, Mee Kola, Teuk Kreung, Num Banh Chok, Prahok Ktis, Lort Jrouk, Kralan, Song Vak, Amok Trey*). Preserved traditional cooking notes, ingredient lists, and local origins (e.g., Psar Boeung Chhouk, Ek Phnom, Sangker).
  3. *Client-side Browsing & Search:* Implemented category filtering (*"Soups & Stews", "Main Dishes", "Noodles & Rice", "Snacks & Desserts"*) and real-time search across Khmer titles, English titles, notes, and ingredients.
  4. *Pagination:* Enforced 6 items per page with clear controls to allow browsing the full 9-item archive without overwhelming the viewport.

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
     * Automatic fallback to `signInWithPassword` upon signup to ensure strangers are instantly authenticated without manual confirmation friction.
     * Accessible login page with clear error handling for invalid credentials.
  2. *Recipe Contribution (`/contribute`):*
     * Created dual-tab interface: "My Recipes" (personal collection) and "Add Recipe" (contribution form).
     * **Validation:** Enforced Khmer title requirement via regex `[\u1780-\u17FF]`, mandatory ingredient list (10–2000 chars), step descriptions (20–3000 chars), and required dish photo.
     * **Photo Uploads:** Integrated Supabase Storage `photos` bucket. Images are validated for MIME type (`image/jpeg`, `image/png`, `image/webp`) and capped at 5 MB. Files are stored at `{user_id}/{uuid}.{ext}` to guarantee folder isolation by user.
     * **Immediate Archive Feedback:** Newly created recipes are ordered by `created_at DESC` and immediately show up on Page 1 of the public archive (`/recipes`).

---

### Entry 4: Sprint 2 Security — Strict Row Level Security (RLS) & Authorization
* **Date:** October 9, 2026  
* **Focus:** Preventing Contributor A from modifying Contributor B's recipes; community notes; pagination accessibility.  
* **AI Assistance:** AI-assisted RLS policy authoring, UI authorization gating, and edge-case testing.  
* **Decisions & Implementation:**
  1. *Database Row-Level Security (`entries` table):*
     * `SELECT`: Enabled for `public` (`true`) so visitors and search engines can freely read all archive recipes.
     * `INSERT`: Enabled for `authenticated` users, checking that `auth.uid() = owner`.
     * `UPDATE`: Restricted strictly to `auth.uid() = owner`.
     * `DELETE`: Restricted strictly to `auth.uid() = owner`.
  2. *Storage Security (`photos` bucket):*
     * `SELECT`: Public access enabled so visitors can view uploaded dish pictures.
     * `INSERT`: Allowed only when the upload path starts with the authenticated user's ID (`(storage.foldername(name))[1] = auth.uid()::text`).
     * `UPDATE` / `DELETE`: Restricted to files where the top-level folder matches `auth.uid()::text`.
  3. *UI Authorization Enforcement:*
     * On [RecipeCard.tsx](file:///Users/mac/Documents/AUPP/fall2026/Traditional_Food/src/components/RecipeCard.tsx), "Edit" and "Delete" buttons are only rendered when `user?.id === recipe.owner`.
     * Direct navigation to `/recipes/[id]/edit` checks ownership against Supabase. Non-owners are presented with an **"Access Denied"** shield and cannot access or submit the edit form.
     * Deletions on `/recipes/[id]` require confirmation and verify that rows were returned from `delete().select()`. If RLS blocks the operation, a user-friendly error message is surfaced ("That change wasn't saved").
  4. *Public Browsing Verification:* Removed any residual auth wall on pagination pages so strangers can browse all pages freely without being prompted to log in.

---

### Entry 5: Verification, Live Testing & Final Polish
* **Date:** October 16, 2026  
* **Focus:** Automated multi-account RLS validation, guest navigation affordance, and comprehensive documentation.  
* **AI Assistance:** AI-assisted automated API testing script, navigation refinement, and documentation generation.  
* **Decisions & Implementation:**
  1. *Automated Multi-Account Verification:*
     * Executed automated tests using two distinct contributor accounts (Contributor A and Contributor B) against the live Supabase instance:
       * Contributor A successfully created a new entry with Khmer script and photo URL.
       * Stranger / unauthenticated request successfully queried and retrieved the entry from the public archive.
       * Contributor B attempted a direct `PATCH` on Contributor A's entry via the REST API: RLS blocked the write (`0 rows affected`, status 200).
       * Contributor B attempted a direct `DELETE` on Contributor A's entry via the REST API: RLS blocked the deletion (`0 rows affected`, status 200).
       * Verified entry remained intact. Contributor A then successfully deleted their own entry.
       * Contributor B attempted to write/delete in Contributor A's storage folder: Supabase returned HTTP 403 Forbidden (`AccessDenied`).
  2. *Navigation Enhancements:*
     * Added responsive navbar state: shows `"Contribute"` for unauthenticated visitors and `"My Recipes"` for logged-in contributors.
     * Added direct `"Contribute Recipe"` action button on `/recipes` header to make contribution easily discoverable for guests.
     * Enhanced `/contribute` unauthenticated landing copy to clearly explain the benefits of joining and submitting a recipe.
     * Added a direct `"See in Public Archive →"` link upon successful recipe submission for immediate feedback.

---

## Security & Integrity Summary

1. **No Secrets in Repository:**
   * Audited `git log --all -p`. No `.env*` or `.env.local` files exist in Git history.
   * Only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are used in code, which are safe public client keys.
2. **Khmer Language Support:**
   * Fonts: `Battambang` (400, 700) and `Moul` (headings).
   * Unicode Range: `\u1780-\u17FF` verified in input validation, storage, and search indexes.
3. **Authorization Guarantee:**
   * Both frontend UI guards and backend Supabase PostgreSQL RLS policies enforce that users can only modify or delete rows where `owner = auth.uid()`.
