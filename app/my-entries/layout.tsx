import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Entries | Traditional Khmer Recipes (Battambang)",
  description: "View and manage your contributed traditional recipes and their curation status.",
};

export default function MyEntriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
