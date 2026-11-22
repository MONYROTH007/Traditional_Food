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
   * Provenance, straight from the `source` / `source_en` columns. Rendered in
   * the reader's language by `recipeMeta()` in @/lib/i18n.
   *
   * There is deliberately no `time`, `servings` or `note` here. Those were
   * hardcoded constants ("30 min", "Serves 4", a one-line template) shown
   * identically on every dish, which made the archive assert things it did
   * not know — Kralan's card claimed 30 minutes while its own steps say it
   * roasts for 1 to 1.5 hours.
   */
  source: string | null;
  sourceEn?: string | null;
  image: string;
  ingredients: string[];
  instructions: string[];
  ingredientsEn?: string[];
  instructionsEn?: string[];
  owner?: string | null;
  status?: "pending" | "published" | "returned" | string | null;
};
