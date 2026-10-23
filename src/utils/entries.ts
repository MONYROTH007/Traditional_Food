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
  source: string | null;
  photo_url: string | null;
  created_at?: string;
  owner?: string | null;
  status?: "pending" | "published" | "returned" | string | null;
};

const IMAGE_MAP: Record<string, string> = {
  "larb-khmer": larbKhmer.src,
  "mee-kola": meeKola.src,
  "num-banh-chok": numBanhChok.src,
  "prahok-ktis": prahokKtis.src,
  "song-vak": songVak.src,
  "amok-trey": amokTrey.src,
  "kralan": kralan.src,
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

export function inferCategory(title: string, titleEn?: string | null): RecipeCategory {
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

export function mapEntryToRecipe(entry: EntryRow): Recipe {
  const ingredientsList = entry.ingredients
    ? entry.ingredients
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const instructionsList = entry.steps
    ? entry.steps
        .split("\n")
        .map((s) => s.trim().replace(/^\d+\.\s*/, ""))
        .filter(Boolean)
    : [];

  const name = entry.title_en || entry.title;
  const khmer = entry.title;
  const place = entry.source || "Battambang province";
  const note = entry.title_en
    ? `${entry.title_en} (${entry.title}) — traditional dish from ${place}.`
    : entry.title;

  return {
    id: entry.id,
    name,
    khmer,
    category: inferCategory(khmer, name),
    place,
    time: "30 min",
    servings: "4 servings",
    note,
    image: resolvePhotoUrl(entry.photo_url),
    ingredients: ingredientsList,
    instructions: instructionsList,
    owner: entry.owner ?? null,
    status: entry.status ?? "pending",
  };
}

export type EntryStatus = "pending" | "published" | "returned";

export function getStatusDetails(status: string | null | undefined): {
  labelEn: string;
  labelKm: string;
  combined: string;
  badgeClass: string;
} {
  switch (status) {
    case "published":
      return {
        labelEn: "Published",
        labelKm: "បានផ្សព្វផ្សាយ",
        combined: "Published / បានផ្សព្វផ្សាយ",
        badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      };
    case "returned":
      return {
        labelEn: "Returned for Revisions",
        labelKm: "បានប្រគល់ត្រឡប់មកវិញ",
        combined: "Returned for Revisions / បានប្រគល់ត្រឡប់មកវិញ",
        badgeClass: "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-400",
      };
    case "pending":
    default:
      return {
        labelEn: "Pending Review",
        labelKm: "កំពុងរង់ចាំការពិនិត្យ",
        combined: "Pending Review / កំពុងរង់ចាំការពិនិត្យ",
        badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400",
      };
  }
}

