"use client";
import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Header from "../components/Header";
import EntryGrid from "../components/EntryGrid";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import UploadModal from "../components/UploadModal";
import { initialEntries } from "../data/entries";
import { ArchiveEntry, NavTab } from "../types";

export default function Home() {
  const [activeTab, setActiveTab] = useState<NavTab>("Home");
  const [entries, setEntries] = useState<ArchiveEntry[]>(initialEntries);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUpdateImage = (id: string, newImageUrl: string) => {
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? { ...entry, imageUrl: newImageUrl } : entry))
    );
  };

  const handleAddEntry = (newEntry: ArchiveEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  return (
    <div>
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenUpload={() => setIsModalOpen(true)}
      />

      <main>
        {activeTab === "Home" && (
          <>
            <Header />
            <EntryGrid
              entries={entries}
              onUpdateImage={handleUpdateImage}
              onOpenUpload={() => setIsModalOpen(true)}
            />
          </>
        )}

        {activeTab === "Recipes" && (
          <div style={{ paddingTop: 32 }}>
            <EntryGrid
              entries={entries}
              onUpdateImage={handleUpdateImage}
              onOpenUpload={() => setIsModalOpen(true)}
            />
          </div>
        )}

        {activeTab === "About" && <AboutSection />}

        {activeTab === "Contact" && <ContactSection />}
      </main>

      <UploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEntry={handleAddEntry}
      />

      <footer
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          padding: "32px 24px",
          marginTop: 64,
          textAlign: "center",
          fontSize: 13,
          color: "#64748B",
          maxWidth: 1140,
          margin: "64px auto 0",
        }}
      >
        Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026.
        Khmer Living Archive preserves indigenous culinary heritage.
      </footer>
    </div>
  );
}
