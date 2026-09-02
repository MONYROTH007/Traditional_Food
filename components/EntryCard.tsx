"use client";
import React, { ChangeEvent } from "react";
import { ArchiveEntry } from "../types";

interface EntryCardProps {
  entry: ArchiveEntry;
  onUpdateImage: (id: string, newImageUrl: string) => void;
}

export default function EntryCard({ entry, onUpdateImage }: EntryCardProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateImage(entry.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <article className="glass-card" style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Dish Image container */}
      <div style={{ position: "relative", width: "100%", height: 210, overflow: "hidden", background: "#181E2A" }}>
        {entry.imageUrl ? (
          <img
            src={entry.imageUrl}
            alt={entry.titleEnglish}
            style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
          />
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#64748B", fontSize: 13 }}>
            No Dish Photo
          </div>
        )}

        {/* Upload overlay trigger */}
        <label
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "rgba(11, 15, 23, 0.85)",
            backdropFilter: "blur(6px)",
            color: "#2EE6A8",
            border: "1px solid rgba(46, 230, 168, 0.4)",
            borderRadius: 20,
            padding: "4px 10px",
            fontSize: 11,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📷 Change Photo
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
        </label>
      </div>

      {/* Card Content */}
      <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: "#2EE6A8",
                backgroundColor: "rgba(46, 230, 168, 0.12)",
                padding: "3px 10px",
                borderRadius: 12,
                border: "1px solid rgba(46, 230, 168, 0.2)",
              }}
            >
              {entry.category}
            </span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>📍 {entry.province}</span>
          </div>

          <h3 style={{ fontSize: 22, fontWeight: 700, color: "#FFFFFF", margin: "0 0 4px 0", lineHeight: 1.3 }}>
            {entry.titleKhmer}
          </h3>
          <p style={{ fontSize: 13, color: "#2EE6A8", fontStyle: "italic", margin: "0 0 12px 0" }}>
            {entry.titleEnglish}
          </p>
          <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: "0 0 20px 0" }}>
            {entry.description}
          </p>
        </div>

        <div
          style={{
            borderTop: "1px solid var(--border-color)",
            paddingTop: 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 12,
            color: "#64748B",
          }}
        >
          <span>Entry #{entry.id}</span>
          <span>{entry.recordedDate}</span>
        </div>
      </div>
    </article>
  );
}
