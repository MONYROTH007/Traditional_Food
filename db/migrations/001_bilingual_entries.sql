-- Bilingual recipe content: optional English translations of the two long
-- text fields. The Khmer original stays in `ingredients` / `steps` and is
-- always required; these columns are nullable so existing entries remain
-- valid and contributors can add a translation later.
--
-- HOW TO RUN
--   Supabase dashboard → SQL Editor → paste this file → Run.
--   Safe to run more than once (every statement is IF NOT EXISTS / idempotent).
--
-- The app tolerates these columns being absent: contribute and edit retry the
-- write without them if the migration has not been applied yet. After running
-- this, translations save normally with no code change.

-- 1. Add the translation columns -------------------------------------------

alter table public.entries
  add column if not exists ingredients_en text,
  add column if not exists steps_en       text;

comment on column public.entries.ingredients_en is
  'Optional English translation of ingredients. NULL means "no translation yet" and the app falls back to the Khmer original.';
comment on column public.entries.steps_en is
  'Optional English translation of steps. NULL means "no translation yet" and the app falls back to the Khmer original.';

-- 2. Length limits matching the client-side validation ----------------------
-- Allow NULL (no translation) but cap length when a translation is present,
-- mirroring the 2000 / 3000 character limits enforced in the forms.

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'check_entries_ingredients_en'
  ) then
    alter table public.entries
      add constraint check_entries_ingredients_en
      check (ingredients_en is null or char_length(ingredients_en) <= 2000);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'check_entries_steps_en'
  ) then
    alter table public.entries
      add constraint check_entries_steps_en
      check (steps_en is null or char_length(steps_en) <= 3000);
  end if;
end $$;

-- 3. Row-Level Security -----------------------------------------------------
-- No policy changes are needed. RLS on `entries` is row-scoped, not
-- column-scoped, so the existing SELECT / INSERT / UPDATE / DELETE policies
-- already cover the new columns:
--   - public reads still limited to status = 'published'
--   - writes still limited to auth.uid() = owner
--   - publishing still gated by the review_entry RPC
-- Verify the policies are intact after running this:
--
--   select policyname, cmd, qual, with_check
--   from pg_policies
--   where schemaname = 'public' and tablename = 'entries'
--   order by cmd;

-- 4. Confirm the migration applied ------------------------------------------
--
--   select column_name, data_type, is_nullable
--   from information_schema.columns
--   where table_schema = 'public'
--     and table_name = 'entries'
--     and column_name in ('ingredients_en', 'steps_en');
--
-- Expect two rows, both text and nullable (YES).
