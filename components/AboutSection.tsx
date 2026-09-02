import React from "react";
import collection from "../collection.config";

export default function AboutSection() {
  return (
    <section style={{ maxWidth: 900, margin: "40px auto", padding: "0 24px" }}>
      <div className="glass-card" style={{ padding: 40 }}>
        <p style={{ fontFamily: "'Courier New', monospace", color: "#2EE6A8", fontSize: 13, letterSpacing: 1.5, marginBottom: 12 }}>
          ABOUT THE ARCHIVE
        </p>
        <h1 style={{ fontSize: 36, fontWeight: 700, color: "#FFF", marginBottom: 16 }}>{collection.name}</h1>
        <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.7, marginBottom: 32 }}>{collection.description}</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 24, marginTop: 32 }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: 24, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#2EE6A8", marginBottom: 8 }}>CURATOR</p>
            <h3 style={{ fontSize: 20, color: "#FFF" }}>{collection.curator}</h3>
            <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 8 }}>Leading the preservation of rural Khmer home cooking methods.</p>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: 24, borderRadius: 12, border: "1px solid rgba(255, 255, 255, 0.06)" }}>
            <p style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color: "#F59E0B", marginBottom: 8 }}>KNOWLEDGE SOURCE</p>
            <h3 style={{ fontSize: 18, color: "#FFF" }}>{collection.source}</h3>
            <p style={{ fontSize: 14, color: "#94A3B8", marginTop: 8 }}>Gathered directly through field interviews with community elders.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
