import React from "react";
import collection from "../collection.config";
import "./globals.css";

export const metadata = {
  title: `${collection.name} — Khmer Living Archive`,
  description: collection.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          backgroundColor: "#14181F",
          color: "#E8EDF2",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Hanuman', 'Kantumruy Pro', sans-serif",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}
