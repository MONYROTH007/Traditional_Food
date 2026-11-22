-- Khmer text for the source / provenance credit.
--
-- Run 004 first: it adds `source_en` and moves the existing English credit
-- into it. This fills `source` with the Khmer, so a Khmer reader sees a Khmer
-- credit and an English reader sees the original English.
--
-- PROVENANCE -- PLEASE READ
--   These are translations of the stored English credits, written by an AI
--   assistant. They name real Battambang places (Wat Kor, Ek Phnom, Psar
--   Nath, Psar Boeung Chhouk, the Sangkae river, National Road 5). Since this
--   archive credits real people and places, have a Khmer speaker confirm the
--   spellings before publishing -- particularly the village and market names.
--
--   Nothing is lost either way: the English stays in `source_en`.

begin;

-- Battambang Somlar Machu Kroeung  (Family recipe from Wat Kor village)
update public.entries
set source = $km$រូបមន្តគ្រួសារពីភូមិវត្តគរ$km$
where id = '90de28ba-56d6-4523-b69b-f537798b6c68'
  and coalesce(btrim(source_en), '') <> '';

-- Kralan  (Roadside stalls on National Road 5)
update public.entries
set source = $km$តូបលក់តាមដងផ្លូវជាតិលេខ ៥$km$
where id = '567945a4-ca3f-4b5b-ab12-8315b321e306'
  and coalesce(btrim(source_en), '') <> '';

-- Song Vak  (Sangkae riverside kitchens)
update public.entries
set source = $km$ផ្ទះបាយតាមមាត់ទន្លេសង្កែ$km$
where id = '222de980-0f43-472a-adbf-b96bcfdf7fe5'
  and coalesce(btrim(source_en), '') <> '';

-- Lort Jrouk  (Psar Boeung Chhouk noodle stalls)
update public.entries
set source = $km$តូបលក់មីនៅផ្សារបឹងឈូក$km$
where id = '5d19e2cf-5a29-43bb-a0a4-21be769c26a4'
  and coalesce(btrim(source_en), '') <> '';

-- Larb Khmer  (Family tables across Battambang town)
update public.entries
set source = $km$តុបាយគ្រួសារក្នុងក្រុងបាត់ដំបង$km$
where id = 'e1041cbc-1464-4bbe-a805-cdcb2034a553'
  and coalesce(btrim(source_en), '') <> '';

-- Mee Kola  (Psar Boeung Chhouk noodle stalls)
update public.entries
set source = $km$តូបលក់មីនៅផ្សារបឹងឈូក$km$
where id = 'e034e98b-e7dd-4f4d-ac1c-01a0cfce67e5'
  and coalesce(btrim(source_en), '') <> '';

-- Teuk Kreung  (Ek Phnom village homes)
update public.entries
set source = $km$ផ្ទះអ្នកភូមិឯកភ្នំ$km$
where id = '0a329ecd-679c-4686-bebc-6b99976dcf3a'
  and coalesce(btrim(source_en), '') <> '';

-- Num Banh Chok  (Psar Nath morning market)
update public.entries
set source = $km$ផ្សារណាត់ពេលព្រឹក$km$
where id = '0007751f-10b3-4606-86e6-e34d24794a0f'
  and coalesce(btrim(source_en), '') <> '';

-- Prahok Ktis  (Battambang town family tables)
update public.entries
set source = $km$តុបាយគ្រួសារក្រុងបាត់ដំបង$km$
where id = '69007520-6e03-4845-a5ba-25e2f6051ff7'
  and coalesce(btrim(source_en), '') <> '';

-- Amok Trey  (Sangkae riverside kitchens)
update public.entries
set source = $km$ផ្ទះបាយតាមមាត់ទន្លេសង្កែ$km$
where id = 'd6af4909-d64b-43cb-8f56-0d67c77563c6'
  and coalesce(btrim(source_en), '') <> '';

commit;

-- VERIFY: source_is_khmer should be true and has_english true for all rows.
--
--   select left(title,24) as dish,
--          source ~ '[ក-៿]' as source_is_khmer,
--          coalesce(btrim(source_en),'') <> '' as has_english,
--          source, source_en
--   from public.entries order by created_at;
