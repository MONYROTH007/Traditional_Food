-- Make the source / provenance credit bilingual.
--
-- WHY
--   `source` is the attribution field: it names the person, family, market or
--   village a dish came from, and it is rendered twice on every card ("From"
--   and "Contributed by"). It held English only, so a Khmer reader saw an
--   English credit — the same problem the recipe bodies had.
--
--   This follows the convention already used for the bodies:
--     source      Khmer original  (authoritative)
--     source_en   English version (optional)
--
--   The app shows the reader's language and falls back to whichever text
--   exists, so a missing translation never renders as a blank credit.
--
-- SAFETY
--   Idempotent. The column add is IF NOT EXISTS; the copy only touches a row
--   whose source_en is empty and whose source has Latin letters and no Khmer,
--   so re-running it, or running it after the Khmer is written, is a no-op.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL Editor -> paste -> Run. Then run 005.

begin;

alter table public.entries
  add column if not exists source_en text;

comment on column public.entries.source_en is
  'Optional English version of the source/provenance credit. NULL means no translation yet; the app falls back to `source`.';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'check_entries_source_en'
  ) then
    alter table public.entries
      add constraint check_entries_source_en
      check (source_en is null or char_length(source_en) <= 150);
  end if;
end $$;

-- Move the existing English credit into source_en, so `source` is free to
-- hold the Khmer that 005 writes.
update public.entries
set source_en = source
where coalesce(btrim(source_en), '') = ''
  and source is not null
  and source !~ '[ក-៿]'
  and source ~ '[A-Za-z]';

commit;

-- VERIFY
--   select left(title,24) as dish, source, source_en from public.entries
--   order by created_at;
