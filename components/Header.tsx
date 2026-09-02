import React from "react";
import collection from "../collection.config";

const styles = {
  heroContainer: {
    padding: "60px 24px 32px",
    maxWidth: 1080,
    margin: "0 auto",
  },
  kicker: {
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    fontSize: 13,
    letterSpacing: 1.5,
    margin: "0 0 12px 0",
    textTransform: "uppercase" as const,
  },
  title: {
    fontSize: 42,
    fontWeight: 700,
    margin: "0 0 16px 0",
    lineHeight: 1.2,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 18,
    color: "#97A1B3",
    lineHeight: 1.6,
    margin: "0 0 32px 0",
    maxWidth: 820,
  },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  card: {
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    padding: "20px 24px",
  },
  cardLabel: {
    fontFamily: "'Courier New', monospace",
    fontSize: 11,
    color: "#97A1B3",
    margin: "0 0 6px 0",
    letterSpacing: 1,
  },
  cardValue: {
    fontSize: 15,
    color: "#E8EDF2",
    margin: 0,
    lineHeight: 1.5,
    fontWeight: 500,
  },
};

export default function Header() {
  return (
    <section style={styles.heroContainer}>
      <p style={styles.kicker}>CURATED DIGITAL ARCHIVE</p>
      <h1 style={styles.title}>{collection.name}</h1>
      <p style={styles.description}>{collection.description}</p>

      <div style={styles.metaGrid}>
        <div style={styles.card}>
          <p style={styles.cardLabel}>CURATED BY</p>
          <p style={styles.cardValue}>{collection.curator}</p>
        </div>
        <div style={styles.card}>
          <p style={styles.cardLabel}>KNOWLEDGE SOURCE</p>
          <p style={styles.cardValue}>{collection.source}</p>
        </div>
      </div>
    </section>
  );
}
