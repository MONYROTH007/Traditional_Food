export type RecipeCategory =
  "Soups & Stews" | "Main Dishes" | "Noodles & Rice" | "Snacks & Desserts";

export const RECIPE_CATEGORIES: RecipeCategory[] = [
  "Soups & Stews",
  "Main Dishes",
  "Noodles & Rice",
  "Snacks & Desserts",
];

export type Recipe = {
  id: string;
  name: string;
  khmer: string;
  category: RecipeCategory;
  /*
   * Display strings that are derived, not stored. They are null on entries
   * mapped from the database and are rendered in the active language by
   * `recipeMeta()` in @/lib/i18n — baking English in here leaked it into the
   * Khmer UI.
   */
  place: string | null;
  /** English rendering of `place`/`contributor` (the `source_en` column). */
  placeEn?: string | null;
  contributorEn?: string | null;
  time: string | null;
  servings?: string | null;
  note: string | null;
  image: string;
  ingredients: string[];
  instructions: string[];
  ingredientsEn?: string[];
  instructionsEn?: string[];
  owner?: string | null;
  status?: "pending" | "published" | "returned" | string | null;
  contributor?: string | null;
};
