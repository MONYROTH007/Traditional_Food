import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nhoam Khmer — Traditional Cambodian Foods",
  description:
    "An interactive guide to five essential dishes of Cambodia: their origins, ingredients, and where in the country they come from.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
