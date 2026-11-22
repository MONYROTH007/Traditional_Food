-- Stage the mis-filled recipe bodies into the right columns.
--
-- WHY
--   An audit of the 10 published entries found the body columns inverted
--   against the schema's intent:
--
--     title           Khmer    <- correct
--     title_en        English  <- correct
--     ingredients     ENGLISH  <- should hold the Khmer original
--     ingredients_en  empty    <- should hold the English translation
--     steps           ENGLISH  <- should hold the Khmer original
--     steps_en        empty    <- should hold the English translation
--
--   The cause was the contribute form: it labelled the title "Dish Name in
--   Khmer" (so every title is correctly Khmer) but labelled the bodies just
--   "Ingredients" / "Cooking Steps", so contributors filled them in English.
--   The labels now state the language; this migration fixes the rows already
--   stored.
--
-- WHAT THIS DOES
--   Copies the English body text into the *_en columns, where it belongs.
--   It does NOT blank the base columns: `ingredients` and `steps` are
--   required and length-checked, and there is no Khmer text to put there
--   yet. Until step 2 below, Khmer readers still see the English text —
--   this migration makes the data honest, not yet complete.
--
-- SAFETY
--   Idempotent and self-guarding. A row is only touched when its *_en
--   column is empty AND its base column contains Latin letters and no Khmer
--   at all. Re-running it, or running it after the Khmer has been written,
--   changes nothing.
--
-- HOW TO RUN
--   Supabase dashboard -> SQL Editor -> paste -> Run.

begin;

update public.entries
set ingredients_en = ingredients
where coalesce(btrim(ingredients_en), '') = ''
  and ingredients is not null
  and ingredients !~ '[ក-៿]'      -- contains no Khmer at all
  and ingredients ~ '[A-Za-z]';    -- and does contain Latin letters

update public.entries
set steps_en = steps
where coalesce(btrim(steps_en), '') = ''
  and steps is not null
  and steps !~ '[ក-៿]'
  and steps ~ '[A-Za-z]';

commit;

-- VERIFY: every row should now report has_khmer_* = false and
-- has_en_* = true. That is the expected state after step 1.
--
--   select
--     left(title, 24)                        as dish,
--     ingredients ~ '[ក-៿]'                  as ingredients_has_khmer,
--     coalesce(btrim(ingredients_en),'') <> '' as has_ingredients_en,
--     steps ~ '[ក-៿]'                        as steps_has_khmer,
--     coalesce(btrim(steps_en),'') <> ''     as has_steps_en
--   from public.entries
--   order by created_at;

-- STEP 2 — still outstanding, and it is content work, not a migration.
--   The Khmer bodies do not exist anywhere: they were never written. Once a
--   Khmer version of a dish is available, write it into the base column, one
--   dish at a time:
--
--     update public.entries
--     set ingredients = $khmer$<Khmer ingredients, one per line>$khmer$,
--         steps       = $khmer$<Khmer steps, one per line>$khmer$
--     where id = '<uuid>';
--
--   Use $khmer$...$khmer$ dollar quoting so apostrophes in the text do not
--   need escaping. After that the archive reads correctly in both languages:
--   Khmer from the base columns, English from the *_en columns.
