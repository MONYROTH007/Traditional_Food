"use client";
import React from "react";
import { NavTab } from "../types";

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenUpload: () => void;
}

export default function Navbar({ activeTab, onSelectTab, onOpenUpload }: NavbarProps) {
  const tabs: NavTab[] = ["Home", "Recipes", "About", "Contact"];

  return (
    <header className="glass-header" style={{ position: "sticky", top: 0, zIndex: 100 }}>
      <div
        style={{
          maxWidth: 1140,
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => onSelectTab("Home")}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
          <p style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 16, color: "#2EE6A8", letterSpacing: 1.2, margin: 0 }}>
            KHMER LIVING ARCHIVE
          </p>
        </div>

        <nav>
          <ul style={{ display: "flex", alignItems: "center", gap: 24, listStyle: "none", margin: 0, padding: 0 }}>
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <li key={tab}>
                  <button
                    onClick={() => onSelectTab(tab)}
                    style={{
                      background: "none",
                      border: "none",
                      color: isActive ? "#2EE6A8" : "#94A3B8",
                      fontSize: 14,
                      fontWeight: isActive ? 600 : 500,
                      cursor: "pointer",
                      padding: "6px 12px",
                      borderRadius: 6,
                      backgroundColor: isActive ? "rgba(46, 230, 168, 0.1)" : "transparent",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {tab}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <button className="btn-primary" onClick={onOpenUpload} style={{ fontSize: 13, padding: "8px 14px" }}>
          + Upload Dish Photo
        </button>
      </div>
    </header>
  );
}
