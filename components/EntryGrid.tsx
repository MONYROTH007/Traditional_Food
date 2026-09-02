"use client";
import React, { useState } from "react";
import EntryCard from "./EntryCard";
import { ArchiveEntry } from "../types";

interface EntryGridProps {
  entries: ArchiveEntry[];
  onUpdateImage: (id: string, newImageUrl: string) => void;
  onOpenUpload: () => void;
}

export default function EntryGrid({ entries, onUpdateImage, onOpenUpload }: EntryGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Main Dish", "Soup / Stew", "Noodle Dish", "Dip & Side", "Salad / Appetizer"];

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.titleKhmer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.titleEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || entry.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section style={{ maxWidth: 1140, margin: "0 auto", padding: "0 24px 64px" }}>
      {/* Search & Filter Bar */}
      <div
        className="glass-card"
        style={{
          padding: "20px 24px",
          marginBottom: 32,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <input
            className="form-input"
            placeholder="🔍 Search Khmer dishes, recipes, or ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background: selectedCategory === cat ? "rgba(46, 230, 168, 0.18)" : "rgba(255, 255, 255, 0.04)",
                  color: selectedCategory === cat ? "#2EE6A8" : "#94A3B8",
                  border: selectedCategory === cat ? "1px solid rgba(46, 230, 168, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: 20,
                  padding: "6px 14px",
                  fontSize: 12,
                  cursor: "pointer",
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={onOpenUpload} style={{ fontSize: 13, padding: "8px 14px" }}>
            + Add Recipe
          </button>
        </div>
      </div>

      {/* Grid Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: "#E8EDF2", margin: 0 }}>
          COLLECTION ENTRIES ({filteredEntries.length})
        </h2>
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: 13, color: "#2EE6A8" }}>
          {entries.length} Total Archival Dishes
        </span>
      </div>

      {/* Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 24,
        }}
      >
        {filteredEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} onUpdateImage={onUpdateImage} />
        ))}
      </div>
    </section>
  );
}
