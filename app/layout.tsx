import type { Metadata } from "next";

import "@/styles.css";

export const metadata: Metadata = {
  title: {
    default: "Traditional Khmer Recipes of Battambang",
    template: "%s — Traditional Khmer Recipes",
  },
  description: "Nine traditional Khmer recipes from Battambang province, Cambodia.",
  openGraph: {
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Moul&family=Battambang:wght@400;700&family=Cormorant+Garamond:wght@500;600&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
