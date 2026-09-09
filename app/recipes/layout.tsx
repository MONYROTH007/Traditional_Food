import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nine Khmer Recipes from Battambang",
  description:
    "Nine traditional Khmer recipes from Battambang province: kralan, amok trey, samlor korko, num banh chok and more.",
  openGraph: {
    title: "Nine Khmer Recipes from Battambang",
    description: "Kralan, amok trey, samlor korko and other dishes of Battambang province.",
  },
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
