import larbKhmer from "@/assets/larb-khmer.jpg";
import meeKola from "@/assets/mee-kola.jpg";
import numBanhChok from "@/assets/num-banh-chok.jpg";
import prahokKtis from "@/assets/prahok-ktis.jpg";
import songVak from "@/assets/song-vak.jpg";
import amokTrey from "@/assets/amok-trey.jpg";
import kralan from "@/assets/kralan.jpg";
import teukKreung from "@/assets/teuk-kreung.jpg";
import lortJrouk from "@/assets/lort-jrouk.jpg";
import type { Recipe, RecipeCategory } from "@/data/recipes";

export type EntryRow = {
  id: string;
  title: string;
  title_en: string | null;
  ingredients: string;
  steps: string;
  // Optional English translations; columns exist only after the bilingual
  // migration (db/migrations) has been applied to the Supabase project.
  ingredients_en?: string | null;
  steps_en?: string | null;
  source: string | null;
  source_en?: string | null;
  photo_url: string | null;
  created_at?: string;
  owner?: string | null;
  status?: "pending" | "published" | "returned" | string | null;
};

/**
 * True when a Supabase insert/update failed because the optional English
 * translation columns have not been added to the database yet. Callers retry
 * the write without those fields so the app keeps working pre-migration.
 */
export function isMissingEnColumnsError(
  error: { code?: string; message?: string } | null | undefined,
): boolean {
  if (!error) return false;
  const columnMissing = error.code === "PGRST204" || error.code === "42703";
  return (
    columnMissing &&
    /ingredients_en|steps_en|source_en/.test(error.message || "")
  );
}

const IMAGE_MAP: Record<string, string> = {
  "larb-khmer": larbKhmer.src,
  "mee-kola": meeKola.src,
  "num-banh-chok": numBanhChok.src,
  "prahok-ktis": prahokKtis.src,
  "song-vak": songVak.src,
  "amok-trey": amokTrey.src,
  kralan: kralan.src,
  "teuk-kreung": teukKreung.src,
  "lort-jrouk": lortJrouk.src,
};

export function resolvePhotoUrl(photoUrl: string | null | undefined): string {
  if (!photoUrl) return numBanhChok.src;
  if (
    photoUrl.startsWith("http://") ||
    photoUrl.startsWith("https://") ||
    photoUrl.startsWith("data:")
  ) {
    return photoUrl;
  }
  for (const [key, src] of Object.entries(IMAGE_MAP)) {
    if (photoUrl.toLowerCase().includes(key)) {
      return src;
    }
  }
  return photoUrl;
}

export function inferCategory(
  title: string,
  titleEn?: string | null,
): RecipeCategory {
  const text = `${title} ${titleEn || ""}`.toLowerCase();
  if (
    text.includes("mee") ||
    text.includes("lort") ||
    text.includes("banh chok") ||
    text.includes("noodle") ||
    text.includes("ឡត") ||
    text.includes("មី") ||
    text.includes("បញ្ចុក")
  ) {
    return "Noodles & Rice";
  }
  if (
    text.includes("teuk kreung") ||
    text.includes("soup") ||
    text.includes("stew") ||
    text.includes("ទឹកគ្រឿង")
  ) {
    return "Soups & Stews";
  }
  if (
    text.includes("kralan") ||
    text.includes("song vak") ||
    text.includes("ក្រឡាន") ||
    text.includes("សង្វាក់")
  ) {
    return "Snacks & Desserts";
  }
  return "Main Dishes";
}

function splitIngredients(text: string | null | undefined): string[] {
  return text
    ? text
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}

function splitSteps(text: string | null | undefined): string[] {
  return text
    ? text
        .split("\n")
        .map((s) => s.trim().replace(/^\d+\.\s*/, ""))
        .filter(Boolean)
    : [];
}

export function mapEntryToRecipe(entry: EntryRow): Recipe {
  const ingredientsList = splitIngredients(entry.ingredients);
  const instructionsList = splitSteps(entry.steps);
  const ingredientsEnList = splitIngredients(entry.ingredients_en);
  const instructionsEnList = splitSteps(entry.steps_en);

  const name = entry.title_en || entry.title;
  const khmer = entry.title;

  // Provenance is stored in both languages; `recipeMeta()` picks one at
  // render time rather than freezing a language in here.
  const source = entry.source?.trim() || null;
  const sourceEn = entry.source_en?.trim() || null;

  return {
    id: entry.id,
    name,
    khmer,
    category: inferCategory(khmer, name),
    source,
    sourceEn,
    image: resolvePhotoUrl(entry.photo_url),
    ingredients: ingredientsList,
    instructions: instructionsList,
    ingredientsEn: ingredientsEnList,
    instructionsEn: instructionsEnList,
    owner: entry.owner ?? null,
    status: entry.status ?? "pending",
  };
}

export type EntryStatus = "pending" | "published" | "returned";

/** Normalizes any stored status value to one of the three known statuses. */
export function normalizeStatus(
  status: string | null | undefined,
): EntryStatus {
  return status === "published" || status === "returned" ? status : "pending";
}

/** Tailwind classes for a status badge. Labels come from the i18n layer. */
export function getStatusBadgeClass(status: string | null | undefined): string {
  switch (normalizeStatus(status)) {
    case "published":
      return "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
    case "returned":
      return "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400";
    default:
      return "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400";
  }
}
