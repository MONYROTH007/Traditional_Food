import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Share a family Khmer recipe from Battambang province or ask a question about the dishes on this site.",
  openGraph: {
    title: "Contact — Traditional Khmer Recipes",
    description: "Share a family recipe from Battambang or ask about a dish.",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
